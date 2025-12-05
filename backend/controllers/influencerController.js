import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import influencerModel from "../models/influencerModel.js";
import consultationModel from "../models/consultationModel.js";

// ===================== LOGIN =====================
export const loginInfluencer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await influencerModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// ===================== GET INFLUENCER PROFILE =====================
export const influencerProfile = async (req, res) => {
  try {
    const infId = req.infId;
    const profileData = await influencerModel.findById(infId).select("-password");
    if (!profileData) return res.json({ success: false, message: "Influencer not found" });

    return res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// ===================== UPDATE PROFILE =====================
export const updateInfluencerProfile = async (req, res) => {
  try {
    const infId = req.infId;
    const { about, available, category, followers, socialLinks } = req.body;

    // Validate followers as number
    const followersCount = Number(followers) || 0;

    const updateData = {
      about,
      available,
      category,
      followers: followersCount,
      socialLinks
    };

    // Update influencer profile
    await influencerModel.findByIdAndUpdate(infId, updateData, { new: true });

    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};


// ===================== CHANGE AVAILABILITY =====================
export const changeAvailability = async (req, res) => {
  try {
    const { infId } = req.body;
    const infData = await influencerModel.findById(infId);
    if (!infData) return res.json({ success: false, message: "Influencer not found" });

    const newAvailability = !infData.available;
    await influencerModel.findByIdAndUpdate(infId, { available: newAvailability });

    return res.json({ success: true, message: "Availability updated", available: newAvailability });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// ===================== GET ALL INFLUENCERS =====================
export const influencerList = async (req, res) => {
  try {
    const influencers = await influencerModel.find({}).select("-password -email");
    return res.json({ success: true, influencers });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// ===================== CONSULTATIONS =====================
export const consultationsInfluencer = async (req, res) => {
  try {
    const infId = req.infId.toString();
    const consultations = await consultationModel.find({ infId, cancelled: false }).sort({ slotDate: -1 }).lean();
    return res.json({ success: true, consultations });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Cancel consultation
export const consultationCancel = async (req, res) => {
  try {
    const infId = req.infId.toString();
    const { consultationId } = req.body;

    const consultationData = await consultationModel.findById(consultationId);
    if (!consultationData || consultationData.infId !== infId)
      return res.json({ success: false, message: "Consultation not found or unauthorized" });

    await consultationModel.findByIdAndUpdate(consultationId, { cancelled: true });
    return res.json({ success: true, message: "Consultation cancelled" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Complete consultation
export const consultationComplete = async (req, res) => {
  try {
    const infId = req.infId.toString();
    const { consultationId } = req.body;

    const consultationData = await consultationModel.findById(consultationId);
    if (!consultationData || consultationData.infId !== infId)
      return res.json({ success: false, message: "Consultation not found or unauthorized" });

    await consultationModel.findByIdAndUpdate(consultationId, { isCompleted: true });
    return res.json({ success: true, message: "Consultation completed" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// ===================== DASHBOARD =====================
export const influencerDashboard = async (req, res) => {
  try {
    const infId = req.infId.toString();
    const consultations = await consultationModel.find({ infId, cancelled: false }).sort({ slotDate: -1 }).lean();

    let earnings = 0;
    const uniqueUserIds = new Set();

    consultations.forEach((c) => {
      if (c.isCompleted || c.payment) earnings += c.amount || 0;
      if (c.userData?._id) uniqueUserIds.add(c.userData._id.toString());
    });

    const dashData = {
      earnings,
      consultations: consultations.length,
      users: uniqueUserIds.size,
      latestConsultations: consultations.slice(0, 5),
    };

    return res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SEARCH INFLUENCERS
export const searchInfluencers = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.json({ success: false, message: "No search query provided" });
    }

    const influencers = await influencerModel.find({
      name: { $regex: query, $options: "i" }
    }).select("name image category followers _id");

    res.json({ success: true, influencers });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
