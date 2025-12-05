import express from 'express';
import { 
    loginUser, 
    registerUser, 
    getProfile, 
    updateProfile, 
    bookConsultation, 
    listConsultation, 
    cancelConsultation, 
    // paymentRazorpay, 
    // verifyRazorpay, 
    // paymentStripe, 
    // verifyStripe 
} from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';

const userRouter = express.Router();

// User authentication
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// User profile
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile);

// Consultations with influencers
userRouter.post("/book-consultation", authUser, bookConsultation);
userRouter.get("/consultations", authUser, listConsultation);
userRouter.post("/cancel-consultation", authUser, cancelConsultation);

// // Payments for consultations
// userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
// userRouter.post("/verify-razorpay", authUser, verifyRazorpay);
// userRouter.post("/payment-stripe", authUser, paymentStripe);
// userRouter.post("/verify-stripe", authUser, verifyStripe);

export default userRouter;
