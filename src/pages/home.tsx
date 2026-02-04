import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../api/me";

import logo from '../assets/tradeTalks.svg';
import toast from "react-hot-toast";

const Dashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [copied, setCopied] = useState(false);



    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ["userMe"],
        queryFn: getMe,
        enabled: !!token,
    });

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const { collegeUser } = data || {};
    const referrals = collegeUser?.referrals || [];

    const enabledReferrals = referrals.filter((student: any) => student.isEnabled === true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        queryClient.clear();
        navigate("/login");
    };

    const handleCopyLink = () => {
        if (collegeUser?.referralCode) {
            const fullLink = `https://tradetalk-auth.vercel.app/register/${collegeUser.referralCode}`;
            navigator.clipboard.writeText(fullLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Referral link copied!");
        }
    };








    const styles = {
        container: {
            padding: isMobile ? "20px 16px 120px 16px" : "40px 60px",
            backgroundColor: "#0f172a", // Slate-950
            minHeight: "100vh",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: "#f1f5f9" // Slate-100
        },
        nav: {
            display: "flex",
            flexDirection: "row" as const,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? "24px" : "40px"
        },
        referralCard: {
            background: "#1e293b", // Slate-800
            border: "1px solid #334155", // Slate-700
            borderRadius: "16px",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.1)"
        },
        logoutBtn: {
            padding: "12px 24px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600" as const,
            transition: "all 0.2s",
            width: isMobile ? "calc(100% - 32px)" : "auto",
            position: isMobile ? "fixed" as const : "static" as const,
            bottom: isMobile ? "20px" : "auto",
            left: isMobile ? "16px" : "auto",
            zIndex: 10,
            boxShadow: isMobile ? "0 -4px 20px rgba(0,0,0,0.1)" : "none"
        },
        statsContainer: {
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "40px"
        },
        card: {
            background: "#1e293b", // Slate-800
            padding: isMobile ? "24px" : "32px",
            borderRadius: "24px",
            border: "1px solid #334155", // Slate-700
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
        },
        tableWrapper: {
            background: "#1e293b", // Slate-800
            borderRadius: "24px",
            border: "1px solid #334155", // Slate-700
            overflow: "hidden",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
        },
        table: { width: "100%", borderCollapse: "separate" as const, borderSpacing: "0" },
        th: {
            textAlign: "left" as const,
            padding: "16px 24px",
            backgroundColor: "#0f172a", // Slate-950
            color: "#94a3b8", // Slate-400
            fontSize: "0.7rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            borderBottom: "1px solid #334155" // Slate-700
        },
        td: {
            padding: "16px 24px",
            borderBottom: "1px solid #334155", // Slate-700
            fontSize: "0.95rem",
            color: "#e2e8f0" // Slate-200
        },
        mobileRow: {
            padding: "20px",
            borderBottom: "1px solid #334155", // Slate-700
            display: "flex",
            flexDirection: "column" as const,
            gap: "12px"
        },
        actionGroup: {
            display: "flex",
            alignItems: "center",
            gap: "12px"
        },


        badge: {
            backgroundColor: "#1e293b", // Slate-800
            color: "#38bdf8", // Sky-400
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "0.75rem",
            fontWeight: "600",
            border: "1px solid #0c4a6e" // Sky-900 (or Slate-700) - let's use dark blueish
        },
        loader: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#0f172a",
            color: "#3b82f6",
            fontSize: "1.2rem"
        }
    };

    if (isLoading) return <div style={styles.loader}>Loading...</div>;
    if (error) return <div style={styles.loader}>Error: {(error as any).message}</div>;

    return (
        <div style={styles.container}>

            <div style={styles.nav}>
                <div>
                    <a href="https://www.tradetalks.co.in/kerala-traders-summit"><img src={logo} alt="LogicBox" style={{ height: isMobile ? "32px" : "48px" }} /></a>
                    <p style={{ color: "#94a3b8", marginTop: "4px", fontSize: "0.9rem" }}>Manage your referrals and uploads</p>
                </div>
                {isMobile && (
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Sign Out
                    </button>
                )}
            </div>

            <div
                style={styles.referralCard as any}
                onClick={handleCopyLink}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#334155")}
            >
                <div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>Your Referral Link</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: isMobile ? "0.85rem" : "1rem", color: "#cbd5e1", opacity: 0.8 }}>
                        {`https://tradetalk-auth.vercel.app/register/${collegeUser?.referralCode}`}
                    </p>
                </div>
                <div style={{ backgroundColor: copied ? "#10b981" : "#3b82f6", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600 }}>
                    {copied ? "Copied!" : "Copy"}
                </div>
            </div>

            <div style={styles.statsContainer}>
                <div style={styles.card}>
                    <p style={{ color: "#94a3b8", margin: "0 0 8px 0", fontSize: "0.75rem", fontWeight: "600" }}>REPRESENTATIVE</p>
                    <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#f1f5f9" }}>{collegeUser?.name}</h2>
                </div>

                <div style={styles.card}>
                    <p style={{ color: "#94a3b8", margin: "0 0 8px 0", fontSize: "0.75rem", fontWeight: "600" }}>TOTAL REFERRALS</p>
                    <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#f1f5f9" }}>{collegeUser?.referralCount || 0}</h2>
                </div>
                <div
                    style={{ ...styles.card, cursor: 'pointer', transition: 'transform 0.2s' } as any}
                    onClick={() => navigate('/leaderboard')}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ color: "#94a3b8", margin: "0 0 8px 0", fontSize: "0.75rem", fontWeight: "600", display: 'flex', alignItems: 'center', gap: '4px' }}>
                                YOUR RANK <span style={{ fontSize: '0.9rem' }}>🏆</span>
                            </p>
                            <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#60a5fa" }}>#{collegeUser?.rank || '-'}</h2>
                        </div>
                        <div style={{ color: "#60a5fa", opacity: 0.5 }}>➜</div>
                    </div>
                </div>
            </div>

            <div style={styles.tableWrapper}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #334155" }}>
                    <h3 style={{ margin: 0, fontSize: "1rem", color: "#f1f5f9" }}>Referred Users</h3>
                </div>

                {isMobile ? (
                    <div>
                        {enabledReferrals.map((student: any) => (
                            <div key={student._id} style={styles.mobileRow}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <div style={{ fontWeight: "600", color: "#f1f5f9" }}>{student.name}</div>
                                        <span style={styles.badge}>{student.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Full Name</th>
                                <th style={styles.th}>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enabledReferrals.map((student: any) => (
                                <tr key={student._id}>
                                    <td style={styles.td}><div style={{ fontWeight: "600" }}>{student.name}</div></td>
                                    <td style={styles.td}>{student.phoneNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {
                isMobile && (
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Sign Out
                    </button>
                )
            }
        </div >
    );
};

export default Dashboard;