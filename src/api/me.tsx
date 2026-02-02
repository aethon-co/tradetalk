export const getMe = async () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    // Handle "undefined" string or null/empty
    const user = (userStr && userStr !== "undefined") ? JSON.parse(userStr) : {};
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}api/v1/user/${user._id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get user");
    }
    return response.json();
};