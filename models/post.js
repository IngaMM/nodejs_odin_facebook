var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  created_on: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: { type: Number, required: true },
  image: { type: String }
});

// Virtual for post's URL
PostSchema.virtual("url").get(function() {
  return "/odinbook/post/" + this._id;
});

//Export model
module.exports = mongoose.model("Post", PostSchema);
