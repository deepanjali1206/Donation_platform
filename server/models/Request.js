const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
  
    title: { type: String, required: true },
    category: { type: String, required: true }, 
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },

  
    item: { type: String },
    urgency: { type: String },
    quantity: { type: Number },

    amount: { type: Number },
    notes: { type: String },

 
    bloodGroup: { type: String },
    date: { type: String }, 
    location: { type: String },

    isNGO: { type: Boolean, default: false },
    coordinates: { type: [Number], default: [0, 0] }, 

    
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Request =
  mongoose.models.Request || mongoose.model("Request", requestSchema);

module.exports = Request;
