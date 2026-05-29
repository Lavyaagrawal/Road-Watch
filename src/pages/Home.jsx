import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import IssueCard from "../components/IssueCard";
import ReportDetailsModal from "../components/ReportDetailsModal";
import { getIssues } from "../services/localIssueService";
import { 
    AlertCircle, 
    ArrowRight, 
    Shield, 
    Map, 
    PlusCircle, 
    Activity, 
    CheckCircle2, 
    Clock, 
    Database 
} from "lucide-react";

function Home() {
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const data = await getIssues();
                setIssues(data);
            } catch (error) {
                console.error("Error loading issues: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    // Filter status counts
    const pendingIssues = issues.filter(issue => issue.status === "Pending");
    const progressIssues = issues.filter(issue => issue.status === "In Progress");
    const resolvedIssues = issues.filter(issue => issue.status === "Resolved");

    return (
        <Layout>
            <div className="relative min-h-screen bg-slate-950 overflow-hidden">
                {/* Decorative Glowing Backdrop Orbs */}
                <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] select-none pointer-events-none"></div>
                <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[150px] select-none pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
                    {/* Hero Section */}
                    <div className="text-center mb-24 max-w-4xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold mb-6 tracking-wide shadow-md"
                        >
                            <Shield className="w-4 h-4 text-blue-500" /> Transparent Municipal Infrastructure
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
                        >
                            Smarter Roads.<br />
                            <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                                Safer Cities.
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
                        >
                            Empowering citizens to report potholes, broken signals, waterlogging, and structural hazards in real-time. Boost government transparency and repair accountability.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row justify-center items-center gap-4"
                        >
                            <Link
                                to="/report"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-8 py-4.5 rounded-2xl border border-blue-500/20 shadow-[0_4px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_35px_rgba(37,99,235,0.55)] hover:scale-[1.02] transition-all duration-300 active:scale-98"
                            >
                                <PlusCircle className="w-5 h-5" /> Report Road Issue
                            </Link>

                            <Link
                                to="/map"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-900 hover:border-slate-800/80 text-slate-200 font-bold px-8 py-4.5 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 active:scale-98"
                            >
                                <Map className="w-5 h-5 text-blue-500" /> View Live Map <ArrowRight className="w-4 h-4 text-slate-500" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats Dashboard Row */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid md:grid-cols-3 gap-6 mb-24"
                    >
                        <StatsCard
                            title="Total Logged Incidents"
                            value={issues.length}
                            icon={<Database className="w-6 h-6 text-blue-500" />}
                        />

                        <StatsCard
                            title="Pending Dispatch"
                            value={pendingIssues.length}
                            icon={<Clock className="w-6 h-6 text-red-500" />}
                        />

                        <StatsCard
                            title="Resolved Campaigns"
                            value={resolvedIssues.length}
                            icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                        />
                    </motion.div>

                    {/* Community Feed */}
                    <div className="border-t border-slate-900/60 pt-16">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-100 flex items-center gap-2.5">
                                    <Activity className="w-7 h-7 text-blue-500" /> Public Community Feed
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">Recent civic complaints reported by citizens in real-time.</p>
                            </div>
                            <span className="text-xs bg-slate-900 border border-slate-850 px-3.5 py-2 rounded-xl text-slate-400 font-mono shadow-inner">
                                Total Cataloged: {issues.length}
                            </span>
                        </div>

                        {loading ? (
                            /* Feed Loading State */
                            <div className="grid md:grid-cols-3 gap-8">
                                {[1, 2, 3].map((skeleton) => (
                                    <div key={skeleton} className="bg-slate-900/30 border border-slate-900/80 rounded-3xl h-96 animate-pulse p-6 flex flex-col justify-between">
                                        <div className="h-44 bg-slate-800 rounded-2xl w-full"></div>
                                        <div className="space-y-3 mt-4">
                                            <div className="h-6 bg-slate-850 rounded-lg w-2/3"></div>
                                            <div className="h-4 bg-slate-850 rounded-lg w-1/2"></div>
                                        </div>
                                        <div className="h-10 bg-slate-850 rounded-lg w-full mt-4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : issues.length === 0 ? (
                            /* Feed Empty State */
                            <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-20 text-center backdrop-blur-md shadow-inner flex flex-col items-center gap-4">
                                <AlertCircle className="w-12 h-12 text-slate-500" />
                                <h3 className="text-xl font-bold text-slate-350">No incidents reported yet</h3>
                                <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                                    Help catalog Pune route infrastructure! Report your first pothole, broken signal or road crack right now.
                                </p>
                            </div>
                        ) : (
                            /* Feed Card Grid */
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {issues.map((issue) => (
                                    <motion.div
                                        key={issue.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <IssueCard
                                            issue={issue}
                                            onViewDetails={setSelectedIssue}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Complaint Details Modal overlay */}
                {selectedIssue && (
                    <ReportDetailsModal 
                        issue={selectedIssue} 
                        onClose={() => setSelectedIssue(null)} 
                    />
                )}
            </div>
        </Layout>
    );
}

export default Home;