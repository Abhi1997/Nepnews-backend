// models/logModel.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    action: { type: String, required: true },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    timestamp: { type: Date, default: Date.now },
    changes: {
      // optionally store the fields that changed
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
