export const deleteVideo = async (studentId: string) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}api/v1/college/${studentId}/video/delete`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    });
    return response.json();
};
