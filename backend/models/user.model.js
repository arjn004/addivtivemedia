import mongoose from "mongoose";

const videoDetailsSchema = new mongoose.Schema({
    videoTitle: {
        type: String,
        required: false,
    },
    videoDescription: {
        type: String,
        required: false,
    },
    videoKey: {
        type: String,
        required: false,
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minLength: 6,
    },
    number: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        maxLength: 500,
        required: false,
    },
    videoDetails: {
        type: [videoDetailsSchema],
        required: false,
    },
    profilePicUrl: {
        type: String,
        required: false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
