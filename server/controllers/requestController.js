const Request = require("../models/Request");
const User = require("../models/User");

/**
 * Create Request with flexible credits/payment logic
 * - user is req.user.id
 * - supports paymentMode: "credits" | "money" | "hybrid"
 * - does NOT deduct pending credits; only deducts from earned credits
 * - free cases: NGO, elderly, children, supporters, blood requests
 */
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
      isNGO,
      coordinates,
      paymentMode,
      useCredits,
    } = req.body;

    const doc = {
      title,
      category,
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
      isNGO: isNGO === "true" || isNGO === true,
      paymentMode,
      useCredits: useCredits ? Number(useCredits) : 0,
      user: req.user.id,
      status: "pending", // unified lowercase
      isFree: false, // default, may change below
    };

    if (coordinates && typeof coordinates === "string") {
      const parts = coordinates.split(",").map((n) => Number(n.trim()));
      if (parts.length === 2 && parts.every((n) => !Number.isNaN(n))) {
        doc.coordinates = parts;
      }
    }

    if (req.file) {
      doc.attachment = `/uploads/${req.file.filename}`;
    }

    // --- Credits / Free logic ---
    let requiredCredits = 0;
    let freeCase = false;

    // Free request conditions
    if (
      doc.isNGO ||
      user.role === "elderly" ||
      user.role === "child" ||
      user.role === "supporter" ||
      doc.category?.toLowerCase() === "blood"
    ) {
      freeCase = true;
      doc.isFree = true;
    } else {
      // Paid cases
      if (paymentMode === "credits") {
        requiredCredits = 5; // static (can be dynamic later)
      } else if (paymentMode === "hybrid") {
        requiredCredits = doc.useCredits || 0;
      } else {
        requiredCredits = 0; // money only
      }
    }

    if (freeCase) {
      // Log free request in creditHistory using valid enum
      user.creditHistory = user.creditHistory || [];
      user.creditHistory.push({
        type: "earn", // must match enum ["earn", "spend"]
        amount: 0,    // free request → 0 credits
        reason: `Free request created (${doc.category || "general"})`,
        date: new Date(),
      });
      await user.save();
    } else if (requiredCredits > 0) {
      // Deduct credits from earned credits
      if ((user.credits || 0) < requiredCredits) {
        return res.status(400).json({ message: "Not enough credits" });
      }
      user.credits -= requiredCredits;
      user.creditHistory = user.creditHistory || [];
      user.creditHistory.push({
        type: "spend",
        amount: requiredCredits,
        reason: `Created a ${paymentMode} request`,
        date: new Date(),
      });
      await user.save();
    }

    const request = await Request.create(doc);

    return res.status(201).json({
      request,
      updatedCredits: user.credits,
      message: freeCase
        ? "Request created successfully (free request)."
        : requiredCredits > 0
        ? `Request created successfully. ${requiredCredits} credits deducted.`
        : "Request created successfully (no credits deducted).",
    });
  } catch (err) {
    console.error("❌ Request creation error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Fetch all requests (admin)
exports.getRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status.toLowerCase();
    const requests = await Request.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.status(200).json(requests);
  } catch (err) {
    console.error("getRequests error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Fetch logged-in user's requests
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

// Admin helpers to change request status (approve/reject/complete)
async function setStatus(req, res, status) {
  try {
    const { id } = req.params;
    const request = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
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
