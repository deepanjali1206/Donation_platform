const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cirleaid.netlify.app/", 
      "*"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

app.use("/images", express.static(path.join(__dirname, "public/images")));


const authRoutes = require("./routes/auth.routes");
const donationRoutes = require("./routes/donationRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentsRoute = require("./routes/payments");
const campaignRoutes = require("./routes/campaignRoutes");
const reportRoutes = require("./routes/reportRoutes");
const ngoRoutes = require("./routes/ngoRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentsRoute);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ngos", ngoRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
