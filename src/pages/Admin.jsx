import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../firebase/config";
import { 
    getIssues, 
    updateIssueStatus, 
    deleteIssue 
} from "../services/localIssueService";
import Layout from "../components/Layout";
import ReportDetailsModal from "../components/ReportDetailsModal";
import { 
    Shield, 
    Search, 
    SlidersHorizontal, 
    Trash2, 
    Eye, 
    Calendar,
    AlertTriangle,
    CheckCircle,
    Clock,
    Wrench,
    ArrowLeftRight,
    MapPin,
    Download,
    FileJson
} from "lucide-react";
import { Link } from "react-router-dom";

function Admin() {
    const [issues, setIssues] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Search and Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [authorityFilter, setAuthorityFilter] = useState("All");

    // Modal Trigger
    const [selectedIssue, setSelectedIssue] = useState(null);

    // DOWNLOAD SQLite DATABASE FILE
    const handleDownloadDatabase = () => {
        const baseUrl = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace("/api/issues", "") 
            : "http://localhost:5001";
        
        window.open(`${baseUrl}/api/issues/download-db`, "_blank");
    };

    // EXPORT ACTIVE REPORTS AS JSON FILE
    const handleExportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(issues, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `roadwatch_reports_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // Track active log session
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        fetchIssues();
        return () => unsubscribe();
    }, []);

    const fetchIssues = async () => {
        try {
            const data = await getIssues();
            setIssues(data);
        } catch (error) {
            console.error("Error fetching reports: ", error);
        }
    };

    // UPDATE STATUS
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateIssueStatus(id, newStatus);
            await fetchIssues();
        } catch (error) {
            console.error("Failed to update status: ", error);
            alert("Error updating report status");
        }
    };

    // DELETE ISSUE
    const handleDeleteIssue = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this report from the civic register?")) {
            return;
        }

        try {
            await deleteIssue(id);
            await fetchIssues();
        } catch (error) {
            console.error("Failed to delete report: ", error);
            alert("Error deleting report");
        }
    };

    // FILTER LOGIC
    const filteredIssues = issues.filter(issue => {
        const matchesSearch = 
            issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (issue.roadType && issue.roadType.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
        
        const matchesAuthority = authorityFilter === "All" || issue.authority === authorityFilter;

        return matchesSearch && matchesStatus && matchesAuthority;
    });

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-slate-950">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                        <div className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">VERIFYING ADMIN SECURITY KEY...</div>
                    </div>
                </div>
            </Layout>
        );
    }

    // AUTH CHECK - Restrict access to lavyaagrawal123@gmail.com
    if (!user || user.email !== ADMIN_EMAIL) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-slate-800 p-10 rounded-3xl max-w-md w-full text-center shadow-2xl flex flex-col items-center gap-6"
                    >
                        <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white">Security Access Denied</h1>
                            <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
                                This administrator workstation is highly restricted. Log in with credentials for <span className="text-amber-400 font-semibold font-mono">{ADMIN_EMAIL}</span> to gain clearance.
                            </p>
                        </div>
                        <Link 
                            to="/login"
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 rounded-xl border border-slate-700/50 shadow-md transition"
                        >
                            Return to Login Portal
                        </Link>
                    </motion.div>
                </div>
            </Layout>
        );
    }

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
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-900 pb-8">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-4 animate-pulse"
                        >
                            <Shield className="w-3.5 h-3.5" /> Administrative Control Room
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent"
                        >
                            Civic Operations Manager
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 max-w-xl text-sm sm:text-base"
                        >
                            Manage and review citizen reports, route complaint pipelines, dispatch road repair scopes, and moderate registry logs.
                        </motion.p>
                    </div>

                    {/* Exporters and DB download buttons */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-3 shrink-0"
                    >
                        <button
                            onClick={handleExportJSON}
                            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-md transition cursor-pointer active:scale-95"
                        >
                            <FileJson className="w-4 h-4 text-blue-500" /> Export JSON
                        </button>
                        <button
                            onClick={handleDownloadDatabase}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold px-5 py-3.5 rounded-xl border border-blue-500/20 shadow-[0_4px_15px_rgba(37,99,235,0.25)] hover:scale-[1.02] transition-all duration-300 cursor-pointer active:scale-95"
                        >
                            <Download className="w-4 h-4" /> Download SQLite DB
                        </button>
                    </motion.div>
                </div>

                {/* Search & Toolbelt Controls */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid md:grid-cols-4 gap-4 mb-8 bg-slate-900/40 p-5 rounded-3xl border border-slate-900 backdrop-blur-md shadow-2xl"
                >
                    {/* Search Field */}
                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500">
                            <Search className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by description, citizen, type, road classification..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl py-4.5 pl-12 pr-5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500">
                            <SlidersHorizontal className="w-4 h-4" />
                        </span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl py-4.5 pl-11 pr-5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition duration-300 appearance-none cursor-pointer shadow-inner"
                        >
                            <option value="All">All Resolution States</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>

                    {/* Authority Filter */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500">
                            <SlidersHorizontal className="w-4 h-4" />
                        </span>
                        <select
                            value={authorityFilter}
                            onChange={(e) => setAuthorityFilter(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl py-4.5 pl-11 pr-5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition duration-300 appearance-none cursor-pointer shadow-inner"
                        >
                            <option value="All">All Dispatch Authorities</option>
                            <option value="Municipal Corporation">Municipal Corporation</option>
                            <option value="Public Works Department">Public Works Department</option>
                            <option value="Traffic Police">Traffic Police</option>
                            <option value="Road Maintenance Department">Road Maintenance Department</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                </motion.div>

                {/* Operations Main Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-950/40 border border-slate-900 rounded-3xl overflow-hidden shadow-3xl backdrop-blur-md"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-900 bg-slate-950/80">
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Dossier Details</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Reporting Citizen</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Assigned Sector Authority</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Status Badge</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase text-center">Workstation Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIssues.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-16 text-center text-slate-500 font-semibold text-lg">
                                            No matching operational reports filed.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredIssues.map((issue, index) => (
                                        <motion.tr 
                                            key={issue.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-all duration-200 group"
                                        >
                                            {/* Dossier details */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-4.5">
                                                    <img
                                                        src={issue.imageUrl}
                                                        alt={issue.type}
                                                        className="h-14 w-14 rounded-xl object-cover border border-slate-800 shadow-inner group-hover:border-slate-700 transition duration-300"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors text-base">{issue.type}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/5 border border-blue-500/15 px-2 py-0.5 rounded">
                                                                {issue.roadType || "Urban Road"}
                                                            </span>
                                                            <span className="text-[9px] text-slate-500 font-semibold flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(issue.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Citizen email */}
                                            <td className="py-5 px-6">
                                                <span className="text-sm font-semibold text-slate-300 font-mono">
                                                    {issue.userEmail}
                                                </span>
                                            </td>

                                            {/* Authority */}
                                            <td className="py-5 px-6">
                                                <span className={`inline-block text-[11px] font-bold border px-3 py-1 rounded-xl shadow-sm ${authorityBadgeColors[issue.authority || "Municipal Corporation"]}`}>
                                                    {issue.authority || "Municipal Corporation"}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-5 px-6">
                                                <span className={`inline-block text-[10px] font-black border px-3 py-1 rounded-full uppercase tracking-wider ${statusBadgeColors[issue.status]}`}>
                                                    {issue.status}
                                                </span>
                                            </td>

                                            {/* Admin control panel */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* View complete details modal */}
                                                    <button
                                                        onClick={() => setSelectedIssue(issue)}
                                                        className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl shadow transition duration-300 cursor-pointer flex items-center gap-1 text-xs font-bold"
                                                        title="View Dossier File"
                                                    >
                                                        <Eye className="w-4 h-4 text-blue-500" /> View
                                                    </button>

                                                    {/* Google Maps Coordinates */}
                                                    {issue.latitude && issue.longitude && (
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl shadow transition duration-300 cursor-pointer flex items-center justify-center"
                                                            title="Incident Map"
                                                        >
                                                            <MapPin className="w-4 h-4 text-slate-400" />
                                                        </a>
                                                    )}

                                                    <div className="h-6 w-px bg-slate-900 mx-1"></div>

                                                    {/* Dispatch State Toggles */}
                                                    <button
                                                        onClick={() => handleUpdateStatus(issue.id, "Pending")}
                                                        disabled={issue.status === "Pending"}
                                                        className={`p-2 rounded-xl text-[10px] font-black tracking-wider uppercase border transition duration-300 cursor-pointer ${
                                                            issue.status === "Pending"
                                                                ? "bg-red-500/10 border-red-500/20 text-red-500 cursor-not-allowed opacity-50"
                                                                : "bg-slate-900 hover:bg-red-500/5 border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400"
                                                        }`}
                                                        title="Set Pending"
                                                    >
                                                        <Clock className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleUpdateStatus(issue.id, "In Progress")}
                                                        disabled={issue.status === "In Progress"}
                                                        className={`p-2 rounded-xl text-[10px] font-black tracking-wider uppercase border transition duration-300 cursor-pointer ${
                                                            issue.status === "In Progress"
                                                                ? "bg-amber-500/10 border-amber-500/20 text-amber-500 cursor-not-allowed opacity-50"
                                                                : "bg-slate-900 hover:bg-amber-500/5 border-slate-800 hover:border-amber-500/20 text-slate-400 hover:text-amber-400"
                                                        }`}
                                                        title="Set In Progress"
                                                    >
                                                        <Wrench className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleUpdateStatus(issue.id, "Resolved")}
                                                        disabled={issue.status === "Resolved"}
                                                        className={`p-2 rounded-xl text-[10px] font-black tracking-wider uppercase border transition duration-300 cursor-pointer ${
                                                            issue.status === "Resolved"
                                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 cursor-not-allowed opacity-50"
                                                                : "bg-slate-900 hover:bg-emerald-500/5 border-slate-800 hover:border-emerald-500/20 text-slate-400 hover:text-emerald-400"
                                                        }`}
                                                        title="Set Resolved"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    </button>

                                                    <div className="h-6 w-px bg-slate-900 mx-1"></div>

                                                    {/* Delete handles */}
                                                    <button
                                                        onClick={() => handleDeleteIssue(issue.id)}
                                                        className="p-2.5 bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white rounded-xl transition duration-300 cursor-pointer flex items-center justify-center shadow"
                                                        title="Purge Complaint File"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Complete dossier Details Overlay Modal */}
            {selectedIssue && (
                <ReportDetailsModal 
                    issue={selectedIssue} 
                    onClose={() => setSelectedIssue(null)} 
                />
            )}
        </Layout>
    );
}

export default Admin;