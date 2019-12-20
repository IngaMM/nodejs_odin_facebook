var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  content: { type: String, required: true },
  created_on: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

//Export model
module.exports = mongoose.model("Comment", CommentSchema);
