var User = require("../models/user");
var Friendship = require("../models/friendship");
var Post = require("../models/post");

const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const passport = require("passport");

exports.user_all = function(req, res, next) {
  async.parallel(
    {
      users: function(callback) {
        User.find({})
          .sort("username")
          .exec(callback);
      },
      friendrequests_friending: function(callback) {
        Friendship.find({ friending: req.user._id })
          .populate("befriended")
          .exec(callback);
      },
      friendrequests_befriended: function(callback) {
        Friendship.find({ befriended: req.user._id })
          .populate("friending")
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }

      // Array of usernames that should not get a friendrequest button
      let noButton = [req.user.username];
      for (let i = 0; i < results.friendrequests_friending.length; i++) {
        noButton.push(results.friendrequests_friending[i].befriended.username);
      }

      for (let i = 0; i < results.friendrequests_befriended.length; i++) {
        noButton.push(results.friendrequests_befriended[i].friending.username);
      }

      res.render("users_all", {
        title: "All users",
        users: results.users,
        current_user: req.user,
        noButton: noButton
      });
    }
  );
};

exports.user_detail = function(req, res, next) {
  async.parallel(
    {
      user: function(callback) {
        User.findById(req.params.id).exec(callback);
      },
      friendrequests_friending_open: function(callback) {
        Friendship.find({ friending: req.params.id, open: true })
          .populate("befriended")
          .exec(callback);
      },
      friendrequests_befriended_open: function(callback) {
        Friendship.find({ befriended: req.params.id, open: true })
          .populate("friending")
          .exec(callback);
      },
      friendships: function(callback) {
        Friendship.find({ friending: req.params.id, open: false })
          .populate("befriended")
          .exec(callback);
      },
      posts: function(callback) {
        Post.find({ author: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.user == null) {
        // No results.
        var err = new Error("User not found");
        err.status = 404;
        return next(err);
      }

      // Successful, so render
      res.render("user_detail", {
        title: "User Detail",
        user: results.user,
        current_user: req.user,
        friendrequests_friending_open: results.friendrequests_friending_open,
        friendrequests_befriended_open: results.friendrequests_befriended_open,
        friendships: results.friendships,
        posts: results.posts
      });
    }
  );
};

exports.user_create_get = function(req, res, next) {
  res.render("sign_up_form", { title: "Sign up" });
};

exports.user_create_post = [
  // Validate input data
  validator
    .body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must be specified."),

  validator
    .body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must at least be 6 characters long."),

  validator
    .check(
      "passwordConfirmation",
      "Password confirmation field must have the same value as the password field"
    )
    .exists()
    .custom((value, { req }) => value === req.body.password),

  // Sanitize (escape) the input field.
  validator.sanitizeBody("username").escape(),
  validator.sanitizeBody("password").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        if (err) {
          err.msg = "Invalid Password.";
          return next(err);
        }
      }
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);

      // Create a genre object with escaped and trimmed data.
      var user = new User({
        username: req.body.username,
        password: hashedPassword
      });

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("sign_up_form", {
          title: "Sign up",
          user: user,
          errors: errors.array()
        });
        return;
      } else {
        // Data from form is valid.
        // Check if User with same username already exists.
        User.findOne({ username: req.body.username }).exec(function(
          err,
          found_user
        ) {
          if (err) {
            return next(err);
          }

          if (found_user) {
            // User exists, render form again.
            res.render("sign_up_form", {
              title: "Sign up",
              user: user,
              errors: [{ msg: "Username is already taken" }]
            });
            return;
          } else {
            user.save(function(err) {
              if (err) {
                return next(err);
              }
              // User saved. Redirect to user detail page.
              req.login(user, function(err) {
                if (!err) {
                  res.redirect(user.url);
                } else {
                  if (err) {
                    return next(err);
                  }
                }
              });
            });
          }
        });
      }
    });
  }
];

exports.user_log_in_get = function(req, res, next) {
  res.render("log_in_form", {
    title: "Login",
    messages: req.session.messages || []
  });
  req.session.messages = [];
};

exports.user_log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/odinbook/user/log-in",
  failureMessage: "Invalid username or password."
});

exports.user_log_out_get = function(req, res) {
  req.logout();
  res.redirect("/");
};

exports.user_update_img = function(req, res) {
  let updateUser = {
    _id: req.user._id
  };

  // Set image if a file is uploaded
  if (req.file) {
    updateUser.image = "/images/" + req.file.filename;
  }

  User.findByIdAndUpdate(req.user, updateUser, {}, function(err, user) {
    if (err) {
      return next(err);
    }
    res.redirect(user.url);
  });
};
