const User = require("../models/User")
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });
};

// Register User
exports.registerUser = async (req, res) => {
    const { fullname, email, password, profileImageUrl } = req.body || {};
    // Validation: Check for missing fields
    if (!fullname || !email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }

    try{
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

    // Create the user
    const user = await User.create({
        fullname,
        email,
        password,
        profileImageUrl,
    });

    res.status(201).json({
        id: user._id,   
        user,
        token: generateToken(user._id),
    });
    }
    catch (err) {
    res
        .status(500)
        .json({ message: "Error registering user", error: err.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid crendentials!"});
        }
        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }
    catch (err) {
        res
        .status(500)
        .json({ message: "Error logging in!", error: err.message });
    }
};

// Register User
exports.getUserInfo = async (req, res) => {
    try {
        console.log(req);
        const user = await User.findById(req.User.id).select("password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Error getting User Info", error: err.message});
    }
};