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
        mutationFn: (data: any) => signupUser({
            ...data,
            referredBy: data.referralCode,
            role: 'user'
        }),
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
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
    };

    const handleSubmit = () => {
        // Improved Email Regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        // Phone Validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setPhoneError('Phone number must be exactly 10 digits');
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
            backgroundColor: '#eff6ff', // Blue-50
            padding: '20px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        },
        card: {
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#ffffff',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid #bfdbfe', // Blue-200
            boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.15)' // Blue shadow
        },
        title: {
            color: '#1e293b', // Slate-800
            fontSize: '1.875rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '8px'
        },
        subtitle: {
            color: '#64748b', // Slate-500
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
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1', // Slate-300
            borderRadius: '12px',
            padding: '14px 16px',
            color: '#1e293b',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s'
        },
        buttonPrimary: {
            width: '100%',
            backgroundColor: '#2563eb', // Blue-600
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
            color: '#64748b',
            fontSize: '0.9rem',
            marginTop: '20px'
        },
        link: {
            color: '#2563eb', // Blue-600
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
                    <a href="https://www.logicbox.ac/"><img src={logo} alt="LogicBox Logo" style={{ height: '40px' }} /></a>
                </div>
                <h1 style={styles.title as any}>Registration</h1>
                <p style={styles.subtitle as any}>Partner with us to empower your students</p>

                <div style={styles.inputGroup as any}>
                    <input
                        style={styles.input as any}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                    />
                    <div>
                        <input
                            style={{ ...styles.input, borderColor: emailError ? '#ef4444' : '#cbd5e1' } as any}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email Address"
                            onFocus={(e) => !emailError && (e.currentTarget.style.borderColor = '#2563eb')}
                            onBlur={(e) => !emailError && (e.currentTarget.style.borderColor = '#cbd5e1')}
                        />
                        {emailError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{emailError}</span>}
                    </div>
                    <input
                        style={styles.input as any}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Create Password"
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                        <div>
                            <input
                                style={{ ...styles.input, borderColor: phoneError ? '#ef4444' : '#cbd5e1' } as any}
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                type="text"
                                inputMode="numeric"
                                placeholder="Phone Number"
                                maxLength={10}
                                onFocus={(e) => !phoneError && (e.currentTarget.style.borderColor = '#2563eb')}
                                onBlur={(e) => !phoneError && (e.currentTarget.style.borderColor = '#cbd5e1')}
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
                        onMouseOver={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#2563eb')}
                    >
                        Login
                    </span>
                </div>


            </div>
        </div>
    );

}