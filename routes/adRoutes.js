// routes/adRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createAd,
  getAllAds,
  updateAd,
  deleteAd,
} = require("../controllers/adController");

// Public route: show all ads if desired
router.get("/", getAllAds);

// Protected: create, update, delete (only adsManager / admin)
router.post("/", auth, createAd);
router.put("/:adId", auth, updateAd);
router.delete("/:adId", auth, deleteAd);

module.exports = router;
