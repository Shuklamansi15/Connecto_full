import express from 'express';
import { 
  loginAdmin, 
  allInfluencers, 
  addInfluencer, 
  consultationsAdmin, 
  consultationCancel, 
  adminDashboard,
  getInfluencersStats,   // ✅ Add this
  updateInfluencer
} from '../controllers/adminController.js';

import { changeAvailability } from '../controllers/influencerController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-influencer", authAdmin, upload.single('image'), addInfluencer);
adminRouter.get("/consultations", authAdmin, consultationsAdmin);
adminRouter.post("/cancel-consultation", authAdmin, consultationCancel);
adminRouter.get("/all-influencers", authAdmin, allInfluencers);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.post("/update-influencer", authAdmin, updateInfluencer);
adminRouter.get("/influencers-stats", authAdmin, getInfluencersStats);

export default adminRouter;
