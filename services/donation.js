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

function isValidDate(dateString) {
  const date = new Date(dateString);
  return (
    date &&
    !isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === dateString
  );
}

const addDonationDB = asyncHandler(async (req, res) => {
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
    !transport_provided ||
    !phone
  ) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  if (!isValidDate(start_date) || (!isValidDate(end_date) && to !== null)) {
    return res.status(400).json("Invalid date format");
  }
  try {
    const result = await poolQuery(addDonationQuery, [
      name,
      description,
      quantity,
      start_date,
      end_date,
      transport_provided,
      phone,
      pick_up_point,
    ]);
    if (!result || !result.rows || result.rows.length === 0) {
      return res.status(500).json("Unexpected database result");
    }

    res.json(`Donation ${result.rows[0].donation_id} has been created!`);
  } catch (err) {
    console.error("Error adding donation:", err);
    res.status(500).json("Unexpected error");
  }
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
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error getting donations by id:", err);
    res.status(500).json("Unexpected error");
  }
});

const getDonations = asyncHandler(async (req, res) => {
  try {
    const result = await poolQuery(getDonationsQuery);
    if (!result || !result.rows || result.rows.length === 0) {
      return res.status(404).json("Donation not found");
    }
    res.json(result.rows);
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
