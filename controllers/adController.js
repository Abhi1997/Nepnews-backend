// controllers/adController.js
const Ad = require("../models/adModel");

exports.createAd = async (req, res) => {
  try {
    // Only adsManager or admin?
    if (req.user.role !== "adsManager" && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { placement, content } = req.body;
    const createdBy = req.user.userId;

    const ad = new Ad({
      placement,
      content,
      createdBy,
    });

    await ad.save();
    res.status(201).json({ msg: "Ad created", ad });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find({});
    res.json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateAd = async (req, res) => {
  try {
    // Only adsManager or admin
    if (req.user.role !== "adsManager" && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { adId } = req.params;
    const { placement, content } = req.body;
    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ msg: "Ad not found" });

    if (placement) ad.placement = placement;
    if (content) ad.content = content;

    await ad.save();
    res.json({ msg: "Ad updated", ad });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    // Only adsManager or admin
    if (req.user.role !== "adsManager" && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { adId } = req.params;
    await Ad.findByIdAndDelete(adId);
    res.json({ msg: "Ad deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
