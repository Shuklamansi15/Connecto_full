import express from 'express';
import {
  loginInfluencer,
  consultationsInfluencer,
  consultationCancel,
  consultationComplete,
  influencerList,
  changeAvailability,
  influencerDashboard,
  influencerProfile,
  updateInfluencerProfile,
  searchInfluencers
} from '../controllers/influencerController.js';
import authInfluencer from '../middleware/authInfluencer.js';

const InfluencerRouter = express.Router();

// Login route (no auth required)
InfluencerRouter.post("/login", loginInfluencer);

// Routes requiring authentication
InfluencerRouter.post("/cancel-consultation", authInfluencer, consultationCancel);
InfluencerRouter.get("/consultations", authInfluencer, consultationsInfluencer);
InfluencerRouter.post("/change-availability", authInfluencer, changeAvailability);
InfluencerRouter.post("/complete-consultation", authInfluencer, consultationComplete);
InfluencerRouter.get("/dashboard", authInfluencer, influencerDashboard);
InfluencerRouter.get("/profile", authInfluencer, influencerProfile);
InfluencerRouter.post("/update-profile", authInfluencer, updateInfluencerProfile);

// Public routes
InfluencerRouter.get("/list", influencerList);
// route for search bar
InfluencerRouter.post("/search", searchInfluencers);



export default InfluencerRouter;
