import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    blockedUntil: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now, expires: 600 } // TTL index removes doc after 10 minutes
});

otpSchema.pre('save', async function (next) {
    // Only hash the OTP if it has been modified (or is new)
    if (!this.isModified('otp')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (error) {
        next(error);
    }
});

otpSchema.methods.compareOTP = async function (candidateOTP) {
    return await bcrypt.compare(candidateOTP, this.otp);
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
