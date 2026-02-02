import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "../api/leaderboard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from '../assets/lb_logo_4_dark_background.svg';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { data: leaderboard, isLoading, error } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: fetchLeaderboard,
    });

    const styles = {
        wrapper: {
            minHeight: '100vh',
            backgroundColor: '#fff7ed', // Orange-50
            padding: isMobile ? '20px' : '40px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        },
        container: {
            maxWidth: '800px',
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
        },
        backButton: {
            backgroundColor: 'transparent',
            border: '1px solid #fed7aa', // Orange-200
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#f97316', // Orange-500
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #fed7aa', // Orange-200
            boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.05)',
            overflow: 'hidden'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
        },
        th: {
            textAlign: 'left' as const,
            padding: '16px 24px',
            backgroundColor: '#fff7ed', // Orange-50
            color: '#64748b', // Slate-500
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            borderBottom: '1px solid #fed7aa'
        },
        td: {
            padding: '16px 24px',
            borderBottom: '1px solid #f1f5f9',
            color: '#1e293b', // Slate-800
            fontSize: '0.95rem'
        },
        rankBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            fontWeight: '700',
            fontSize: '0.9rem'
        },
        gold: { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' },
        silver: { backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' },
        bronze: { backgroundColor: '#ffedd5', color: '#c2410c', border: '1px solid #fdba74' },
        defaultRank: { color: '#64748b' }
    };

    const getRankStyle = (index: number) => {
        if (index === 0) return styles.gold;
        if (index === 1) return styles.silver;
        if (index === 2) return styles.bronze;
        return styles.defaultRank;
    };

    if (isLoading) return <div style={{ ...styles.wrapper, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#f97316' }}>Loading Leaderboard...</div>;
    if (error) return <div style={{ ...styles.wrapper, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444' }}>Error loading leaderboard</div>;

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate('/home')}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff7ed'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        ← Back to Dashboard
                    </button>
                    <a href="https://www.logicbox.ac/"><img src={logo} alt="LogicBox" style={{ height: '32px' }} /></a>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Top Performers</h1>
                    <p style={{ color: '#64748b' }}>Celebrating our top performing representatives</p>
                </div>

                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ ...styles.th, width: '80px', textAlign: 'center' }}>Rank</th>
                                <th style={styles.th}>Representative</th>
                                {!isMobile && <th style={styles.th}>Institution</th>}
                                <th style={{ ...styles.th, textAlign: 'right' }}>Referrals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user: any, index: number) => (
                                <tr key={user._id || index} style={{ backgroundColor: index < 3 ? '#ffffff' : '#ffffff' }}>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>
                                        <span style={{ ...styles.rankBadge, ...getRankStyle(index) }}>{index + 1}</span>
                                    </td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>
                                        {user.name}
                                        {isMobile && <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '400', marginTop: '2px' }}>{user.collegeName}</div>}
                                    </td>
                                    {!isMobile && <td style={styles.td}>{user.collegeName}</td>}
                                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: '#f97316' }}>{user.referralCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
