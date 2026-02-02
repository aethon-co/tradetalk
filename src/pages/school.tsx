import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { signupSchool } from '../api/school';
import logo from '../assets/lb_logo_4_dark_background.svg';

export default function School() {
    const navigate = useNavigate();
    const { referralCode: urlReferralCode } = useParams();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    const [formData, setFormData] = useState({
        name: '',
        schoolName: '',
        password: '',
        phoneNumber: '',
        standard: '',
        address: '',
        referralCode: urlReferralCode || '',
        feedbackDetails: '',
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (urlReferralCode) {
            setFormData(prev => ({ ...prev, referralCode: urlReferralCode }));
        }
    }, [urlReferralCode]);

    const mutation = useMutation({
        mutationFn: signupSchool,
        onSuccess: () => {
            alert("Signup Successful!");
            navigate("/login");
        },
        onError: (error: any) => {
            alert(`Signup Failed: ${error.message}`);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        mutation.mutate(formData);
    };

    const styles = {
        wrapper: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff7ed', // Orange-50
            padding: '40px 20px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        },
        card: {
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#ffffff',
            padding: isMobile ? '30px 20px' : '40px',
            borderRadius: '24px',
            border: '1px solid #fed7aa', // Orange-200
            boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.15)'
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
        formContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px'
        },
        gridRow: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '16px'
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
            backgroundColor: '#f97316', // Orange-500
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
        buttonSecondary: {
            width: '100%',
            backgroundColor: 'transparent',
            color: '#64748b', // Slate-500
            padding: '12px',
            borderRadius: '12px',
            fontWeight: '500',
            fontSize: '0.9rem',
            border: '1px solid #cbd5e1', // Slate-300
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'all 0.2s'
        },
        footerText: {
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.9rem'
        },
        link: {
            color: '#f97316', // Orange-500
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
                <h1 style={styles.title as any}>Student Registration</h1>
                <p style={styles.subtitle as any}>Enter details to join the program</p>

                <div style={styles.formContainer as any}>
                    <div style={styles.gridRow as any}>
                        <input
                            style={styles.input as any}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                        />
                        <input
                            style={styles.input as any}
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                            placeholder="School Name"
                        />
                    </div>

                    <div style={styles.gridRow as any}>
                        <input
                            style={styles.input as any}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Create Password"
                        />
                        <input
                            style={styles.input as any}
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            type="number"
                            placeholder="Parent Phone"
                        />
                    </div>

                    <div style={styles.gridRow as any}>
                        <input
                            style={styles.input as any}
                            name="standard"
                            value={formData.standard}
                            onChange={handleChange}
                            placeholder="Grade"
                        />
                        <input
                            style={styles.input as any}
                            name="referralCode"
                            value={formData.referralCode}
                            onChange={handleChange}
                            placeholder="Referral Code"
                            disabled
                        />
                    </div>

                    <input
                        style={styles.input as any}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Full Address"
                    />

                    <input
                        style={styles.input as any}
                        name="feedbackDetails"
                        value={formData.feedbackDetails}
                        onChange={handleChange}
                        placeholder="Additional Details (Optional)"
                    />
                </div>

                <button
                    style={{ ...styles.buttonPrimary, opacity: mutation.isPending ? 0.7 : 1 } as any}
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Processing..." : "Submit Registration"}
                </button>

                <button
                    style={styles.buttonSecondary as any}
                    onClick={() => navigate("/")}
                >
                    Register as College Representative
                </button>

                <div style={styles.footerText as any}>
                    Already have an account?
                    <span style={styles.link as any} onClick={() => navigate("/login")}>Login</span>
                </div>
            </div>
        </div>
    );
}