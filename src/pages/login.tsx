import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/user';
import toast from 'react-hot-toast';
import logo from '../assets/tradeTalks.svg';

export default function Login() {
    const navigate = useNavigate();
    const [phoneError, setPhoneError] = useState('');
    const [formData, setFormData] = useState({
        phoneNumber: '',
        password: '',
    });

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Login successful");
            navigate("/home");
        },
        onError: (error: any) => {
            toast.error(error.message || "Login failed");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'phoneNumber') setPhoneError('');
    };

    const handleSubmit = () => {
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
            maxWidth: '450px',
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
                <h1 style={styles.title as any}>Welcome Back</h1>
                <p style={styles.subtitle as any}>Enter your credentials to access your account</p>

                <div style={styles.inputGroup as any}>
                    <div>
                        <input
                            style={{
                                ...styles.input,
                                borderColor: phoneError ? '#ef4444' : '#cbd5e1'
                            } as any}
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            type="text"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="Phone Number"
                            onFocus={(e) => !phoneError && (e.currentTarget.style.borderColor = '#2563eb')}
                            onBlur={(e) => !phoneError && (e.currentTarget.style.borderColor = '#cbd5e1')}
                        />
                        {phoneError && (
                            <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                                {phoneError}
                            </span>
                        )}
                    </div>

                    <input
                        style={styles.input as any}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                    />
                </div>

                <button
                    style={{
                        ...styles.buttonPrimary,
                        opacity: mutation.isPending ? 0.7 : 1
                    } as any}
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                >
                    {mutation.isPending ? "Signing in..." : "Login"}
                </button>

                <div style={styles.footerText as any}>
                    Don't have an account?
                    <span
                        style={styles.link as any}
                        onClick={() => navigate("/")}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#2563eb')}
                    >
                        Register
                    </span>
                </div>
            </div>
        </div>
    );
}