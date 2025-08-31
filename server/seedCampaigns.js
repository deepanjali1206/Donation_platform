const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Campaign = require("./models/Campaign");

dotenv.config();

const campaigns = [
  {
    title: "Books for Underprivileged Kids",
    description: "Support children in rural areas by donating educational books and learning material.",
    goalAmount: 10000,
    raisedAmount: 2500,
    image: "/images/campaigns/book.png",
    category: "items"
  },
  {
    title: "Winter Clothes Drive",
    description: "Help provide warm clothes for families in North India during freezing winters.",
    goalAmount: 20000,
    raisedAmount: 6000,
    image: "/images/campaigns/wintercloth-donation.png",
    category: "items"
  },
  {
    title: "Blood Donation Camp",
    description: "Join our community initiative to donate blood and save lives in Delhi hospitals.",
    goalAmount: 100,
    raisedAmount: 45,
    image: "/images/campaigns/blood-donation.png",
    category: "blood"
  },
  {
    title: "Food Relief for Flood Victims",
    description: "Distribute ready-to-eat food packets and groceries to families affected by floods in Assam.",
    goalAmount: 50000,
    raisedAmount: 15000,
    image: "/images/campaigns/food-donation.png",
    category: "items"
  },
  {
    title: "Tree Plantation Drive",
    description: "Plant 5000 trees across rural Maharashtra to fight climate change and improve air quality.",
    goalAmount: 75000,
    raisedAmount: 20000,
    image: "/images/campaigns/tree-plantation.png",
    category: "money"
  },
  {
    title: "Medical Aid for Cancer Patients",
    description: "Support underprivileged cancer patients with chemotherapy medicines and hospital expenses.",
    goalAmount: 100000,
    raisedAmount: 25000,
    image: "/images/campaigns/medical-aid.png",
    category: "money"
  }
];

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ MongoDB Connected...");

    await Campaign.deleteMany(); // clear old data
    console.log("🗑️ Old campaigns removed");

    await Campaign.insertMany(campaigns); // insert new
    console.log("🌱 Campaigns seeded successfully!");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Error seeding campaigns:", err);
    mongoose.connection.close();
  });
