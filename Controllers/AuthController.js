const User = require('../Models/User.js')
const bcrypt = require('bcrypt')
const { Snowflake } = require('@theinternetfolks/snowflake')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    console.log(req.body)
    try {
        const {
            name,
            email,
            username,
            githubId,
            profilePhoto,
            bio,
            isPublic,
            role,
            password,

        } = req.body;

        // Check if user with the same email already exists
        const currentuser = await User.findOne({ email });
        if (currentuser) {
            return res.status(401).json({ message: "User with mail already exists try login" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = Snowflake.generate()
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                username,
                githubId,
                profilePhoto,
                bio,
                isPublic,
                role,
            });
            // Save the user to the database
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const payload = {
            user: {
                id: user._id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) throw err;
                res.cookie("acessToken", token, { httpOnly: true });
                res.status(200).json({ message: "Login successful" });
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//logout 
exports.logout = async (req, res) => {
    try {
        // Clear the access token cookie
        res.clearCookie("acessToken");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
