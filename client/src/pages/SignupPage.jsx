import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Loader2, Check, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const SignupPage = () => {
    const navigate = useNavigate();
    const { login, googleLogin } = useAuth();

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                setIsGoogleLoading(true);
                setError('');
                await googleLogin(codeResponse.code);
                toast.success('Account created and logged in! 🎉');
                navigate('/');
            } catch (err) {
                setError(err?.response?.data?.message || 'Google signup failed. Please try again.');
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: () => setError('Google signup failed. Please try again.'),
        flow: 'auth-code',
    });

    const passwordValidation = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match"); return;
        }
        if (!isPasswordValid) {
            setError("Password does not meet all requirements"); return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/signup', { name, email, password });
            if (response.data.requireOTP) {
                toast.success('OTP sent to your email! 📧');
                setStep(2);
                setCooldown(60);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign up.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError("Please enter the complete 6-digit OTP"); return;
        }
        
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/verify-otp', { name, email, password, otp: otpValue });
            login(response.data.token);
            toast.success('Account created successfully! 🎉');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (cooldown > 0) return;
        setIsLoading(true);
        setError('');
        try {
            await api.post('/auth/resend-otp', { email });
            toast.success('New OTP sent to your email 📧');
            setCooldown(60);
        } catch(err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderPasswordRequirement = (label, istMet) => (
        <div className="flex items-center gap-2 text-[12px]">
            {istMet ? <Check className="w-3.5 h-3.5 text-green-400" /> : <X className="w-3.5 h-3.5 text-white/30" />}
            <span className={istMet ? "text-green-400/90" : "text-white/40"}>{label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center relative overflow-hidden px-4 py-8">
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-[420px] p-8 md:p-12 rounded-3xl overflow-hidden"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col items-center mb-8">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                                    className="w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                                >
                                    <Sparkles className="w-6 h-6 text-white" />
                                </motion.div>
                                <h1 className="text-[28px] font-semibold text-white mb-2 tracking-tight">Create your account</h1>
                                <p className="text-[14px] text-white/45">Start chatting with AI today</p>
                            </div>

                            <motion.button
                                type="button"
                                onClick={() => handleGoogleLogin()}
                                disabled={isGoogleLoading || isLoading}
                                whileHover={{ scale: (isGoogleLoading || isLoading) ? 1 : 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                whileTap={{ scale: (isGoogleLoading || isLoading) ? 1 : 0.98 }}
                                className="w-full h-12 rounded-xl flex items-center justify-center gap-3 text-white font-medium transition-all mb-6 disabled:opacity-70 disabled:cursor-not-allowed border border-white/10 bg-white/5"
                            >
                                {isGoogleLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </>
                                )}
                            </motion.button>

                            <div className="relative flex items-center mb-6">
                                <div className="flex-grow border-t border-white/10"></div>
                                <span className="flex-shrink-0 mx-4 text-white/40 text-[13px]">Or continue with email</span>
                                <div className="flex-grow border-t border-white/10"></div>
                            </div>

                            <form onSubmit={handleSignupSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] text-white/60 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#7c3aed] transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[14px] text-white placeholder-white/20 outline-none focus:border-[#7c3aed] focus:shadow-[0_0_0_1px_rgba(124,58,237,0.5)] transition-all duration-200"
                                            placeholder="John Doe" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] text-white/60 ml-1">Email address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#7c3aed] transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[14px] text-white placeholder-white/20 outline-none focus:border-[#7c3aed] focus:shadow-[0_0_0_1px_rgba(124,58,237,0.5)] transition-all duration-200"
                                            placeholder="you@example.com" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] text-white/60 ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#7c3aed] transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-[14px] text-white placeholder-white/20 outline-none focus:border-[#7c3aed] focus:shadow-[0_0_0_1px_rgba(124,58,237,0.5)] transition-all duration-200"
                                            placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    
                                    {/* Password Validation Checklist */}
                                    {password && (
                                        <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-white/5 rounded-xl border border-white/5">
                                            {renderPasswordRequirement("Min 8 characters", passwordValidation.length)}
                                            {renderPasswordRequirement("1 Uppercase", passwordValidation.uppercase)}
                                            {renderPasswordRequirement("1 Number", passwordValidation.number)}
                                            {renderPasswordRequirement("1 Special char", passwordValidation.special)}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] text-white/60 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#7c3aed] transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[14px] text-white placeholder-white/20 outline-none focus:border-[#7c3aed] focus:shadow-[0_0_0_1px_rgba(124,58,237,0.5)] transition-all duration-200"
                                            placeholder="••••••••" />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl overflow-hidden">
                                            <p className="text-[13px] text-red-400">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button type="submit" disabled={isLoading}
                                    whileHover={{ scale: isLoading ? 1 : 1.02, filter: isLoading ? 'brightness(1)' : 'brightness(1.1)' }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    className="w-full h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-[13px] text-white/40">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-[#a78bfa] hover:text-[#c4b5fd] font-medium transition-colors">Sign in</Link>
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full"
                        >
                            <button onClick={() => setStep(1)} className="absolute top-4 left-4 text-white/40 hover:text-white/80 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center mb-8 mt-4">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                                >
                                    <Mail className="w-6 h-6 text-white" />
                                </motion.div>
                                <h1 className="text-[26px] font-semibold text-white mb-2 tracking-tight text-center">Check your email</h1>
                                <p className="text-[14px] text-white/45 text-center">We sent a verification code to<br/><span className="text-white/80">{email}</span></p>
                            </div>

                            <form onSubmit={handleOtpSubmit} className="space-y-6">
                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => inputRefs.current[index] = el}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-[20px] text-white font-medium outline-none focus:border-[#7c3aed] focus:shadow-[0_0_0_1px_rgba(124,58,237,0.5)] transition-all duration-200"
                                        />
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl overflow-hidden">
                                            <p className="text-[13px] text-red-400 text-center">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button type="submit" disabled={isLoading || otp.join('').length !== 6}
                                    whileHover={{ scale: (isLoading || otp.join('').length !== 6) ? 1 : 1.02 }}
                                    whileTap={{ scale: (isLoading || otp.join('').length !== 6) ? 1 : 0.98 }}
                                    className="w-full h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Account'}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center flex flex-col gap-2">
                                <p className="text-[13px] text-white/40">Didn't receive the email?</p>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={cooldown > 0 || isLoading}
                                    className="text-[13px] font-medium text-[#a78bfa] hover:text-[#c4b5fd] disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
                                >
                                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default SignupPage;
