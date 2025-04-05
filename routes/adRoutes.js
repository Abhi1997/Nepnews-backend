const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const uploads = require("../config/multer");
const Ad = require("../models/adModel");

const validCategories = ["education", "politics", "sports", "health", "other"];
router.post("/", uploads.single("image"), async (req, res) => {
  try {
    const { title, url, category } = req.body;

    // Validate Category Before Uploading Image
    if (!validCategories.includes(category)) {
      return res.status(400).json({ msg: "Invalid category name" });
    }
    // Check if an ad with the same title already exists
    const existingAd = await Ad.findOne({ title: req.body.title });

    if (existingAd) {
      return res.status(400).json({ msg: "Ad with this title already exists" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);

    const placementOptions = [
      "banner",
      "interstitial",
      "native",
      "rewarded",
      "popup",
    ];

    // Randomly select a placement
    const placement =
      placementOptions[Math.floor(Math.random() * placementOptions.length)];

    let ad = new Ad({
      title: req.body.title,
      placement,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
      url: req.body.url,
      category: req.body.category,
    });

    await ad.save();

    console.log(" Ad saved to database!");

    // Send response
    return res.status(201).json({ msg: "Ad created successfully", ad });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "Server error during ad creation", error: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    let ad = await Ad.find();
    res.json(ad);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    //find ad by id
    let ad = await Ad.findById(req.params.id);
    //Delete image from cloudinary
    await cloudinary.uploader.destroy(ad.cloudinary_id);
    //Delete ad from db
    await Ad.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});
router.put("/:id", uploads.single("image"), async (req, res) => {
  try {
    let ad = await Ad.findById(req.params.id);
    await cloudinary.uploader.destroy(ad.cloudinary_id);
    const result = await cloudinary.uploader.upload(req.file.path);
    const data = {
      title: req.body.title || ad.title,
      placement: ad.placement,
      avatar: result.secure_url || ad.avatar,
      cloudinary_id: result.public_id || ad.cloudinary_id,
      url: req.body.url || ad.url,
      category: req.body.category || ad.category,
    };
    ad = await Ad.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(ad);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
