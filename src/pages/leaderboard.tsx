import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "../api/leaderboard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from '../assets/tradeTalks.svg';

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
            backgroundColor: '#0f172a', // Slate-950
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
            border: '1px solid #334155', // Slate-700
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#60a5fa', // Blue-400
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        card: {
            backgroundColor: '#1e293b', // Slate-800
            borderRadius: '24px',
            border: '1px solid #334155', // Slate-700
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
        },
        th: {
            textAlign: 'left' as const,
            padding: '16px 24px',
            backgroundColor: '#0f172a', // Slate-950
            color: '#94a3b8', // Slate-400
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            borderBottom: '1px solid #334155' // Slate-700
        },
        td: {
            padding: '16px 24px',
            borderBottom: '1px solid #334155', // Slate-700
            color: '#e2e8f0', // Slate-200
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
        gold: { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid #1d4ed8' },
        silver: { backgroundColor: '#334155', color: '#f1f5f9', border: '1px solid #64748b' },
        bronze: { backgroundColor: 'rgba(12, 74, 110, 0.4)', color: '#38bdf8', border: '1px solid #0369a1' },
        // Let's stick to blueish theme but distinct.
        // Actually bronze is usually brownish.
        // Let's use darker variants of provided colors.
        // gold: Blue-900
        // silver: Slate-700
        // bronze: Amber-900? Or just another slate?
        // Let's try:
        // Silver: #334155 (Slate 700)
        // Bronze: #7c2d12 (Amber 900) ? 
        // Reverting to simpler dark theme badges:
        defaultRank: { color: '#94a3b8' } // Slate-400
    };

    const getRankStyle = (index: number) => {
        if (index === 0) return styles.gold;
        if (index === 1) return styles.silver;
        if (index === 2) return styles.bronze;
        return styles.defaultRank;
    };

    if (isLoading) return <div style={{ ...styles.wrapper, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#2563eb' }}>Loading Leaderboard...</div>;
    if (error) return <div style={{ ...styles.wrapper, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444' }}>Error loading leaderboard</div>;

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate('/home')}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        ← Back to Dashboard
                    </button>
                    <a href="https://www.tradetalks.co.in/kerala-traders-summit"><img src={logo} alt="LogicBox" style={{ height: '32px' }} /></a>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Top Performers</h1>
                    <p style={{ color: '#94a3b8' }}>Celebrating our top performing representatives</p>
                </div>

                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ ...styles.th, width: '80px', textAlign: 'center' }}>Rank</th>
                                <th style={styles.th}>Representative</th>
                                <th style={{ ...styles.th, textAlign: 'right' }}>Referrals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user: any, index: number) => (
                                <tr key={user._id || index} style={{ backgroundColor: '#1e293b' }}>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>
                                        <span style={{ ...styles.rankBadge, ...getRankStyle(index) }}>{index + 1}</span>
                                    </td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>
                                        {user.name}
                                    </td>
                                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: '#60a5fa' }}>{user.referralCount}</td>
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
