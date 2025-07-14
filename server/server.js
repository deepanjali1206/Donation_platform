const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // required for normal POSTs, not multipart
app.use("/uploads", express.static("uploads"));

const authRoutes = require("./routes/auth.routes");
const donationRoutes = require("./routes/donationRoutes");
const requestRoutes = require("./routes/requestRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
