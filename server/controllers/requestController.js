const Request = require("../models/Request");
const User = require("../models/User");

exports.createRequest = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      title,
      category,
      requestType,
      requesterName,
      requesterEmail,
      requesterPhone,
      item,
      urgency,
      quantity,
      amount,
      notes,
      bloodGroup,
      date,
      location,
      deliveryPreference,
      isNGO,
      ngoStatus,
      itemCategory,
      paymentMode,
      useCredits,
      accountNumber,
      accountHolderName,
      ifscCode,
      bankName,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      coordinates
    } = req.body;

    const doc = {
      title,
      category,
      requestType,
      requesterName,
      requesterEmail,
      requesterPhone,
      item,
      urgency,
      quantity: quantity ? Number(quantity) : undefined,
      amount: amount ? Number(amount) : undefined,
      notes,
      bloodGroup,
      date,
      location,
      deliveryPreference,
      isNGO: isNGO === "true" || isNGO === true,
      ngoStatus: isNGO === "true" || isNGO === true ? ngoStatus : "not_applicable",
      itemCategory,
      paymentMode,
      useCredits: useCredits ? Number(useCredits) : 0,
      accountNumber,
      accountHolderName,
      ifscCode,
      bankName,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      user: req.user.id,
      status: "pending",
      isFreeRequest: false,
    };

    if (coordinates && typeof coordinates === "string") {
      const parts = coordinates.split(",").map((n) => Number(n.trim()));
      if (parts.length === 2 && parts.every((n) => !Number.isNaN(n))) {
        doc.coordinates = parts;
      }
    }

    
    if (req.files) {
      const ngoDocuments = [];
      Object.keys(req.files).forEach(key => {
        if (key.startsWith('ngoDocument_')) {
          const index = key.replace('ngoDocument_', '');
          const documentType = req.body[`ngoDocumentType_${index}`] || 'other';
          
          ngoDocuments.push({
            filename: `/uploads/${req.files[key][0].filename}`,
            originalName: req.files[key][0].originalname,
            documentType,
            uploadedAt: new Date(),
            status: "pending_review"
          });
        }
      });
      
      if (ngoDocuments.length > 0) {
        doc.ngoDocuments = ngoDocuments;
      }
      
      
      if (req.files.attachment) {
        doc.attachment = `/uploads/${req.files.attachment[0].filename}`;
      }
    }

    let requiredCredits = 0;
    let freeCase = false;

  
    if (
      doc.isNGO ||
      user.role === "elderly" ||
      user.role === "child" ||
      user.role === "supporter" ||
      doc.requestType === "blood" ||
      doc.urgency === "High"
    ) {
      freeCase = true;
      doc.isFreeRequest = true;
    } else if (doc.requestType === "item") {
    
      const qty = doc.quantity || 1;
      
      switch(doc.itemCategory) {
        case "books":
          requiredCredits = Math.min(qty * 5, 1000);
          break;
        case "clothes":
          requiredCredits = Math.min(qty * 5, 1000);
          break;
        case "food":
          requiredCredits = Math.min(qty * 5, 1000);
          break;
        default:
          requiredCredits = 35;
      }
      
      doc.creditsRequired = requiredCredits;
      
    
      if (doc.paymentMode === "credits") {
        doc.creditsUsed = requiredCredits;
      } else if (doc.paymentMode === "hybrid") {
        doc.creditsUsed = doc.useCredits || 0;
      }
    }

    
    if (freeCase) {
      user.creditHistory = user.creditHistory || [];
      user.creditHistory.push({
        type: "earn",
        amount: 0,
        reason: `Free request created (${doc.requestType || "general"})`,
        date: new Date(),
      });
      await user.save();
    } else if (requiredCredits > 0) {
      if (doc.paymentMode === "credits") {
        if ((user.credits || 0) < requiredCredits) {
          return res.status(400).json({ message: "Not enough credits" });
        }
        user.credits -= requiredCredits;
        user.creditHistory = user.creditHistory || [];
        user.creditHistory.push({
          type: "spend",
          amount: requiredCredits,
          reason: `Created a ${doc.paymentMode} request`,
          date: new Date(),
        });
        await user.save();
      } else if (doc.paymentMode === "hybrid") {
        const creditsToUse = doc.useCredits || 0;
        if ((user.credits || 0) < creditsToUse) {
          return res.status(400).json({ message: "Not enough credits" });
        }
        user.credits -= creditsToUse;
        user.creditHistory = user.creditHistory || [];
        user.creditHistory.push({
          type: "spend",
          amount: creditsToUse,
          reason: `Used ${creditsToUse} credits for hybrid payment request`,
          date: new Date(),
        });
        await user.save();
      }
  
    }

    const request = await Request.create(doc);

    return res.status(201).json({
      request,
      updatedCredits: user.credits,
      message: freeCase
        ? "Request created successfully (free request)."
        : requiredCredits > 0
        ? `Request created successfully. ${doc.creditsUsed} credits deducted.`
        : "Request created successfully (no credits deducted).",
    });
  } catch (err) {
    console.error("❌ Request creation error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status.toLowerCase();
    if (req.query.requestType) filter.requestType = req.query.requestType;
    
    const requests = await Request.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.status(200).json(requests);
  } catch (err) {
    console.error("getRequests error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const requests = await Request.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(requests);
  } catch (err) {
    console.error("getMyRequests error:", err);
    return res.status(500).json({ error: err.message });
  }
};

async function setStatus(req, res, status) {
  try {
    const { id } = req.params;
    const request = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    
    
    if (status === "completed" && request.user && request.user.toString() !== req.user.id) {
   
    }
    
    return res.json({ message: `Request marked as ${status}`, request });
  } catch (err) {
    console.error("setStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
}

exports.approveRequest = (req, res) => setStatus(req, res, "approved");
exports.rejectRequest = (req, res) => setStatus(req, res, "rejected");
exports.completeRequest = (req, res) => setStatus(req, res, "completed");

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "user",
      "name email role"
    );
    if (!request) return res.status(404).json({ message: "Not found" });
    return res.json(request);
  } catch (err) {
    console.error("getRequestById error:", err);
    return res.status(500).json({ error: err.message });
  }
};


exports.updateNGOStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const request = await Request.findByIdAndUpdate(
      id,
      { ngoStatus: status },
      { new: true }
    );
    
    if (!request) return res.status(404).json({ message: "Request not found" });
    
    return res.json({ message: `NGO status updated to ${status}`, request });
  } catch (err) {
    console.error("updateNGOStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
};