import jwt from "jsonwebtoken";
import consultationModel from "../models/consultationModel.js";
import influencerModel from "../models/influencerModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// ⭐ NEW IMPORTS ADDED
import Consultation from "../models/consultationModel.js";
import Influencer from "../models/influencerModel.js";
import User from "../models/userModel.js";


// ------------------------ ADMIN LOGIN ------------------------
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// ------------------------ GET ALL CONSULTATIONS ------------------------
const consultationsAdmin = async (req, res) => {
    try {
        const consultations = await consultationModel
            .find({})
            .populate("infId", "name image")
            .populate("userId", "name email");

        res.json({ success: true, consultations });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// ------------------------ CANCEL CONSULTATION ------------------------
const consultationCancel = async (req, res) => {
    try {
        const { consultationId } = req.body;

        const exist = await consultationModel.findById(consultationId);
        if (!exist) {
            return res.json({ success: false, message: "Consultation not found" });
        }

        await consultationModel.findByIdAndUpdate(consultationId, { cancelled: true });

        res.json({ success: true, message: "Consultation Cancelled" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// ------------------------ ADD INFLUENCER ------------------------
const addInfluencer = async (req, res) => {
    try {
        const { name, email, password, category, followers, about, socialLinks, rates, modes } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !category || !about || !followers || !rates) {
            return res.status(400).json({ success: false, message: "Missing required details" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let imageUrl = "";
        if (imageFile) {
            const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = upload.secure_url;
        }

        let socialLinksObj = {};
        let ratesObj = {};
        let modesArr = [];

        try {
            socialLinksObj = socialLinks ? JSON.parse(socialLinks) : {};
            ratesObj = rates ? JSON.parse(rates) : {};
            modesArr = modes ? JSON.parse(modes) : [];
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid JSON format in socialLinks, rates, or modes" });
        }

        const influencerData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            category,
            followers,
            about,
            socialLinks: socialLinksObj,
            rates: ratesObj,
            modes: modesArr,
            available: true,
            slots_booked: {},
            date: Date.now(),
        };

        const newInfluencer = new influencerModel(influencerData);
        await newInfluencer.save();

        res.json({ success: true, message: "Influencer added successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ------------------------ GET ALL INFLUENCERS ------------------------
const allInfluencers = async (req, res) => {
    try {
        const influencers = await influencerModel.find({}).select("-password");
        res.json({ success: true, influencers });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// ------------------------ ADMIN DASHBOARD ------------------------
const adminDashboard = async (req, res) => {
    try {

        const influencers = await influencerModel.find({});
        const users = await userModel.find({});
        const consultations = await consultationModel
            .find({})
            .populate("infId", "name image")
            .populate("userId", "name email image");

        const dashData = {
            influencers: influencers.length,
            consultations: consultations.length,
            users: users.length,
            latestConsultations: consultations.reverse().slice(0, 5)
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------ UPDATE INFLUENCER ------------------------
const updateInfluencer = async (req, res) => {
  try {
    const { infId, rates, modes, socialLinks } = req.body;

    if (!infId) {
      return res.status(400).json({ success: false, message: "Influencer ID is required" });
    }

    // Only parse if the incoming data is a string
    const ratesObj = typeof rates === "string" ? JSON.parse(rates) : rates || {};
    const modesArr = typeof modes === "string" ? JSON.parse(modes) : modes || [];
    const socialLinksObj = typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks || {};

    const updated = await influencerModel.findByIdAndUpdate(
      infId,
      {
        ...(Object.keys(ratesObj).length && { rates: ratesObj }),
        ...(modesArr.length && { modes: modesArr }),
        ...(Object.keys(socialLinksObj).length && { socialLinks: socialLinksObj }),
      },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Influencer not found" });
    }

    res.json({ success: true, message: "Influencer updated successfully", influencer: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// ⭐ NEW FUNCTION ADDED — NO EXISTING CODE CHANGED
 const getInfluencersStats = async (req, res) => {
  try {
    const influencers = await Influencer.find();

    const result = await Promise.all(
      influencers.map(async (inf) => {
        // Match infId as string
        const consultations = await Consultation.find({ infId: inf._id.toString() });

        const totalConsultations = consultations.length;

        const modeCount = { chat: 0, call: 0, video: 0 };
        consultations.forEach((c) => {
          if (c.mode in modeCount) modeCount[c.mode] += 1;
        });

        const preferredModePercent = {
          chat: totalConsultations ? (modeCount.chat / totalConsultations) * 100 : 0,
          call: totalConsultations ? (modeCount.call / totalConsultations) * 100 : 0,
          video: totalConsultations ? (modeCount.video / totalConsultations) * 100 : 0,
        };

        const uniqueUsers = new Set(consultations.map((c) => c.userId)).size;

        const totalRevenue = consultations.reduce((acc, c) => acc + (c.amount || 0), 0);

        return {
          influencerId: inf._id,
          name: inf.name,
          image: inf.image,
          category: inf.category,
          totalConsultations,
          preferredModePercent,
          uniqueUsers,
          totalRevenue,
        };
      })
    );

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export {
    loginAdmin,
    consultationsAdmin,
    consultationCancel,
    addInfluencer,
    getInfluencersStats,
    allInfluencers,
    updateInfluencer,
    adminDashboard
};
