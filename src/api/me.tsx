export const getMe = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}api/v1/college/${user._id}`, {
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