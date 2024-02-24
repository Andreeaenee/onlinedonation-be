const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const {
  addDonationDB,
  getDonationById,
  getDonations,
  deleteDonationById,
} = require("../services/donation");

router.get("/donations", asyncHandler(getDonations));
router.get("/donations/:donation_id", asyncHandler(getDonationById));
router.post("/donation", asyncHandler(addDonationDB));
router.delete("/donations/:donation_id", asyncHandler(deleteDonationById));

module.exports = router;
