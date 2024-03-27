const User = require('../Models/User.js')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//get all details of user profile
exports.me = async (req, res) => {
    try {
        // Retrieve the token from the request cookies
        console.log()
        const token = req.cookies.acessToken;
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                // Extract the user ID from the decoded token payload
                const userId = decoded.user.id;

                // Find the user in the database by ID
                const user = await User.findById(userId);


                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                } else {
                    // Return the user details
                    res.status(200).json(user);
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.editProfile = async (req, res) => {
    try {
        // Retrieve the user ID from the request object
        const userId = req.userId;
        
        // Find the user in the database by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            // Check if the user ID from the middleware matches the ID of the user being updated
            if (userId !== req.params.id) {
                return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
            }

            // Update user details if provided in the request body
            if (req.body.name !== undefined) user.name = req.body.name;
            if (req.body.bio !== undefined) user.bio = req.body.bio;
            if (req.body.phone !== undefined) user.phone = req.body.phone;
            if (req.body.email !== undefined) user.email = req.body.email;
            if (req.body.password !== undefined) {
                // Hash the new password before saving
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                user.password = hashedPassword;
            }
            // Save the updated user details
            await user.save();
            // Exclude password field from the user object
            const { password, ...updatedUser } = user.toObject();

            // Return the updated user details without the password
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateProfilePrivacy = async (req, res) => {
    try {
        // Retrieve the user ID from the request object
        const userId = req.userId;
        
        // Find the user in the database by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            // Check if the user ID from the middleware matches the ID of the user being updated
            if (userId !== req.params.id) {
                return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
            }

            // Check if the privacy setting is provided in the request body
            if (req.body.isPublic === undefined) {
                return res.status(400).json({ message: 'Bad Request: Missing privacy setting data' });
            }

            // Update profile privacy setting
            user.isPublic = req.body.isPublic;

            // Save the updated user details
            await user.save();

            // Return the updated user details
            res.status(200).json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllUserProfiles = async (req, res) => {
    try {
        const userId = req.userId;
        // Fetch the logged-in user from the database
        const loggedInUser = await User.findById(userId);
        // Check if the logged-in user exists
        if (!loggedInUser) {
            return res.status(404).json({ message: 'Logged-in user not found' });
        }
        // Fetch all user profiles
        let allUsers;
        if (loggedInUser.role === 'admin') {
            // If the logged-in user is an admin, fetch all user profiles
            allUsers = await User.find();
        } else {
            // If the logged-in user is a normal user, fetch only public user profiles
            allUsers = await User.find({ isPublic: true });
        }
        // Remove the profile of the logged-in user from the fetched profiles
        const allUsersExceptLoggedIn = allUsers.filter(user => user._id.toString() !== userId);
        // Return the user profiles excluding the profile of the logged-in user
        res.status(200).json(allUsersExceptLoggedIn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};