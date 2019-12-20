#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var bcrypt = require("bcryptjs");
var faker = require("faker");
var User = require("./models/user");
var Post = require("./models/post");
var Comment = require("./models/comment");
var Friendship = require("./models/friendship");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var users = [];
var posts = [];
var comments = [];
var friendships = [];

function userCreate(username, password, image, cb) {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    let userdetail = { username: username, password: hashedPassword };

    if (image) {
      userdetail.image = image;
    }

    var user = new User(userdetail);
    user.save(function(err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log("New User: " + user);
      users.push(user);
      cb(null, user);
    });
  });
}

function postCreate(title, content, author, created_on, likes, image, cb) {
  let postdetail = {
    title: title,
    content: content,
    author: author,
    created_on: created_on,
    likes: likes
  };

  if (image) {
    postdetail.image = image;
  }

  var post = new Post(postdetail);

  post.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Post: " + post);
    posts.push(post);
    cb(null, post);
  });
}

function commentCreate(content, author, post, created_on, cb) {
  let commentdetail = {
    content: content,
    author: author,
    post: post,
    created_on: created_on
  };

  var comment = new Comment(commentdetail);
  comment.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Comment: " + comment);
    comments.push(comment);
    cb(null, comment);
  });
}

function friendshipCreate(friending, befriended, open, cb) {
  let friendshipdetail = {
    friending: friending,
    befriended: befriended,
    open: open
  };

  var friendship = new Friendship(friendshipdetail);
  friendship.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Friendship: " + friendship);
    friendships.push(friendship);
    cb(null, friendship);
  });
}

function createUsers(cb) {
  async.series(
    [
      function(callback) {
        userCreate(
          faker.internet.userName(),
          "foobar",
          faker.image.avatar(),
          callback
        );
      },
      function(callback) {
        userCreate(
          faker.internet.userName(),
          "foobar",
          faker.image.avatar(),
          callback
        );
      },
      function(callback) {
        userCreate(
          faker.internet.userName(),
          "foobar",
          faker.image.avatar(),
          callback
        );
      },
      function(callback) {
        userCreate(faker.internet.userName(), "foobar", null, callback);
      }
    ],
    // optional callback
    cb
  );
}

function createPosts(cb) {
  async.parallel(
    [
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[0],
          new Date(faker.date.past()),
          10,
          null,
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[0],
          new Date(faker.date.past()),
          5,
          faker.image.animals(),
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[0],
          new Date(faker.date.past()),
          6,
          faker.image.transport(),
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[1],
          new Date(faker.date.past()),
          0,
          faker.image.people(),
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[1],
          new Date(faker.date.past()),
          7,
          faker.image.nightlife(),
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[2],
          new Date(faker.date.past()),
          3,
          faker.image.city(),
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[2],
          new Date(faker.date.past()),
          3,
          null,
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[2],
          new Date(faker.date.past()),
          16,
          faker.image.food(),
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[2],
          new Date(faker.date.past()),
          6,
          faker.image.nature(),
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[2],
          new Date(faker.date.past()),
          2,
          faker.image.sports(),
          callback
        );
      },
      function(callback) {
        postCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          users[2],
          new Date(faker.date.past()),
          6,
          faker.image.abstract(),
          callback
        );
      }
    ],
    // optional callback
    cb
  );
}

function createComments(cb) {
  async.parallel(
    [
      function(callback) {
        commentCreate(
          faker.lorem.sentence(),
          users[1],
          posts[0],
          new Date(faker.date.past()),
          callback
        );
      },
      function(callback) {
        commentCreate(
          faker.lorem.sentence(),
          users[2],
          posts[0],
          new Date(faker.date.past()),
          callback
        );
      },
      function(callback) {
        commentCreate(
          faker.lorem.sentence(),
          users[2],
          posts[0],
          new Date(faker.date.past()),
          callback
        );
      },
      function(callback) {
        commentCreate(
          faker.lorem.sentence(),
          users[3],
          posts[0],
          new Date(faker.date.past()),
          callback
        );
      },
      function(callback) {
        commentCreate(
          faker.lorem.sentence(),
          users[1],
          posts[4],
          new Date(faker.date.past()),
          callback
        );
      }
    ],
    // Optional callback
    cb
  );
}

function createFriendships(cb) {
  async.parallel(
    [
      function(callback) {
        friendshipCreate(users[1], users[0], true, callback);
      },
      function(callback) {
        friendshipCreate(users[2], users[3], false, callback);
      },
      function(callback) {
        friendshipCreate(users[3], users[2], false, callback);
      },
      function(callback) {
        friendshipCreate(users[1], users[3], false, callback);
      },
      function(callback) {
        friendshipCreate(users[3], users[1], false, callback);
      },
      function(callback) {
        friendshipCreate(users[2], users[0], true, callback);
      }
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createUsers, createPosts, createComments, createFriendships],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Friendships: " + friendships);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
