import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
const { username, email, password } = req.body;
  try {

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // hash password
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const user_email = await User.findOne({email});
    const user_name = await User.findOne({username});

    if (user_email) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (user_name) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    
    if(newUser){
       generateToken(newUser._id, res); 
       await newUser.save();

        res.status(201).json({
           id: newUser._id,
           username: newUser.username,
           email: newUser.email,
           profilePicture: newUser.profilePicture,  
        });
    } else{
        return res.status(400).json({ message: "Invalid user data" });
    }



  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Error in signup controller", error });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        });
        
    } catch (error) {
        console.log("Error in login controller:", error);
        res.status(500).json({ message: "Error in login controller", error });
    }
    
};

export const logout = (req, res) => {
  try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
      console.log("Error in logout controller:", error);
      res.status(500).json({ message: "Error in logout controller", error });
  }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePicture} = req.body;
        const userId = req.user._id;

        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePicture);

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: uploadResponse.secure_url },
            { new: true });

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.log("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Error in updateProfile controller", error });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error);
        res.status(500).json({ message: "Error in checkAuth controller", error });
    }
};