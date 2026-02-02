export const deleteStudent = async (id: string) => {
    const url = `${import.meta.env.VITE_SERVER_URL}api/v1/college/${id}`;
    console.log("Deleting student at URL:", url);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const text = await response.text();
    try {
        const data = JSON.parse(text);
        if (!response.ok) {
            throw new Error(data.message || "Failed to delete student");
        }
        return data;
    } catch (e) {
        console.error("Failed to parse response:", text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
    }
}  