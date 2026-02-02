export const uploadVideo = async ({ studentId, file }: { studentId: string; file: File }) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}api/v1/college/${studentId}/upload`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });
    return response.json();
};