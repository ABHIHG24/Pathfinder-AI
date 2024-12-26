const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    communityId: { type: String, required: true },
    userName: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", chatSchema);
