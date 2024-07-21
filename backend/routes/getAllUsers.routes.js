import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import { getAllUsers, getAllVideos } from "../controllers/getAllUsers.controller.js";



const router = express.Router();

router.get("/getAllUsers", protectRoute, getAllUsers)
router.get("/allVideos/:id", protectRoute, getAllVideos)


export default router; 