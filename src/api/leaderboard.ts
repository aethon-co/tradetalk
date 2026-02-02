export const fetchLeaderboard = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}api/v1/college/leaderboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }

    return response.json();
};
