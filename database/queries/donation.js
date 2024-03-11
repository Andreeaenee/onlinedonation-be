const addDonationQuery = `INSERT INTO donation (name, description, quantity, image_id,  start_date, end_date, transport_provided, phone, pick_up_point)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING donation_id`;

const getDonationsQuery = "SELECT * FROM donation ORDER BY donation_id";

const getDonationByIdQuery = "SELECT * FROM donation WHERE donation_id = $1";

const deleteDonationByIdQuery = "DELETE FROM donation WHERE donation_id = $1";

module.exports = {
  addDonationQuery,
  getDonationByIdQuery,
  getDonationsQuery,
  deleteDonationByIdQuery,
};
