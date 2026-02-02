import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMe } from "../api/me";
import { deleteStudent } from "../api/delete";
import logo from '../assets/lb_logo_4_dark_background.svg';
import { uploadVideo } from "../api/upload.ts";
import { deleteVideo } from "../api/video.ts";
import VideoModal from "../components/VideoModal.tsx";
import toast from "react-hot-toast";

const Dashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [copied, setCopied] = useState(false);

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

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

    const { collegeUser, referrals = [] } = data || {};

    const enabledReferrals = referrals.filter((student: any) => student.isEnabled === true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        queryClient.clear();
        navigate("/login");
    };

    const handleCopyLink = () => {
        if (collegeUser?.referralCode) {
            const fullLink = `${window.location.origin}/school/${collegeUser.referralCode}`;
            navigator.clipboard.writeText(fullLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Referral link copied!");
        }
    };

    const uploadMutation = useMutation({
        mutationFn: uploadVideo,
    });

    const handleVideoUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        studentId: string
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const toastId = toast.loading("Uploading video...");
            try {
                await uploadMutation.mutateAsync({ studentId, file });
                await queryClient.invalidateQueries({ queryKey: ["userMe"] });
                toast.success("Video uploaded successfully!", { id: toastId });
            } catch (error) {
                console.error(error);
                toast.error("Failed to upload video.", { id: toastId });
            }
        }
    };


    const deletemutation = useMutation({
        mutationFn: deleteStudent,

    });


    const handleDeleteStudent = async (studentId: string) => {
        try {
            await deletemutation.mutateAsync(studentId);
            await queryClient.invalidateQueries({ queryKey: ["userMe"] });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteVideo = async (studentId: string) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            const toastId = toast.loading("Deleting video...");
            try {
                await deleteVideo(studentId);
                await queryClient.invalidateQueries({ queryKey: ["userMe"] });
                toast.success("Video deleted successfully", { id: toastId });
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete video", { id: toastId });
            }
        }
    };

    const openVideoModal = (url: string) => {
        setCurrentVideoUrl(url);
        setIsVideoModalOpen(true);
    };

    const closeVideoModal = () => {
        setIsVideoModalOpen(false);
        setCurrentVideoUrl(null);
    };

    const styles = {
        container: {
            padding: isMobile ? "20px 16px 120px 16px" : "40px 60px",
            backgroundColor: "#fff7ed", // Orange-50
            minHeight: "100vh",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: "#1e293b" // Slate-800
        },
        nav: {
            display: "flex",
            flexDirection: "row" as const,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? "24px" : "40px"
        },
        referralCard: {
            background: "#ffffff",
            border: "1px solid #fed7aa", // Orange-200
            borderRadius: "16px",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 6px -1px rgba(249, 115, 22, 0.1)"
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
            background: "#ffffff",
            padding: isMobile ? "24px" : "32px",
            borderRadius: "24px",
            border: "1px solid #fed7aa", // Orange-200
            boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.05)"
        },
        tableWrapper: {
            background: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #fed7aa", // Orange-200
            overflow: "hidden",
            boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.05)"
        },
        table: { width: "100%", borderCollapse: "separate" as const, borderSpacing: "0" },
        th: {
            textAlign: "left" as const,
            padding: "16px 24px",
            backgroundColor: "#fff7ed", // Orange-50
            color: "#64748b", // Slate-500
            fontSize: "0.7rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            borderBottom: "1px solid #fed7aa"
        },
        td: {
            padding: "16px 24px",
            borderBottom: "1px solid #f1f5f9", // Slate-100
            fontSize: "0.95rem",
            color: "#1e293b"
        },
        mobileRow: {
            padding: "20px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            flexDirection: "column" as const,
            gap: "12px"
        },
        actionGroup: {
            display: "flex",
            alignItems: "center",
            gap: "12px"
        },
        uploadLabel: {
            backgroundColor: "#f97316", // Orange-500
            color: "white",
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            transition: "all 0.2s"
        },
        viewBtn: {
            backgroundColor: "#fff7ed", // Orange-50
            color: "#f97316", // Orange-500
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "600",
            border: "1px solid #fed7aa", // Orange-200
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s"
        },
        deleteBtn: {
            backgroundColor: "#fef2f2", // Red-50
            color: "#ef4444",
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            border: "1px solid #fecaca", // Red-200
            fontSize: "0.85rem",
            fontWeight: "600",
            transition: "all 0.2s"
        },
        badge: {
            backgroundColor: "#e0f2fe", // Sky-100
            color: "#0284c7", // Sky-600
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "0.75rem",
            fontWeight: "600",
            border: "1px solid #bae6fd" // Sky-200
        },
        loader: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#fff7ed",
            color: "#f97316",
            fontSize: "1.2rem"
        }
    };

    if (isLoading) return <div style={styles.loader}>Loading...</div>;
    if (error) return <div style={styles.loader}>Error: {(error as any).message}</div>;

    return (
        <div style={styles.container}>
            <VideoModal
                isOpen={isVideoModalOpen}
                videoUrl={currentVideoUrl}
                onClose={closeVideoModal}
            />
            <div style={styles.nav}>
                <div>
                    <a href="https://www.logicbox.ac/"><img src={logo} alt="LogicBox" style={{ height: isMobile ? "32px" : "48px" }} /></a>
                    <p style={{ color: "#64748b", marginTop: "4px", fontSize: "0.9rem" }}>Manage your referrals and uploads</p>
                </div>
                {!isMobile && (
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Sign Out
                    </button>
                )}
            </div>

            <div
                style={styles.referralCard as any}
                onClick={handleCopyLink}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#fed7aa")}
            >
                <div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#f97316", fontWeight: 700, textTransform: "uppercase" }}>Your Referral Link</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: isMobile ? "0.85rem" : "1rem", color: "#334155", opacity: 0.8 }}>
                        {window.location.origin}/school/{collegeUser?.referralCode}
                    </p>
                </div>
                <div style={{ backgroundColor: copied ? "#10b981" : "#f97316", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600 }}>
                    {copied ? "Copied!" : "Copy"}
                </div>
            </div>

            <div style={styles.statsContainer}>
                <div style={styles.card}>
                    <p style={{ color: "#64748b", margin: "0 0 8px 0", fontSize: "0.75rem", fontWeight: "600" }}>REPRESENTATIVE</p>
                    <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#1e293b" }}>{collegeUser?.name}</h2>
                </div>
                <div style={styles.card}>
                    <p style={{ color: "#64748b", margin: "0 0 8px 0", fontSize: "0.75rem", fontWeight: "600" }}>INSTITUTION</p>
                    <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#f97316" }}>{collegeUser?.collegeName}</h2>
                </div>
                <div style={styles.card}>
                    <p style={{ color: "#64748b", margin: "0 0 8px 0", fontSize: "0.75rem", fontWeight: "600" }}>TOTAL REFERRALS</p>
                    <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#1e293b" }}>{collegeUser?.referralCount || 0}</h2>
                </div>
                <div
                    style={{ ...styles.card, cursor: 'pointer', transition: 'transform 0.2s' } as any}
                    onClick={() => navigate('/leaderboard')}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ color: "#64748b", margin: "0 0 8px 0", fontSize: "0.75rem", fontWeight: "600", display: 'flex', alignItems: 'center', gap: '4px' }}>
                                YOUR RANK <span style={{ fontSize: '0.9rem' }}>🏆</span>
                            </p>
                            <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#f97316" }}>#{collegeUser?.rank || '-'}</h2>
                        </div>
                        <div style={{ color: "#f97316", opacity: 0.5 }}>➜</div>
                    </div>
                </div>
            </div>

            <div style={styles.tableWrapper}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
                    <h3 style={{ margin: 0, fontSize: "1rem", color: "#1e293b" }}>Enrolled Students</h3>
                </div>

                {isMobile ? (
                    <div>
                        {enabledReferrals.map((student: any) => (
                            <div key={student._id} style={styles.mobileRow}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <div style={{ fontWeight: "600", color: "#1e293b" }}>{student.name}</div>
                                        <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{student.schoolName}</div>
                                    </div>
                                    <span style={styles.badge}>{student.standard}</span>
                                </div>
                                <div style={styles.actionGroup}>
                                    {student.videoUrl ? (
                                        <>
                                            <button
                                                onClick={() => openVideoModal(student.videoUrl)}
                                                style={styles.viewBtn}
                                            >
                                                Play Video
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVideo(student._id)}
                                                style={styles.deleteBtn}
                                            >
                                                Delete Video
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                id={`upload-mob-${student._id}`}
                                                style={{ display: "none" }}
                                                onChange={(e) => handleVideoUpload(e, student._id)}
                                            />
                                            <label htmlFor={`upload-mob-${student._id}`} style={{ ...styles.uploadLabel, flex: 1 }}>
                                                Upload Video
                                            </label>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDeleteStudent(student._id)}
                                        style={styles.deleteBtn}
                                    >
                                        Delete Student
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Full Name</th>
                                <th style={styles.th}>School / College</th>
                                <th style={styles.th}>Grade</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enabledReferrals.map((student: any) => (
                                <tr key={student._id}>
                                    <td style={styles.td}><div style={{ fontWeight: "600" }}>{student.name}</div></td>
                                    <td style={styles.td}>{student.schoolName}</td>
                                    <td style={styles.td}>{student.standard}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionGroup}>
                                            {student.videoUrl ? (
                                                <>
                                                    <button
                                                        onClick={() => openVideoModal(student.videoUrl)}
                                                        style={styles.viewBtn}
                                                    >
                                                        Play Video
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVideo(student._id)}
                                                        style={styles.deleteBtn}
                                                    >
                                                        Delete Video
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        id={`upload-${student._id}`}
                                                        style={{ display: "none" }}
                                                        onChange={(e) => handleVideoUpload(e, student._id)}
                                                    />
                                                    <label htmlFor={`upload-${student._id}`} style={styles.uploadLabel}>
                                                        Upload Video
                                                    </label>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDeleteStudent(student._id)}
                                                style={styles.deleteBtn}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)"}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isMobile && (
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Sign Out
                </button>
            )}
        </div>
    );
};

export default Dashboard;