const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email, code: otpCode });
    await sendEmail(email, "Verify Email", `Your OTP is ${otpCode}`);
    res.status(201).json({ message: "OTP sent to email" });
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, code: otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    await User.updateOne({ email }, { isVerified: true });
    await Otp.deleteMany({ email });
    res.json({ message: "Email verified" });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
};
