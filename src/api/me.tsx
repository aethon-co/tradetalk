export const getMe = async () => {
    // Check local user for quick invalidation? 
    // Actually safer to trust the API call. If 401, handle it.

    // Using import.meta.env.VITE_SERVER_URL + "api/v1/user/me"
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}api/v1/user/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include" // Important: Sends the cookie
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get user");
    }
    return response.json();
};