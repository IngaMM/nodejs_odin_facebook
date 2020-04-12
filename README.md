Friendsbook (Odin Facebook)

By I. Mahle

A project of The Odin Project: https://www.theodinproject.com/courses/nodejs/lessons/odin-book

Instructions

1. Save all files in a folder
2. Run npm install
3. Run npm start
4. Open http://localhost:3000/ in a browser

Discussion
I used the following technologies: HTML, CSS (incl. Bootstrap), Mongodb, Javascript & Nodejs (Express).

Friendsbook has some functionalities that are similar to Facebook. It is built with the following requirements:

1. Users must sign in to see anything except the sign in page.
2. Users should be able to sign in using their real facebook details using Passportjs.
3. Users can send friend requests to other users.
4. A user must accept the friend request to become friends.
5. Users can create posts
6. Users can like posts.
7. Users can comment on posts.
8. Posts should always display with the post content, author, comments and likes.
9. Treat the Posts index page like the real Facebook’s “Timeline” feature – show all the recent posts from the current user and users she is friends with.
10. Users can create Profile with a photo (you can get this from the real facebook when you sign in using passport)
11. The User Show page contains their profile information, profile photo and posts.
12. The Users Index page lists all users and buttons for sending friend requests to those who are not already friends or who don’t already have a pending request.
13. Posts also allow images (either just via a url, or by uploading one). Uploading is currently only possible for a local version. The deployed version works with urls only.
14. Users can upload and update their own profile photo (either just via a url, or by uploading one). Uploading is currently only possible for a local version. The deployed version works with urls only.

Users and posts are populated with fake data using the Faker module from npm (seed.js).

A live version of this app can be found at https://evening-retreat-54412.herokuapp.com

Requirements
npm

User images & background image from https://unsplash.com
Christopher Campbell
Johannes Plenio
Julian Wan
Paweł Czerwiński (Background image)

Post images (URL) from http://lorempixel.com
