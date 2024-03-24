const {
  addDonationQuery,
  getDonationsQuery,
  getDonationByIdQuery,
  deleteDonationByIdQuery,
} = require("../database/queries/donation");
const { defaultPaginationLimit } = require("../constants/general");
const asyncHandler = require("express-async-handler");
const { promisify } = require("util");
const pool = require("../config/db");
const poolQuery = promisify(pool.query).bind(pool);
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads/donations/";
    // create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
const uploadMiddleware = upload.single("image");

const addDonationDB = asyncHandler(async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      // handle multer file upload errors
      return res.status(400).json({ message: err.message });
    }
    const {
      name,
      description,
      quantity,
      start_date,
      end_date,
      transport_provided,
      phone,
      pick_up_point,
    } = req.body;

    if (
      !name ||
      !description ||
      !quantity ||
      !start_date ||
      !end_date ||
      !phone
    ) {
      res.status(400);
      throw new Error("Please fill all fields");
    }

    const imageId = req.file ? req.file.filename : null;
    try {
      const result = await poolQuery(addDonationQuery, [
        name,
        description,
        quantity,
        imageId,
        start_date,
        end_date,
        transport_provided,
        phone,
        pick_up_point,
      ]);
      if (!result || !result.rows || result.rows.length === 0) {
        return res.status(500).json("Unexpected database result");
      }

      res
        .status(201)
        .json(`Donation ${result.rows[0].donation_id} has been created!`);
    } catch (err) {
      console.error("Error adding donation:", err);
      res.status(500).json("Unexpected error");
    }
  });
});

const getDonationById = asyncHandler(async (req, res) => {
  const { donation_id } = req.params;
  try {
    const result = await poolQuery(getDonationByIdQuery, [
      parseInt(donation_id),
    ]);
    if (!result || !result.rows || result.rows.length === 0) {
      return res.status(404).json("Donation not found");
    }

    const donation = result.rows[0];
    if (donation.image_id) {
      donation.imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/donations/${donation.image_id}`;
    }
    res.json(donation);
  } catch (err) {
    console.error("Error getting donations by id:", err);
    res.status(500).json("Unexpected error");
  }
});

const getDonations = asyncHandler(async (req, res) => {
  try {
    const result = await poolQuery(getDonationsQuery);
    if (!result || !result.rows || result.rows.length === 0) {
      return res.status(404).json("Donations not found");
    }
    // Map over the results to include the image URL for each donation
    const donationsWithImages = result.rows.map((donation) => {
      if (donation.image_id) {
        return {
          ...donation,
          imageUrl: `${req.protocol}://${req.get("host")}/uploads/donations/${
            donation.image_id
          }`,
        };
      }
      return donation;
    });

    res.json(donationsWithImages);
  } catch (err) {
    console.error("Error getting donations:", err);
    res.status(500).json("Unexpected error");
  }
});

const deleteDonationById = asyncHandler(async (req, res) => {
  const { donation_id } = req.params;
  try {
    const result = await poolQuery(deleteDonationByIdQuery, [
      parseInt(donation_id),
    ]);
    if (!result || !result.rows || result.rows.length === 0) {
      return res
        .status(200)
        .json(`Donation with ID ${donation_id} has been deleted`);
    }
    res.json(`Donation with ID ${donation_id} has been deleted`);
  } catch (err) {
    console.error("Error getting project by id:", err);
    res.status(500).json("Unexpected error");
  }
});

module.exports = {
  addDonationDB,
  getDonationById,
  getDonations,
  deleteDonationById,
};
