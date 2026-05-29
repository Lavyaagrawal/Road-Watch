import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Layout from "../components/Layout";
import { getIssues } from "../services/localIssueService";
import { MapPin, ShieldAlert, SlidersHorizontal, Layers } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix standard Leaflet icon assets missing in Vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function MapPage() {
    const [issues, setIssues] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const fetchIssues = async () => {
            const data = await getIssues();
            setIssues(data);
        };
        fetchIssues();
    }, []);

    // Filtered reports
    const filteredIssues = issues.filter(issue => {
        if (statusFilter === "All") return true;
        return issue.status === statusFilter;
    });

    // Custom circular leaflet div-icons based on status
    const getMarkerIcon = (status) => {
        let color = "#ef4444"; // Red for Pending
        let glowColor = "rgba(239, 68, 68, 0.4)";
        if (status === "In Progress") {
            color = "#f59e0b"; // Amber for In Progress
            glowColor = "rgba(245, 158, 11, 0.4)";
        } else if (status === "Resolved") {
            color = "#10b981"; // Emerald for Resolved
            glowColor = "rgba(16, 185, 129, 0.4)";
        }

        return L.divIcon({
            className: "status-marker-wrapper",
            html: `<div class="status-marker" style="
                background-color: ${color}; 
                width: 18px; 
                height: 18px; 
                border-radius: 50%; 
                border: 3px solid #ffffff; 
                box-shadow: 0 0 12px ${glowColor}; 
                cursor: pointer;
            "></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
            popupAnchor: [0, -9]
        });
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
            <div className="h-[calc(100vh-80px)] relative flex flex-col lg:flex-row overflow-hidden bg-slate-950">
                {/* Control Panel Sidebar */}
                <div className="w-full lg:w-96 bg-slate-950/80 border-b lg:border-b-0 lg:border-r border-slate-900/80 backdrop-blur-xl p-6 flex flex-col gap-6 z-10 shrink-0 shadow-2xl">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold tracking-wider uppercase mb-3">
                            <MapPin className="w-3.5 h-3.5" /> Geo-Spatial Map
                        </div>
                        <h1 className="text-2xl font-black text-white">Live Complaint Map</h1>
                        <p className="text-xs text-slate-400 mt-1">Visualize and monitor reported issues across municipal sectors.</p>
                    </div>

                    <div className="h-px bg-slate-900/60"></div>

                    {/* Filter Widget */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter by Resolution Status
                        </label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {["All", "Pending", "In Progress", "Resolved"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all duration-300 ${
                                        statusFilter === status
                                            ? "bg-blue-600/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                                            : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-900/60"></div>

                    {/* Quick Stats Panel */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" /> Map Key & Distribution
                        </span>
                        <div className="space-y-2 bg-slate-900/20 p-4 border border-slate-900 rounded-2xl">
                            <div className="flex justify-between items-center text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-white"></div>
                                    <span className="text-slate-400">Pending</span>
                                </div>
                                <span className="font-mono text-slate-200">{issues.filter(i => i.status === "Pending").length}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-white"></div>
                                    <span className="text-slate-400">In Progress</span>
                                </div>
                                <span className="font-mono text-slate-200">{issues.filter(i => i.status === "In Progress").length}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-white"></div>
                                    <span className="text-slate-400">Resolved</span>
                                </div>
                                <span className="font-mono text-slate-200">{issues.filter(i => i.status === "Resolved").length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Responsive Mobile Layout Hint */}
                    <div className="hidden lg:block mt-auto bg-blue-500/5 border border-blue-500/10 p-4.5 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                                Left-click any colored circular marker on the map interface to summon the official issue dossier including pictures and assigned civic departments.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Leaflet Map Section */}
                <div className="grow h-full w-full relative z-0">
                    <MapContainer
                        center={[18.5204, 73.8567]}
                        zoom={13}
                        zoomControl={true}
                        className="h-full w-full"
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {filteredIssues.map((issue) => {
                            if (issue.latitude === undefined || issue.latitude === null ||
                                issue.longitude === undefined || issue.longitude === null) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={issue.id}
                                    position={[issue.latitude, issue.longitude]}
                                    icon={getMarkerIcon(issue.status)}
                                >
                                    <Popup className="premium-leaflet-popup">
                                        <div className="w-60 bg-slate-950 p-0 text-white font-sans">
                                            {/* Popup Issue Image */}
                                            <img
                                                src={issue.imageUrl}
                                                alt={issue.type}
                                                className="w-full h-32 object-cover rounded-xl border border-slate-800 shadow-inner mb-3 select-none"
                                            />

                                            {/* Type */}
                                            <h3 className="text-base font-black text-slate-100 flex justify-between items-center mb-2.5">
                                                {issue.type}
                                            </h3>

                                            <div className="flex flex-col gap-2">
                                                {/* Assigned Authority */}
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Assigned Authority</span>
                                                    <span className={`inline-block text-[10px] font-bold border px-2 py-0.5 rounded-lg w-max mt-0.5 ${authorityBadgeColors[issue.authority || "Municipal Corporation"]}`}>
                                                        {issue.authority || "Municipal Corporation"}
                                                    </span>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="flex flex-col mt-1">
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Resolution Status</span>
                                                    <span className={`inline-block text-[10px] font-black border px-2 py-0.5 rounded-lg w-max mt-0.5 uppercase ${statusBadgeColors[issue.status]}`}>
                                                        {issue.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description snippet */}
                                            <p className="text-[11px] text-slate-400 mt-3.5 border-t border-slate-900 pt-2 line-clamp-2 leading-relaxed">
                                                {issue.description}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </Layout>
    );
}

export default MapPage;