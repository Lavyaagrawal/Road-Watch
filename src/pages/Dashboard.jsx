import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import IssueCard from "../components/IssueCard";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getIssues } from "../services/localIssueService";

function Dashboard() {
    const [issues, setIssues] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchMyIssues(currentUser.email);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchMyIssues = async (email) => {
        try {
            const allIssues = await getIssues();
            const myIssues = allIssues.filter(issue => issue.userEmail === email);
            setIssues(myIssues);
        } catch (error) {
            console.error("Error fetching my issues: ", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl font-bold animate-pulse text-blue-500">Loading...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-20">
                <h1 className="text-5xl font-black mb-4">My Dashboard</h1>

                <p className="text-slate-400 mb-12">
                    Logged in as: <span className="text-blue-400 font-semibold">{user?.email}</span>
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {issues.length === 0 ? (
                        <div className="col-span-3 text-center py-20 text-slate-500 text-2xl">
                            No reports submitted yet.
                        </div>
                    ) : (
                        issues.map(issue => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;