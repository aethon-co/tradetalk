import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { signupUser } from '../api/user';
import toast from 'react-hot-toast';
import logo from '../assets/tradeTalks.svg';

export default function College() {
    const navigate = useNavigate();
    const { referralCode: urlReferralCode } = useParams();
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        referralCode: '',
    });

    useEffect(() => {
        if (urlReferralCode) {
            setFormData(prev => ({ ...prev, referralCode: urlReferralCode }));
        }
    }, [urlReferralCode]);

    const mutation = useMutation({
        mutationFn: (data: any) => {
            const payload = {
                ...data,
                referredBy: data.referralCode || null,
                role: 'user'
            };
            // Remove referralCode from payload to avoid overriding auto-generated code (or unique error)
            // We use 'referredBy' to store the referrer's code.
            delete payload.referralCode;
            return signupUser(payload);
        },
        onSuccess: () => {
            // localStorage.setItem("user", JSON.stringify(data.user)); // Removed
            toast.success("Account created successfully!");
            navigate("/home");
        },
        onError: (error: any) => {
            toast.error(error.message || "Signup failed");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'email') setEmailError('');
        if (e.target.name === 'phoneNumber') setPhoneError('');
        if (e.target.name === 'name') setNameError('');
        if (e.target.name === 'password') setPasswordError('');
    };

    const handleSubmit = () => {
        // Improved Email Regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        // Name Validation
        if (formData.name.trim().length < 3) {
            setNameError('Name must be at least 3 characters long');
            return;
        }

        // Phone Validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setPhoneError('Phone number must be exactly 10 digits');
            return;
        }

        // Password Validation
        if (formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }

        mutation.mutate(formData);
    };

    const styles = {
        wrapper: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a', // Slate-950
            padding: '20px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        },
        card: {
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#1e293b', // Slate-800
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid #334155', // Slate-700
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' // Dark shadow
        },
        title: {
            color: '#f1f5f9', // Slate-100
            fontSize: '1.875rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '8px'
        },
        subtitle: {
            color: '#94a3b8', // Slate-400
            textAlign: 'center',
            marginBottom: '32px',
            fontSize: '0.95rem'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px'
        },
        input: {
            width: '100%',
            backgroundColor: '#334155', // Slate-700
            border: '1px solid #475569', // Slate-600
            borderRadius: '12px',
            padding: '14px 16px',
            color: '#f1f5f9', // Slate-100
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s'
        },
        buttonPrimary: {
            width: '100%',
            backgroundColor: '#3b82f6', // Blue-500
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '12px',
            transition: 'all 0.2s'
        },
        footerText: {
            textAlign: 'center',
            color: '#94a3b8', // Slate-400
            fontSize: '0.9rem',
            marginTop: '20px'
        },
        link: {
            color: '#60a5fa', // Blue-400
            cursor: 'pointer',
            fontWeight: '600',
            marginLeft: '5px',
            transition: 'color 0.2s'
        }
    };

    return (
        <div style={styles.wrapper as any}>
            <div style={styles.card as any}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <a href="https://www.tradetalks.co.in/kerala-traders-summit"><img src={logo} alt="LogicBox Logo" style={{ height: '40px' }} /></a>
                </div>
                <h1 style={styles.title as any}>Registration</h1>
                <p style={styles.subtitle as any}>Partner with us </p>

                <div style={styles.inputGroup as any}>
                    <div>
                        <input
                            style={{ ...styles.input, borderColor: nameError ? '#ef4444' : '#475569' } as any}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            onFocus={(e) => !nameError && (e.currentTarget.style.borderColor = '#3b82f6')}
                            onBlur={(e) => !nameError && (e.currentTarget.style.borderColor = '#475569')}
                        />
                        {nameError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{nameError}</span>}
                    </div>
                    <div>
                        <input
                            style={{ ...styles.input, borderColor: emailError ? '#ef4444' : '#475569' } as any}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email Address"
                            onFocus={(e) => !emailError && (e.currentTarget.style.borderColor = '#3b82f6')}
                            onBlur={(e) => !emailError && (e.currentTarget.style.borderColor = '#475569')}
                        />
                        {emailError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{emailError}</span>}
                    </div>
                    <div>
                        <input
                            style={{ ...styles.input, borderColor: passwordError ? '#ef4444' : '#475569' } as any}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Create Password"
                            onFocus={(e) => !passwordError && (e.currentTarget.style.borderColor = '#3b82f6')}
                            onBlur={(e) => !passwordError && (e.currentTarget.style.borderColor = '#475569')}
                        />
                        {passwordError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{passwordError}</span>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                        <div>
                            <input
                                style={{ ...styles.input, borderColor: phoneError ? '#ef4444' : '#475569' } as any}
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                type="text"
                                inputMode="numeric"
                                placeholder="Phone Number"
                                maxLength={10}
                                onFocus={(e) => !phoneError && (e.currentTarget.style.borderColor = '#3b82f6')}
                                onBlur={(e) => !phoneError && (e.currentTarget.style.borderColor = '#475569')}
                            />
                            {phoneError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{phoneError}</span>}
                        </div>
                    </div>
                    <input
                        style={styles.input as any}
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                        placeholder="Referral Code (Optional)"
                        disabled={!!urlReferralCode}
                    />
                </div>

                <button
                    style={{ ...styles.buttonPrimary, opacity: mutation.isPending ? 0.7 : 1 } as any}
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Registering..." : "Create Account"}
                </button>

                <div style={styles.footerText as any}>
                    Already have an account?
                    <span
                        style={styles.link as any}
                        onClick={() => navigate("/login")}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#3b82f6')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#60a5fa')}
                    >
                        Login
                    </span>
                </div>


            </div>
        </div >
    );

}