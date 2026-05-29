import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { Search, SlidersHorizontal, Eye, ShieldAlert, Award, Calendar, BadgeDollarSign } from "lucide-react";

const MOCK_ROAD_DATA = [
    {
        id: 1,
        roadName: "MG Road",
        roadType: "Urban Road",
        contractor: "Buildcon Infrastructures Ltd",
        lastRepairDate: "2025-10-12",
        budgetAllocated: 1200000,
        budgetSpent: 1050000,
        status: "Completed"
    },
    {
        id: 2,
        roadName: "NH48 Expressway",
        roadType: "National Highway (NH)",
        contractor: "NHAI / Apex InfraCorp",
        lastRepairDate: "2026-02-20",
        budgetAllocated: 8500000,
        budgetSpent: 7900000,
        status: "Completed"
    },
    {
        id: 3,
        roadName: "Ring Road bypass",
        roadType: "Major District Road (MDR)",
        contractor: "Skyline Highways & Co",
        lastRepairDate: "2025-08-15",
        budgetAllocated: 4200000,
        budgetSpent: 4100000,
        status: "Completed"
    },
    {
        id: 4,
        roadName: "Airport VIP Road",
        roadType: "Urban Road",
        contractor: "Adani Infra Projects Ltd",
        lastRepairDate: "2026-04-05",
        budgetAllocated: 3000000,
        budgetSpent: 2800000,
        status: "Completed"
    },
    {
        id: 5,
        roadName: "Link Road Extension",
        roadType: "Rural Road",
        contractor: "Gramin Road Builders Corp",
        lastRepairDate: "2025-12-01",
        budgetAllocated: 8500000,
        budgetSpent: 8000000,
        status: "Completed"
    }
];

function RoadInfo() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRoadType, setSelectedRoadType] = useState("All");

    const roadTypes = ["All", "National Highway (NH)", "State Highway (SH)", "Major District Road (MDR)", "Urban Road", "Rural Road"];

    const filteredRoads = MOCK_ROAD_DATA.filter((road) => {
        const matchesSearch = 
            road.roadName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            road.contractor.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = selectedRoadType === "All" || road.roadType === selectedRoadType;

        return matchesSearch && matchesType;
    });

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
                {/* Header */}
                <div className="mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-4"
                    >
                        <ShieldAlert className="w-3.5 h-3.5" /> Civic Accountability Database
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent"
                    >
                        Road Registry & Auditing
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl text-base md:text-lg"
                    >
                        Monitor cataloged municipal and highway routes. Track government budget allocations, contractor responsibilities, and maintenance logs.
                    </motion.p>
                </div>

                {/* Filter and Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid md:grid-cols-3 gap-4 mb-8 bg-slate-900/40 p-5 rounded-3xl border border-slate-900 backdrop-blur-md shadow-2xl"
                >
                    {/* Search */}
                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500">
                            <Search className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by road name, contractor, agency..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl py-4.5 pl-12 pr-5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500">
                            <SlidersHorizontal className="w-4 h-4" />
                        </span>
                        <select
                            value={selectedRoadType}
                            onChange={(e) => setSelectedRoadType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl py-4.5 pl-11 pr-5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer shadow-inner"
                        >
                            {roadTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type === "All" ? "All Road Types" : type}
                                </option>
                            ))}
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                </motion.div>

                {/* Road Database Table */}
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
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Road Details</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Road Type</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Contractor / Firm</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Last Maintenance</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-400 tracking-wider uppercase">Finances (Allocated / Spent)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRoads.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-16 text-center text-slate-500 font-semibold text-lg">
                                            No matching road entries found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRoads.map((road, index) => {
                                        const remaining = road.budgetAllocated - road.budgetSpent;
                                        const spendPercentage = Math.round((road.budgetSpent / road.budgetAllocated) * 100);

                                        return (
                                            <motion.tr 
                                                key={road.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="border-b border-slate-900/60 hover:bg-slate-900/25 transition-colors duration-200 group"
                                            >
                                                {/* Road Details */}
                                                <td className="py-6 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:bg-blue-500/5 group-hover:border-blue-500/20 transition-all duration-300">
                                                            <Award className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors duration-200 text-base">{road.roadName}</div>
                                                            <div className="text-xs text-slate-500 font-mono">RID: #{road.id}09A4{road.id}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Road Type */}
                                                <td className="py-6 px-6">
                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border bg-blue-500/5 border-blue-500/20 text-blue-400 shadow-[0_2px_8px_rgba(59,130,246,0.05)]">
                                                        {road.roadType}
                                                    </span>
                                                </td>

                                                {/* Contractor */}
                                                <td className="py-6 px-6">
                                                    <div className="text-sm font-semibold text-slate-200">{road.contractor}</div>
                                                    <div className="text-xs text-slate-500">Government Certified PWD</div>
                                                </td>

                                                {/* Last Repair Date */}
                                                <td className="py-6 px-6">
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <Calendar className="w-4 h-4 text-slate-500" />
                                                        {new Date(road.lastRepairDate).toLocaleDateString("en-US", {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </td>

                                                {/* Finances */}
                                                <td className="py-6 px-6">
                                                    <div className="flex flex-col gap-1.5 w-60">
                                                        <div className="flex justify-between text-xs font-bold">
                                                            <span className="text-slate-400">Spent: {formatCurrency(road.budgetSpent)}</span>
                                                            <span className="text-blue-400">{spendPercentage}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden shadow-inner">
                                                            <div 
                                                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" 
                                                                style={{ width: `${spendPercentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="flex justify-between text-[11px] text-slate-500 font-semibold font-mono">
                                                            <span>Alloc: {formatCurrency(road.budgetAllocated)}</span>
                                                            <span>Rem: {formatCurrency(remaining)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}

export default RoadInfo;
