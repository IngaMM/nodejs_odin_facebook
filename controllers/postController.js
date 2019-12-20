var Post = require("../models/post");
var User = require("../models/user");
var Comment = require("../models/comment");
var Friendship = require("../models/friendship");

const validator = require("express-validator");
const async = require("async");

exports.index = function(req, res) {
  Friendship.find({ friending: req.user._id, open: false }, function(
    err,
    friendships
  ) {
    if (err) {
      return next(err);
    }
    timelineIds = [req.user._id];
    friendships.forEach(friendship => {
      timelineIds.push(friendship.befriended._id);
    });
    Post.find({
      author: {
        $in: timelineIds
      }
    })
      .populate("author")
      .sort("-created_on")
      .exec(function(err, posts) {
        if (err) {
          return next(err);
        }
        res.render("index", {
          title: "Welcome to Odinbook",
          current_user: req.user,
          posts: posts
        });
      });
  });
};

exports.post_create_get = function(req, res, next) {
  res.render("post_form", {
    title: "Write a post",
    current_user: req.user
  });
};

exports.post_create_post = [
  // Validate fields.
  validator
    .body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 }),

  // Sanitize fields (using wildcard).
  validator.sanitizeBody("*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a Post object with escaped and trimmed data.
    var post = new Post({
      title: req.body.title,
      author: req.user._id,
      created_on: Date.now(),
      content: req.body.content,
      likes: 0
    });

    // Set image if a file is uploaded
    if (req.file) {
      post.image = "/images/" + req.file.filename;
    }

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("post_form", {
        title: "Write a post",
        post: post,
        errors: errors.array(),
        current_user: req.user
      });
      return;
    } else {
      // Data from form is valid. Save post.
      post.save(function(err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new post record.
        res.redirect(post.url);
      });
    }
  }
];

exports.post_detail = function(req, res, next) {
  async.parallel(
    {
      post: function(callback) {
        Post.findById(req.params.id)
          .populate("author")
          .exec(callback);
      },
      comments: function(callback) {
        Comment.find({ post: req.params.id })
          .populate("author")
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.post == null) {
        // No results.
        var err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }

      // Successful, so render
      res.render("post_detail", {
        title: "Post Detail",
        post: results.post,
        current_user: req.user,
        comments: results.comments
      });
    }
  );
};

exports.post_like_post = function(req, res, next) {
  Post.findById(req.body.post_id, function(err, post) {
    if (err) {
      return next(err);
    }
    let postUpdate = { _id: post._id, likes: post.likes + 1 };
    Post.findByIdAndUpdate(post._id, postUpdate, { new: true }, function(
      err,
      updatedPost
    ) {
      res.redirect("back");
    });
  });
};
