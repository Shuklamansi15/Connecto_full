import consultationModel from "../models/consultationModel.js";
import influencerModel from "../models/influencerModel.js";

export const bookConsultation = async (req, res) => {
  try {
    const { user, influencer, mode, duration, scheduledAt } = req.body;

    // 1) Get influencer data (to fetch ratePerMin)
    const influencerData = await influencerModel.findById(influencer);
    if (!influencerData) {
      return res.status(404).json({ message: "Influencer not found" });
    }

    // 2) Get rate per minute based on selected mode
    const ratePerMin = influencerData.rates[mode];  // chat/call/video
    if (!ratePerMin) {
      return res.status(400).json({ message: "Invalid mode selected" });
    }

    // 3) FINAL PRICE CALCULATION  ⭐⭐⭐
    const totalAmount = ratePerMin * duration; // ← This is what you wanted

    // 4) Save consultation in DB
    const newConsultation = await consultationModel.create({
      user,
      influencer,
      mode,
      duration,
      ratePerMin,
      totalAmount,
      scheduledAt,
      status: "pending",
      paymentStatus: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Consultation booked successfully",
      data: newConsultation,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
