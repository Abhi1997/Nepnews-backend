// models/adModel.js
const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ad title is required"],
      trim: true,
      unique: true,
    },
    placement: {
      type: String,
      enum: ["banner", "interstitial", "native", "rewarded", "popup"],
      required: true,
    },
    avatar: {
      type: String,
      required: [true, "Ad image URL is required"],
    },
    cloudinary_id: {
      type: String,
      required: [true, "Ad image URL is required"],
    },
    url: {
      type: String,
      required: [true, "Ad URL is required"],
    },
    category: {
      type: String,
      enum: [
        "education",
        "politics",
        "sports",
        "health",
        "other",
      ],
      required: [true, "Ad category is required"],
    },
  },
  { timestamps: true }
);

adSchema.index({ title: 1}, { unique: true });
module.exports = mongoose.model("Ad", adSchema);
