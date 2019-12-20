const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
var User = require("../models/user");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          return done(null, false);
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user);
          } else {
            // passwords do not match!
            return done(null, false);
          }
        });
        return done(null, user);
      });
    })
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["id", "displayName", "picture.type(large)"]
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne(
          {
            "facebook.id": profile.id
          },
          function(err, user) {
            if (err) {
              return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
              user = new User({
                username: profile.displayName,
                //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                facebook: profile._json
              });
              if (profile.photos) {
                user.image = profile.photos[0].value;
              }
              user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
              });
            } else {
              done(null, user);
            }
          }
        );
      }
    )
  );
};
