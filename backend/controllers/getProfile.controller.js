import User from "../models/user.model.js";


// Controller function to get user profile
export const getProfile = async (req, res) => {
    try {
        // Extract user ID from request (assuming you have authentication middleware to add user ID to req.user)
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId).select('-password'); // Exclude password from the result

        // Check if user was found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.json(user);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
