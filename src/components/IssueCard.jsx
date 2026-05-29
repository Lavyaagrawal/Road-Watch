import { Calendar, MapPin, ExternalLink, ShieldAlert, Award } from "lucide-react";

function IssueCard({ issue, onViewDetails }) {
    const statusColors = {
        Pending: "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.05)]",
        "In Progress": "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
        Resolved: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
    };

    const authorityColors = {
        "Municipal Corporation": "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
        "Public Works Department": "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
        "Traffic Police": "bg-amber-500/10 border-amber-500/20 text-amber-400",
        "Road Maintenance Department": "bg-sky-500/10 border-sky-500/20 text-sky-400",
    };

    const dateFormatted = new Date(issue.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const handleClick = (e) => {
        // Prevent click trigger if map link was clicked
        if (e.target.closest("a")) return;
        if (onViewDetails) onViewDetails(issue);
    };

    return (
        <div 
            onClick={handleClick}
            className={`
                bg-slate-900/40 border border-slate-900/80 rounded-3xl overflow-hidden shadow-xl 
                hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-slate-800/80 hover:scale-[1.015]
                transition-all duration-300 flex flex-col justify-between group h-full
                ${onViewDetails ? "cursor-pointer" : ""}
            `}
        >
            {/* Visual Header */}
            <div className="relative h-56 bg-slate-950 overflow-hidden select-none shrink-0 border-b border-slate-900/50">
                <img
                    src={issue.imageUrl}
                    alt={issue.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Floating Status Badge */}
                <div className="absolute top-4.5 left-4.5 z-10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border backdrop-blur-md ${statusColors[issue.status]}`}>
                        {issue.status}
                    </span>
                </div>
                {/* Floating Road Type Badge */}
                <div className="absolute top-4.5 right-4.5 z-10">
                    <span className="px-3 py-1 bg-slate-950/80 text-blue-400 border border-slate-800/85 text-[10px] font-bold rounded-full backdrop-blur-md shadow-sm">
                        {issue.roadType || "Urban Road"}
                    </span>
                </div>
            </div>

            {/* Information Body */}
            <div className="p-6 flex flex-col grow justify-between">
                <div>
                    {/* Header Row */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <h2 className="text-xl font-black text-slate-100 group-hover:text-blue-400 transition-colors duration-300">
                            {issue.type}
                        </h2>
                    </div>

                    {/* Automatically resolve authority labels with colored badges */}
                    <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Assigned Authority</span>
                        <span className={`inline-block text-[10.5px] font-bold border px-2.5 py-0.5 rounded-lg w-max mt-0.5 ${authorityColors[issue.authority || "Municipal Corporation"]}`}>
                            {issue.authority || "Municipal Corporation"}
                        </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                        {issue.description}
                    </p>
                </div>

                {/* Audit details metadata */}
                <div className="border-t border-slate-900/80 pt-4.5 flex flex-col gap-3 text-xs text-slate-400">
                    {/* Reporter Info */}
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-500">Citizen Reporter:</span>
                        <span className="font-mono text-slate-300 bg-slate-950/40 border border-slate-900/60 px-2 py-0.5 rounded">
                            {issue.userEmail}
                        </span>
                    </div>

                    {/* Geo Coordinates & Map Action */}
                    <div className="flex justify-between items-center text-[11px] flex-wrap gap-2">
                        <span className="font-semibold text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-600" /> Lat/Lng:
                            <span className="font-mono text-slate-300">
                                {issue.latitude !== undefined && issue.latitude !== null ? Number(issue.latitude).toFixed(4) : "N/A"}, {issue.longitude !== undefined && issue.longitude !== null ? Number(issue.longitude).toFixed(4) : "N/A"}
                            </span>
                        </span>
                        {issue.latitude !== undefined && issue.latitude !== null && issue.longitude !== undefined && issue.longitude !== null && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold transition-all flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/20 shadow-sm"
                            >
                                <ExternalLink className="w-3 h-3" /> Map Link
                            </a>
                        )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1.5 border-t border-slate-900/30">
                        <span className="font-bold uppercase tracking-wider">Lodged Date</span>
                        <span className="font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {dateFormatted}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueCard;