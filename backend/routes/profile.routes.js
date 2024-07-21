import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import { addVideo, updateProfile, updateProfilePic } from "../controllers/updateProfile.controller.js";

const router = express.Router();

router.post("/updatebio", protectRoute,updateProfile)
router.post("/addVideo", protectRoute, addVideo)
router.post("/updateProfilepic", protectRoute, updateProfilePic)


// router.post("/logout", logout)

export default router; 