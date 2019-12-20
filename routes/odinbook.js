var express = require("express");
var router = express.Router();

// Require controller modules.
var user_controller = require("../controllers/userController");
var friendship_controller = require("../controllers/friendshipController");
var post_controller = require("../controllers/postController");
var comment_controller = require("../controllers/commentController");

var multer = require("multer");
var upload = multer({ dest: "public/images/" });

/// USER ROUTES ///

// GET request for all users
router.get("/users", isAuthenticated, user_controller.user_all);

// GET request for creating a User (sign-up). NOTE This must come before routes that display User (uses id).
router.get("/user/sign-up", user_controller.user_create_get);

// POST request for creating a User (sign-up)
router.post("/user/sign-up", user_controller.user_create_post);

// GET request for logging a user in
router.get("/user/log-in", user_controller.user_log_in_get);

// POST request for logging a user in
router.post("/user/log-in", user_controller.user_log_in_post);

// GET request for logging a user out
router.get("/user/log-out", isAuthenticated, user_controller.user_log_out_get);

//POST request to update/upload profile picture
router.post(
  "/user/update-img",
  isAuthenticated,
  upload.single("image"),
  user_controller.user_update_img
);

// GET request for one User.
router.get("/user/:id", isAuthenticated, user_controller.user_detail);

function isAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect("/odinbook/user/log-in");
}

/// FRIENDSHIP ROUTES ///
// GET request for sending out a friendrequest
router.get(
  "/friendrequest/create",
  isAuthenticated,
  friendship_controller.friendrequest_create_get
);

// POST request for sending out a friendrequest
router.post(
  "/friendrequest/create",
  isAuthenticated,
  friendship_controller.friendrequest_create_post
);

// POST request for confirming a friendrequest = creating a friendship
router.post(
  "/friendship/create",
  isAuthenticated,
  friendship_controller.friendship_create_post
);

/// POST ROUTES ///
// GET POST index page = odinbook home page.
router.get("/", isAuthenticated, post_controller.index);

// GET request for creating a post
router.get("/post/create", isAuthenticated, post_controller.post_create_get);

// POST request for creating a post
router.post(
  "/post/create",
  isAuthenticated,
  upload.single("image"),
  post_controller.post_create_post
);

// PUT request for liking a post
router.post("/post/like", isAuthenticated, post_controller.post_like_post);

// GET request for one Post.
router.get("/post/:id", isAuthenticated, post_controller.post_detail);

/// COMMENT ROUTES ///

// POST request for creating a comment
router.post(
  "/comment/create",
  isAuthenticated,
  comment_controller.comment_create_post
);

module.exports = router;
