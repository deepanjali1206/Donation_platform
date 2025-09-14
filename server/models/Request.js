const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    requestType: { type: String, required: true },

    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    requesterPhone: { type: String, required: true },

    item: { type: String },
    urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    quantity: { type: Number },

    amount: { type: Number },
    notes: { type: String },

    bloodGroup: { type: String },
    date: { type: String },

    location: { type: String, required: true },
    deliveryPreference: { type: String, enum: ["pickup", "delivery"] },

    coordinates: {
      type: [Number],
      validate: {
        validator: (arr) => !arr || arr.length === 2,
        message: "coordinates must be [lon, lat]",
      },
    },

    isNGO: { type: Boolean, default: false },
    ngoStatus: { 
      type: String, 
      enum: ["not_applicable", "pending_documents", "documents_uploaded", "verified", "rejected"], 
      default: "not_applicable" 
    },
    ngoDocuments: [{
      filename: String,
      originalName: String,
      documentType: String,
      uploadedAt: { type: Date, default: Date.now },
      status: { type: String, default: "pending_review" }
    }],

    itemCategory: { type: String },
   
    paymentMode: { type: String, enum: ["credits", "money", "hybrid"] },
    useCredits: { type: Number, default: 0 },
    
    
    accountNumber: { type: String },
    accountHolderName: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
    
    
    razorpayPaymentId: { type: String },
    razorpayOrderId: { type: String },
    razorpaySignature: { type: String },

    attachment: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    creditsRequired: { type: Number, default: 0 },
    creditsUsed: { type: Number, default: 0 },
    isFreeRequest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Request || mongoose.model("Request", requestSchema);