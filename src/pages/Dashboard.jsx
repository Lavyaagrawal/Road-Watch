import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { getIssues } from "../services/localIssueService";
import Layout from "../components/Layout";
import ReportDetailsModal from "../components/ReportDetailsModal";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { 
    LayoutDashboard, 
    FileText, 
    Clock, 
    Hammer, 
    CheckCircle, 
    ArrowUpRight, 
    Calendar, 
    ShieldAlert, 
    PlusCircle,
    UserCircle
} from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
    const [issues, setIssues] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);

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
                <div className="min-h-screen flex items-center justify-center bg-slate-950">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">SUMMONING USER DOSSIER...</div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Calculations
    const totalCount = issues.length;
    const pendingCount = issues.filter(i => i.status === "Pending").length;
    const progressCount = issues.filter(i => i.status === "In Progress").length;
    const resolvedCount = issues.filter(i => i.status === "Resolved").length;

    // Recharts Data Set
    const statusData = [
        { name: "Pending", value: pendingCount, color: "#ef4444" },
        { name: "In Progress", value: progressCount, color: "#f59e0b" },
        { name: "Resolved", value: resolvedCount, color: "#10b981" }
    ].filter(item => item.value > 0); // Only render items with counts

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN").format(val);
    };

    const statusBadgeColors = {
        Pending: "bg-red-500/10 border-red-500/20 text-red-400",
        "In Progress": "bg-amber-500/10 border-amber-500/20 text-amber-400",
        Resolved: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    };

    const authorityBadgeColors = {
        "Municipal Corporation": "bg-indigo-500/10 border-indigo-500/15 text-indigo-400",
        "Public Works Department": "bg-cyan-500/10 border-cyan-500/15 text-cyan-400",
        "Traffic Police": "bg-amber-500/10 border-amber-500/15 text-amber-400",
        "Road Maintenance Department": "bg-sky-500/10 border-sky-500/15 text-sky-400"
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-4"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" /> Citizen Workstation
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent"
                        >
                            My RoadWatch Dashboard
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 flex items-center gap-2 text-sm sm:text-base font-semibold"
                        >
                            <UserCircle className="w-4 h-4 text-blue-500" /> Logged in as: <span className="text-blue-400 font-mono text-xs sm:text-sm bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl shadow-inner">{user?.email}</span>
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            to="/report"
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-6 py-4.5 rounded-2xl border border-blue-500/20 shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_30px_rgba(37,99,235,0.5)] hover:scale-[1.02] transition-all duration-300 active:scale-98"
                        >
                            <PlusCircle className="w-5 h-5" /> File New Complaint
                        </Link>
                    </motion.div>
                </div>

                {issues.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/30 border border-slate-900 rounded-3xl p-16 text-center backdrop-blur-md shadow-2xl max-w-2xl mx-auto flex flex-col items-center gap-6"
                    >
                        <div className="h-16 w-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-100">No Reports Filed Yet</h2>
                            <p className="text-slate-400 mt-2 text-sm max-w-md leading-relaxed">
                                You haven't submitted any civic issue reports on this account. Help make our roads safer by reporting potholes, broken signals, or waterlogging in your locality.
                            </p>
                        </div>
                        <Link
                            to="/report"
                            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.25)] transition duration-300"
                        >
                            Submit Your First Report
                        </Link>
                    </motion.div>
                ) : (
                    /* Dashboard Grid */
                    <div className="space-y-12">
                        {/* Stat Cards */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Reports */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md shadow-xl group hover:scale-[1.02] transition-transform duration-300"
                            >
                                <div className="absolute top-0 right-0 p-5 opacity-10 text-slate-400 group-hover:scale-110 transition-transform duration-300">
                                    <FileText className="w-20 h-20" />
                                </div>
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="h-11 w-11 bg-slate-800/80 border border-slate-700/40 text-slate-400 rounded-xl flex items-center justify-center shadow-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">Total Submitted</span>
                                </div>
                                <h2 className="text-4xl font-black text-white leading-tight">{totalCount}</h2>
                                <p className="text-[11px] text-slate-500 mt-2 font-semibold flex items-center gap-1">
                                    All reports filed on this workstation
                                </p>
                            </motion.div>

                            {/* Pending Reports */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md shadow-xl group hover:scale-[1.02] transition-transform duration-300"
                            >
                                <div className="absolute top-0 right-0 p-5 opacity-10 text-red-500 group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="w-20 h-20" />
                                </div>
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="h-11 w-11 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center shadow-lg">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">Pending Issues</span>
                                </div>
                                <h2 className="text-4xl font-black text-white leading-tight">{pendingCount}</h2>
                                <p className="text-[11px] text-slate-500 mt-2 font-semibold flex items-center gap-1">
                                    Awaiting initial authority dispatch
                                </p>
                            </motion.div>

                            {/* In Progress Reports */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md shadow-xl group hover:scale-[1.02] transition-transform duration-300"
                            >
                                <div className="absolute top-0 right-0 p-5 opacity-10 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                                    <Hammer className="w-20 h-20" />
                                </div>
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="h-11 w-11 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                                        <Hammer className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">In Progress</span>
                                </div>
                                <h2 className="text-4xl font-black text-white leading-tight">{progressCount}</h2>
                                <p className="text-[11px] text-slate-500 mt-2 font-semibold flex items-center gap-1">
                                    Active repair works dispatched
                                </p>
                            </motion.div>

                            {/* Resolved Reports */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md shadow-xl group hover:scale-[1.02] transition-transform duration-300"
                            >
                                <div className="absolute top-0 right-0 p-5 opacity-10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle className="w-20 h-20" />
                                </div>
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="h-11 w-11 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">Resolved Complaints</span>
                                </div>
                                <h2 className="text-4xl font-black text-white leading-tight">{resolvedCount}</h2>
                                <p className="text-[11px] text-slate-500 mt-2 font-semibold flex items-center gap-1">
                                    Successfully processed and fixed
                                </p>
                            </motion.div>
                        </div>

                        {/* Status Chart Visual Section */}
                        <div className="grid lg:grid-cols-5 gap-8">
                            {/* Recharts Pie Chart representing user status distribution */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="lg:col-span-2 bg-slate-900/25 border border-slate-900 p-6.5 rounded-3xl backdrop-blur-md shadow-xl flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-black text-slate-200 mb-2 flex items-center gap-2">
                                        <LayoutDashboard className="w-5 h-5 text-blue-500" /> Resolution Break
                                    </h3>
                                    <p className="text-[11px] text-slate-500">Distribution of your submitted reports by status.</p>
                                </div>

                                {statusData.length === 0 ? (
                                    <div className="h-56 flex items-center justify-center text-slate-500 text-sm font-semibold">
                                        No status parameters parsed.
                                    </div>
                                ) : (
                                    <div className="h-52 w-full flex justify-center items-center relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={75}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                >
                                                    {statusData.map((entry, idx) => (
                                                        <Cell key={`cell-${idx}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "11px" }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute flex flex-col justify-center items-center text-center">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Resolved</span>
                                            <span className="text-xl font-black text-slate-100">
                                                {totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Color Indicator List */}
                                <div className="flex flex-col gap-2.5 mt-2 bg-slate-950/40 p-4 border border-slate-900 rounded-2xl">
                                    {statusData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-slate-400">{item.name} Reports</span>
                                            </div>
                                            <span className="font-mono text-slate-300">{item.value} ({Math.round((item.value / totalCount) * 100)}%)</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Recent Reports Table List */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="lg:col-span-3 bg-slate-900/25 border border-slate-900 rounded-3xl backdrop-blur-md shadow-xl flex flex-col"
                            >
                                <div className="p-6 border-b border-slate-900 bg-slate-950/80 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-200">Recent Filed Reports</h3>
                                        <p className="text-[11px] text-slate-500 mt-1">Audit log of complaints submitted by you.</p>
                                    </div>
                                </div>

                                <div className="grow overflow-y-auto max-h-[360px]">
                                    <div className="divide-y divide-slate-900/60">
                                        {issues.map((issue) => (
                                            <div 
                                                key={issue.id}
                                                onClick={() => setSelectedIssue(issue)}
                                                className="p-5 flex items-center justify-between hover:bg-slate-900/15 transition-all duration-200 cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Miniature image thumbnail */}
                                                    <img
                                                        src={issue.imageUrl}
                                                        alt={issue.type}
                                                        className="h-12 w-12 rounded-xl object-cover border border-slate-800 group-hover:border-slate-700 transition"
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">{issue.type}</h4>
                                                        <div className="flex flex-wrap gap-2 items-center mt-1">
                                                            <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(issue.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                            </span>
                                                            <span className={`text-[9px] font-bold border px-1.5 py-0.2 rounded-md ${authorityBadgeColors[issue.authority || "Municipal Corporation"]}`}>
                                                                {issue.authority || "Municipal Corporation"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-black border px-2.5 py-0.5 rounded-full uppercase ${statusBadgeColors[issue.status]}`}>
                                                        {issue.status}
                                                    </span>
                                                    <ArrowUpRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

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

export default Dashboard;