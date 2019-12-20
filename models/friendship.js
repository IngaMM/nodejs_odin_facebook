var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FriendshipSchema = new Schema({
  friending: { type: Schema.Types.ObjectId, ref: "User", required: true },
  befriended: { type: Schema.Types.ObjectId, ref: "User", required: true },
  open: { type: Boolean, required: true }
});

//Export model
module.exports = mongoose.model("Friendship", FriendshipSchema);
