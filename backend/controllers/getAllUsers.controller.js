// src/controllers/userController.js
import User from "../models/user.model.js";

// Get all users with their firstName, profilePicUrl, userId, and the first 5 videos
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName profilePicUrl _id videoDetails')
      .exec();

    const result = users.map(user => ({
      userId: user._id, // Include userId
      firstName: user.firstName,
      profilePicUrl: user.profilePicUrl,
      videos: user.videoDetails.slice(0, 5) // Get only the first 5 videos
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};

export const getAllVideos = async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Find the user by userId
      const user = await User.findById(userId, 'videoDetails').exec();
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Respond with all videos
      res.status(200).json(user.videoDetails);
    } catch (error) {
      console.error('Error fetching videos for user:', error);
      res.status(500).json({ error: 'An error occurred while fetching videos.' });
    }
  };
