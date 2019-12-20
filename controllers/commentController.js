var Post = require("../models/post");
var User = require("../models/user");
var Comment = require("../models/comment");

const validator = require("express-validator");
const async = require("async");

exports.comment_create_post = [
  // Validate fields.
  validator
    .body("content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 }),

  // Sanitize fields (using wildcard).
  validator.sanitizeBody("*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a Comment object with escaped and trimmed data.
    var comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      created_on: Date.now(),
      post: req.body.post_id
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          post: function(callback) {
            Post.findById(req.body.post_id)
              .populate("author")
              .exec(callback);
          },
          comments: function(callback) {
            Comment.find({ post: req.body.post_id })
              .populate("author")
              .exec(callback);
          }
        },
        function(err, results) {
          if (err) {
            return next(err);
          }
          // There are errors. Render form again with sanitized values/error messages.
          res.render("post_detail", {
            title: "Post Detail",
            post: results.post,
            current_user: req.user,
            comment: comment,
            comments: results.comments,
            errors: errors.array()
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save post.
      comment.save(function(err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to post record.
        Post.findById(req.body.post_id, function(err, post) {
          res.redirect(post.url);
        });
      });
    }
  }
];
