import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import getRandomChars from "../utils/randomChars.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, number } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }


        const password = `${getRandomChars(firstName, 3)}${getRandomChars(lastName, 3)}${getRandomChars(number, 3)}`;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const emailSubject = 'Your Signup Password';
        const emailText = `Dear ${firstName},\n\nYour account has been created successfully. Here is your password: ${password}\n\nBest regards,\nYour Company`;
        await sendEmail(email, emailSubject, emailText);

    
        const newUser = new User({
            firstName,
            lastName,
            email,
            number,
            password: hashPassword,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                number: newUser.number,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const login = async (req, res) => {
	try {
		const { firstName, password } = req.body;
		const user = await User.findOne({ firstName });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid FirstName or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
            email: user.email,
            number: user.number,
            bio: user.bio,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};