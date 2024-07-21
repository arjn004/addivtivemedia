import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import { getProfile } from "../controllers/getProfile.controller.js";


const router = express.Router();

router.get("/getProfile", protectRoute, getProfile)


export default router; 