var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String },
  facebook: Schema.Types.Mixed,
  image: { type: String }
});

// Virtual for user's URL
UserSchema.virtual("url").get(function() {
  return "/odinbook/user/" + this._id;
});

//Export model
module.exports = mongoose.model("User", UserSchema);
