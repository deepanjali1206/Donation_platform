const NGO = require("../models/Ngo");

exports.getNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find().sort({ createdAt: -1 });
    return res.json(ngos);
  } catch (err) {
    console.error("getNGOs error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateNGOStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ngo = await NGO.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    return res.json({
      message: `NGO status updated to ${status}`,
      ngo,
    });
  } catch (err) {
    console.error("updateNGOStatus error:", err);
    res.status(500).json({ error: err.message });
  }
};
