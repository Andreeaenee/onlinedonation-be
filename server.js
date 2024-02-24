const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const donationRouter = require("./routes/donation");

app.use(cors());
app.use(express.json());
app.use("/api", donationRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
