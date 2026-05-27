const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/issues";

export const getIssues = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching issues:", error);
        return [];
    }
};

export const saveIssue = async (issue) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(issue),
        });
        if (!response.ok) {
            throw new Error(`Failed to save issue: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error saving issue:", error);
        throw error;
    }
};

export const updateIssueStatus = async (id, status) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            throw new Error(`Failed to update issue status: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating issue status:", error);
        throw error;
    }
};

export const deleteIssue = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete issue: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error deleting issue:", error);
        throw error;
    }
};