import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { sendOTPVerificationEmail } from '../services/emailService.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({ message: 'Password does not meet complexity requirements' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        let otpRecord = await OTP.findOne({ email });
        if (otpRecord && otpRecord.blockedUntil && otpRecord.blockedUntil > new Date()) {
            return res.status(403).json({ message: 'Too many attempts. Please try again later.' });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (otpRecord && (!otpRecord.blockedUntil || otpRecord.blockedUntil < new Date())) {
            otpRecord.otp = otpCode;
            otpRecord.attempts = 0;
            otpRecord.createdAt = new Date();
            await otpRecord.save();
        } else {
            otpRecord = new OTP({ email, otp: otpCode });
            await otpRecord.save();
        }

        await sendOTPVerificationEmail(email, otpCode);

        res.status(200).json({ requireOTP: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error while sending OTP' });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        if (!name || !email || !password || !otp) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found. Please resend.' });
        }

        if (otpRecord.blockedUntil && otpRecord.blockedUntil > new Date()) {
            return res.status(403).json({ message: 'Too many attempts. Please try again later.' });
        }

        const isMatch = await otpRecord.compareOTP(otp);
        if (!isMatch) {
            otpRecord.attempts += 1;
            if (otpRecord.attempts >= 3) {
                otpRecord.blockedUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                await otpRecord.save();
                return res.status(403).json({ message: 'Too many wrong attempts. Blocked for 10 minutes.' });
            }
            await otpRecord.save();
            return res.status(400).json({ message: 'Invalid OTP code.' });
        }

        await OTP.deleteOne({ email });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Internal server error during verification' });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Missing email address' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        let otpRecord = await OTP.findOne({ email });
        if (otpRecord && otpRecord.blockedUntil && otpRecord.blockedUntil > new Date()) {
            return res.status(403).json({ message: 'Too many attempts. Please try again later.' });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (otpRecord) {
            otpRecord.otp = otpCode;
            otpRecord.attempts = 0;
            otpRecord.createdAt = new Date();
            await otpRecord.save();
        } else {
            otpRecord = new OTP({ email, otp: otpCode });
            await otpRecord.save();
        }

        await sendOTPVerificationEmail(email, otpCode);
        
        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Internal server error while resending OTP' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Missing Google authorization code' });
        }

        const client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage'
        );

        const { tokens } = await client.getToken(code);
        
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name } = payload;


        let user = await User.findOne({ email });

        if (user) {
            // Unify account if needed
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        } else {
            // Create a new user
            user = new User({
                email,
                name,
                googleId: sub
            });
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Google Auth error:', error);
        res.status(500).json({ message: 'Internal server error during Google Auth' });
    }
};

