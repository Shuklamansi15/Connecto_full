import mongoose from "mongoose";

const influencerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    followers: { type: Number, required: true, min: 0 },

    socialLinks: { 
        type: Object, 
        required: true, 
        validate: {
            validator: function(value) {
                return (
                    value.instagram ||
                    value.youtube ||
                    value.facebook ||
                    value.twitter ||
                    value.tiktok
                );
            },
            message: "At least one social media link is required."
        } 
    },

    about: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true },

    // 🔥 Correct field name (matches backend)
    rates: {
        chat: { type: Number, default: null },
        call: { type: Number, default: null },
        video: { type: Number, default: null },
    },


    slots_booked: { type: Object, default: {} },
    date: { type: Number, required: true },
}, { minimize: false, timestamps: true });

const Influencer = mongoose.models.influencer || mongoose.model("influencer", influencerSchema);
export default Influencer;
