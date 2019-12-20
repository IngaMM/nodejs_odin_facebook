var Friendship = require("../models/friendship");
var User = require("../models/user");

const validator = require("express-validator");
const async = require("async");

exports.friendrequest_create_get = function(req, res, next) {
  async.parallel(
    {
      users: function(callback) {
        User.find({}).exec(callback);
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

      // Array of usernames that should not be in dropdown menu
      let notInDropDown = [req.user.username];
      for (let i = 0; i < results.friendrequests_friending.length; i++) {
        notInDropDown.push(
          results.friendrequests_friending[i].befriended.username
        );
      }

      for (let i = 0; i < results.friendrequests_befriended.length; i++) {
        notInDropDown.push(
          results.friendrequests_befriended[i].friending.username
        );
      }

      let users = results.users.filter(user => {
        if (notInDropDown.indexOf(user.username) === -1) {
          return true;
        }
      });

      res.render("friendrequest_form", {
        title: "Send out a friendrequest",
        users: users,
        current_user: req.user
      });
    }
  );
};

exports.friendrequest_create_post = [
  validator.sanitizeBody("befriended").escape(),
  function(req, res, next) {
    var friendship = new Friendship({
      friending: req.user._id,
      befriended: req.body.befriended,
      open: true
    });

    friendship.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect(req.body.redirect || req.user.url);
    });
  }
];

exports.friendship_create_post = function(req, res, next) {
  Friendship.findOne(
    {
      befriended: req.user._id,
      friending: req.body.friending_id
    },
    function(err, friendrequest) {
      if (err) {
        return next(err);
      }
      let friendrequestUpdate = {
        _id: friendrequest._id,
        open: false
      };

      Friendship.findByIdAndUpdate(
        friendrequest._id,
        friendrequestUpdate,
        { new: true },
        function(err, updatedFriendrequest) {
          var friendship = new Friendship({
            friending: req.user._id,
            befriended: req.body.friending_id,
            open: false
          });
          friendship.save(function(err) {
            if (err) {
              return next(err);
            }
            res.redirect(req.user.url);
          });
        }
      );
    }
  );
};
