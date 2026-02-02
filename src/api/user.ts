export const signupUser = async (userData: any) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}api/v1/user/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Signup failed");
    }
    return response.json();
};

export const loginUser = async (credentials: any) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}api/v1/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
    }
    return response.json();
};
