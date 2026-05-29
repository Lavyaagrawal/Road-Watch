const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/issues";

// Dynamic local storage key
const LOCAL_STORAGE_KEY = "roadwatch_issues";

// Realistic mock reports to initialize standard local storage fallback if empty
const DEFAULT_MOCK_ISSUES = [
    {
        id: "mock-1",
        type: "Pothole",
        roadType: "Urban Road",
        authority: "Municipal Corporation",
        status: "Pending",
        description: "Deep, dangerous pothole causing severe traffic slowdowns near lane 4, Koregaon Park.",
        latitude: 18.5362,
        longitude: 73.8930,
        userEmail: "lavyaagrawal123@gmail.com",
        imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=800",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    {
        id: "mock-2",
        type: "Waterlogging",
        roadType: "State Highway (SH)",
        authority: "Public Works Department",
        status: "In Progress",
        description: "Heavy storm monsoon flooding has caused severe waterlogging on SH-27 bypass route.",
        latitude: 18.5204,
        longitude: 73.8567,
        userEmail: "citizen@example.com",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
    },
    {
        id: "mock-3",
        type: "Broken Signal",
        roadType: "National Highway (NH)",
        authority: "Traffic Police",
        status: "Resolved",
        description: "Traffic signal completely non-operational at NH48 bypass junction causing gridlock.",
        latitude: 18.5089,
        longitude: 73.9258,
        userEmail: "commuter@test.com",
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
        id: "mock-4",
        type: "Road Crack",
        roadType: "Rural Road",
        authority: "Road Maintenance Department",
        status: "Pending",
        description: "Severe longitudinal asphalt structural crack spanning 5 meters near rural sector link road.",
        latitude: 18.5604,
        longitude: 73.8067,
        userEmail: "village.rep@roadwatch.org",
        imageUrl: "https://images.unsplash.com/photo-1599740831464-5cbe1d126f4f?auto=format&fit=crop&q=80&w=800",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    }
];

const initializeLocalStorage = () => {
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_ISSUES));
        return DEFAULT_MOCK_ISSUES;
    }
    return JSON.parse(existing);
};

// Retrieve local reports
const getLocalIssues = () => {
    const issues = initializeLocalStorage();
    return issues.map(issue => {
        let authority = issue.authority;
        if (!authority) {
            if (issue.type === "Waterlogging") authority = "Public Works Department";
            else if (issue.type === "Broken Signal") authority = "Traffic Police";
            else if (issue.type === "Road Crack") authority = "Road Maintenance Department";
            else authority = "Municipal Corporation";
        }
        return {
            ...issue,
            authority,
            roadType: issue.roadType || "Urban Road"
        };
    });
};

// Save a report locally
const saveLocalIssue = (issue) => {
    const issues = getLocalIssues();
    const newIssue = {
        ...issue,
        id: issue.id || `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    issues.unshift(newIssue); // add to top
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(issues));
    return newIssue;
};

// Update local status
const updateLocalIssueStatus = (id, status) => {
    const issues = getLocalIssues();
    const updated = issues.map(issue => 
        String(issue.id) === String(id) ? { ...issue, status } : issue
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, id, status };
};

// Delete local report
const deleteLocalIssue = (id) => {
    const issues = getLocalIssues();
    const filtered = issues.filter(issue => String(issue.id) !== String(id));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return { success: true, id };
};

// EXPORTED FUNCTIONS WITH HYBRID NETWORK / STORAGE FALLBACKS
export const getIssues = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Auto-resolve missing fields for backward compatibility
        const mappedData = data.map(issue => {
            let authority = issue.authority;
            if (!authority) {
                if (issue.type === "Waterlogging") authority = "Public Works Department";
                else if (issue.type === "Broken Signal") authority = "Traffic Police";
                else if (issue.type === "Road Crack") authority = "Road Maintenance Department";
                else authority = "Municipal Corporation";
            }
            return {
                ...issue,
                authority,
                roadType: issue.roadType || "Urban Road"
            };
        });

        // Sync local storage for offline state references
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mappedData));
        return mappedData;
    } catch (error) {
        console.warn("API unavailable. Falling back to robust LocalStorage report system.", error);
        return getLocalIssues();
    }
};

export const saveIssue = async (issue) => {
    // resolve fields before dispatch
    let authority = issue.authority;
    if (!authority) {
        if (issue.type === "Waterlogging") authority = "Public Works Department";
        else if (issue.type === "Broken Signal") authority = "Traffic Police";
        else if (issue.type === "Road Crack") authority = "Road Maintenance Department";
        else authority = "Municipal Corporation";
    }
    const issueToSave = {
        ...issue,
        authority,
        roadType: issue.roadType || "Urban Road"
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(issueToSave),
        });
        if (!response.ok) {
            throw new Error(`Failed to save issue: ${response.statusText}`);
        }
        const data = await response.json();
        
        let finalAuthority = data.authority;
        if (!finalAuthority) {
            if (data.type === "Waterlogging") finalAuthority = "Public Works Department";
            else if (data.type === "Broken Signal") finalAuthority = "Traffic Police";
            else if (data.type === "Road Crack") finalAuthority = "Road Maintenance Department";
            else finalAuthority = "Municipal Corporation";
        }
        const mappedData = {
            ...data,
            authority: finalAuthority,
            roadType: data.roadType || "Urban Road"
        };

        saveLocalIssue(mappedData);
        return mappedData;
    } catch (error) {
        console.warn("API submission failed. Storing report in localStorage.", error);
        return saveLocalIssue(issueToSave);
    }
};

export const updateIssueStatus = async (id, status) => {
    try {
        // If it's a mock or local-only report, don't try to query the backend
        if (String(id).startsWith("mock-") || String(id).startsWith("local-")) {
            return updateLocalIssueStatus(id, status);
        }

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            throw new Error(`Failed to update status on server: ${response.statusText}`);
        }
        const data = await response.json();
        updateLocalIssueStatus(id, status);
        return data;
    } catch (error) {
        console.warn("API update failed. Updating report in localStorage.", error);
        return updateLocalIssueStatus(id, status);
    }
};

export const deleteIssue = async (id) => {
    try {
        if (String(id).startsWith("mock-") || String(id).startsWith("local-")) {
            return deleteLocalIssue(id);
        }

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete issue on server: ${response.statusText}`);
        }
        const data = await response.json();
        deleteLocalIssue(id);
        return data;
    } catch (error) {
        console.warn("API delete failed. Removing report from localStorage.", error);
        return deleteLocalIssue(id);
    }
};