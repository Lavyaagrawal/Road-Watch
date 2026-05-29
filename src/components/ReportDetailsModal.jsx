import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, MapPin, ShieldAlert, BadgeInfo, ExternalLink } from "lucide-react";

function ReportDetailsModal({ issue, onClose }) {
    // Prevent background scrolling while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        
        // Escape key close handler
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    if (!issue) return null;

    const statusColors = {
        Pending: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
        "In Progress": "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
        Resolved: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    };

    const authorityColors = {
        "Municipal Corporation": "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
        "Public Works Department": "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
        "Traffic Police": "bg-amber-500/10 border-amber-500/20 text-amber-400",
        "Road Maintenance Department": "bg-sky-500/10 border-sky-500/20 text-sky-400",
    };

    const formattedDate = new Date(issue.createdAt).toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop blur overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 grid md:grid-cols-2 max-h-[90vh] md:max-h-[85vh]"
                >
                    {/* Visual Media Section */}
                    <div className="relative h-64 md:h-full bg-slate-950 border-r border-slate-800/50 flex items-center justify-center group">
                        <img
                            src={issue.imageUrl}
                            alt={issue.type}
                            className="w-full h-full object-cover md:absolute inset-0 select-none"
                        />
                        {/* Status Float Badge */}
                        <div className="absolute top-5 left-5 z-10">
                            <span className={`px-4.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border backdrop-blur-md ${statusColors[issue.status]}`}>
                                {issue.status}
                            </span>
                        </div>
                    </div>

                    {/* Metadata Detail Section */}
                    <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
                        <div>
                            {/* Title & Close Button */}
                            <div className="flex justify-between items-start gap-4 mb-6">
                                <div>
                                    <div className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                                        <BadgeInfo className="w-3.5 h-3.5 text-blue-500" /> CIVIC COMPLAINT REGISTRY
                                    </div>
                                    <h2 className="text-3xl font-black text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                                        {issue.type}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition duration-300 shadow-md cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Badges Layout */}
                            <div className="flex flex-wrap gap-2.5 mb-6">
                                {/* Road Type */}
                                <span className="px-3 py-1 bg-blue-500/5 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg shadow-sm">
                                    {issue.roadType || "Urban Road"}
                                </span>
                                {/* Authority Badge */}
                                <span className={`px-3 py-1 border text-xs font-bold rounded-lg shadow-sm ${authorityColors[issue.authority || "Municipal Corporation"]}`}>
                                    {issue.authority || "Municipal Corporation"}
                                </span>
                            </div>

                            {/* Description Section */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Detailed Scope Description</h4>
                                <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/40 border border-slate-800/60 p-4 rounded-2xl shadow-inner font-medium">
                                    {issue.description}
                                </p>
                            </div>

                            {/* Properties Sheet */}
                            <div className="space-y-4 mb-6">
                                {/* Reporter */}
                                <div className="flex items-center gap-4.5 text-slate-300 bg-slate-950/20 px-4 py-3 rounded-xl border border-slate-900">
                                    <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500">
                                        <User className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reported By Citizen</div>
                                        <div className="text-xs sm:text-sm font-semibold text-blue-400">{issue.userEmail}</div>
                                    </div>
                                </div>

                                {/* Timestamp */}
                                <div className="flex items-center gap-4.5 text-slate-300 bg-slate-950/20 px-4 py-3 rounded-xl border border-slate-900">
                                    <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500">
                                        <Calendar className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Registration Date</div>
                                        <div className="text-xs sm:text-sm font-semibold">{formattedDate}</div>
                                    </div>
                                </div>

                                {/* GPS Coordinates */}
                                <div className="flex items-center justify-between text-slate-300 bg-slate-950/20 px-4 py-3 rounded-xl border border-slate-900">
                                    <div className="flex items-center gap-4.5">
                                        <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500">
                                            <MapPin className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">GPS Coordinates</div>
                                            <div className="text-xs sm:text-sm font-semibold font-mono">
                                                {Number(issue.latitude).toFixed(6)}, {Number(issue.longitude).toFixed(6)}
                                            </div>
                                        </div>
                                    </div>
                                    {issue.latitude && issue.longitude && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition duration-300 cursor-pointer shadow-md"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Closing Action */}
                        <div className="border-t border-slate-800/80 pt-5 flex justify-end">
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-6 py-3 rounded-xl border border-slate-700/50 shadow-md cursor-pointer transition active:scale-98 text-sm"
                            >
                                Close Complaint File
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default ReportDetailsModal;
