const Owner = require("../models/Owner");
const Realtor = require("../models/Realtor");

exports.approveUser = async (req, res) => {
  try {
    if (req.params.userType == "owner") {
      const owner = await Owner.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      );
      res.json(owner);
    } else {
      const realtor = await Realtor.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      );
      res.json(realtor);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    if (req.params.userType == "owner") {
      const owner = await Owner.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      );
      res.json(owner);
    } else {
      const realtor = await Realtor.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      );
      res.json(realtor);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    console.log(
      (await Owner.countDocuments({ status: "pending" })) +
        Realtor.countDocuments({ status: "pending" })
    );
    const [totalOwners, totalRealtors, pendingOwners, pendingRealtors] =
      await Promise.all([
        Owner.countDocuments(),
        Realtor.countDocuments(),
        Owner.countDocuments({ status: "pending" }),
        Realtor.countDocuments({ status: "pending" }),
      ]);

    res.json({
      totalOwners: totalOwners,
      totalRealtors: totalRealtors,
      pendingApprovals: pendingOwners + pendingRealtors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingRealtors = async (req, res) => {
  try {
    const pendingRealtors = await Realtor.find({ status: "pending" })
      .select("-password") // Exclude sensitive fields
      .sort({ createdAt: -1 });

    res.json(pendingRealtors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingOwners = async (req, res) => {
  try {
    const pendingOwners = await Owner.find({ status: "pending" })
      .select("-password") // Exclude sensitive fields
      .sort({ createdAt: -1 });

    res.json(pendingOwners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
