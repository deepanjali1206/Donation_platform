const Request = require("../models/Request");


exports.createRequest = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
      user: req.user.id,
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

    const request = await Request.create(doc);
    return res.status(201).json(request);
  } catch (err) {
    console.error("❌ Request creation error:", err);
    return res.status(500).json({ error: err.message });
  }
};


exports.getRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const requests = await Request.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.status(200).json(requests);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const requests = await Request.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching my requests:", err);
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
    return res.json({ message: `Request ${status}`, request });
  } catch (err) {
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
    return res.status(500).json({ error: err.message });
  }
};
