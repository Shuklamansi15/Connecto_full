import mongoose from "mongoose"

const consultationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    infId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    infData: { type: Object, required: true },
    amount: { type: Number, required: true },
    mode: { type: String, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
})

const consultationModel = mongoose.models.consultation || mongoose.model("consultation", consultationSchema)
export default consultationModel
