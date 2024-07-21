import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bio, videoDetails } = req.body;

        if (!bio && !videoDetails) {
            return res.status(400).json({ message: "Bio or video details are required." });
        }

        const updateData = {};
        if (bio) updateData.bio = bio;
        if (videoDetails) updateData.videoDetails = videoDetails;

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Profile updated successfully.", user });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const addVideo = async (req, res) => {
    try {
        const userId = req.user._id;
        const { videoTitle, videoDescription, videoKey } = req.body;

        if (!videoTitle || !videoDescription || !videoKey) {
            return res.status(400).json({ message: "All video details are required." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const newVideo = { videoTitle, videoDescription, videoKey };
        user.videoDetails.push(newVideo);
        await user.save();

        res.status(200).json({ message: "Video added successfully.", video: newVideo });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};


export const updateProfilePic = async (req, res) => {
    try {
        const userId = req.user._id;
        const { profilePicUrl } = req.body;

        if (!profilePicUrl) {
            return res.status(400).json({ message: "Profile picture URL is required." });
        }

        const user = await User.findByIdAndUpdate(userId, { profilePicUrl }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Profile picture updated successfully.", user });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};