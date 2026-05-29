import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend, 
    CartesianGrid 
} from "recharts";
import { 
    Coins, 
    Activity, 
    TrendingUp, 
    Wallet, 
    Building2, 
    ArrowUpRight, 
    CheckCircle 
} from "lucide-react";

const PROJECT_DATA = [
    { name: "MG Road Phase 3", allocated: 1200000, spent: 1050000, status: "Completed", type: "Urban Road" },
    { name: "NH48 Expressway", allocated: 8500000, spent: 7900000, status: "Completed", type: "National Highway (NH)" },
    { name: "Ring Road Bypass", allocated: 4200000, spent: 4100000, status: "Completed", type: "Major District Road (MDR)" },
    { name: "Airport Corridor", allocated: 3000000, spent: 2800000, status: "Completed", type: "Urban Road" },
    { name: "Link Road Bypass", allocated: 850000, spent: 800000, status: "Completed", type: "Rural Road" },
    { name: "SH12 Flyover", allocated: 6000000, spent: 4200000, status: "Active", type: "State Highway (SH)" },
    { name: "District Pavements", allocated: 1500000, spent: 1150000, status: "Active", type: "Major District Road (MDR)" }
];

function Transparency() {
    // Calculations
    const totalAllocated = PROJECT_DATA.reduce((acc, curr) => acc + curr.allocated, 0);
    const totalSpent = PROJECT_DATA.reduce((acc, curr) => acc + curr.spent, 0);
    const remaining = totalAllocated - totalSpent;
    const activeProjectsCount = PROJECT_DATA.filter(p => p.status === "Active").length;
    const completedProjectsCount = PROJECT_DATA.filter(p => p.status === "Completed").length;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val);
    };

    const formatChartCurrency = (val) => {
        if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000) return `${(val / 100000).toFixed(1)} L`;
        return val;
    };

    // Recharts Data Sets
    const pieData = [
        { name: "Spent Budget", value: totalSpent, color: "#3b82f6" },     // Blue
        { name: "Remaining Capital", value: remaining, color: "#10b981" }   // Emerald
    ];

    const barData = PROJECT_DATA.map(p => ({
        name: p.name,
        "Budget Allocated": p.allocated,
        "Budget Spent": p.spent
    }));

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
                {/* Header */}
                <div className="mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-4"
                    >
                        <TrendingUp className="w-3.5 h-3.5" /> Fiscal Transparency Portal
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent"
                    >
                        Budget & Public Spending
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl text-base md:text-lg"
                    >
                        Live financial audit dashboard tracking municipal budget allocations, actual expenditures, and efficiency metrics on road developments.
                    </motion.p>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Total Budget Allocated */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md shadow-xl group hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 p-5 opacity-10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                            <Coins className="w-20 h-20" />
                        </div>
                        <div className="flex items-center gap-3.5 mb-5.5">
                            <div className="h-11 w-11 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-400">Total Allocated</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight">{formatCurrency(totalAllocated)}</h2>
                        <p className="text-xs text-slate-500 mt-2 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Fully approved treasury capital
                        </p>
                    </motion.div>

                    {/* Total Budget Spent */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md shadow-xl group hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 p-5 opacity-10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="w-20 h-20" />
                        </div>
                        <div className="flex items-center gap-3.5 mb-5.5">
                            <div className="h-11 w-11 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-400">Total Disbursed</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight">{formatCurrency(totalSpent)}</h2>
                        <p className="text-xs text-slate-500 mt-2 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Spent: {Math.round((totalSpent / totalAllocated) * 100)}% of initial pool
                        </p>
                    </motion.div>

                    {/* Remaining Budget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md shadow-xl group hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 p-5 opacity-10 text-sky-500 group-hover:scale-110 transition-transform duration-300">
                            <Wallet className="w-20 h-20" />
                        </div>
                        <div className="flex items-center gap-3.5 mb-5.5">
                            <div className="h-11 w-11 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center shadow-lg">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-400">Capital Balance</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight">{formatCurrency(remaining)}</h2>
                        <p className="text-xs text-slate-500 mt-2 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Reserved for upcoming scopes
                        </p>
                    </motion.div>

                    {/* Active Projects */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 relative overflow-hidden backdrop-blur-md shadow-xl group hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 p-5 opacity-10 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                            <Activity className="w-20 h-20" />
                        </div>
                        <div className="flex items-center gap-3.5 mb-5.5">
                            <div className="h-11 w-11 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-400">Active / Completed</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight">
                            {activeProjectsCount} <span className="text-slate-500 text-lg font-bold">/ {completedProjectsCount}</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-2 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Active construction contracts
                        </p>
                    </motion.div>
                </div>

                {/* Visualization Graphs */}
                <div className="grid lg:grid-cols-5 gap-8 mb-12">
                    {/* Pie Chart: aggregate budget utilization */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2 bg-slate-900/25 border border-slate-900 p-6 rounded-3xl backdrop-blur-md shadow-xl flex flex-col"
                    >
                        <h3 className="text-lg font-black text-slate-200 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" /> Budget Utilization Break
                        </h3>
                        <div className="h-72 w-full flex justify-center items-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, idx) => (
                                            <Cell key={`cell-${idx}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(val) => [formatCurrency(val), "Amount"]} 
                                        contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute flex flex-col justify-center items-center text-center">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Utilization</span>
                                <span className="text-2xl font-black text-slate-100">
                                    {Math.round((totalSpent / totalAllocated) * 100)}%
                                </span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-col gap-3 mt-4 px-2">
                            {pieData.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm font-semibold">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="font-mono text-slate-400">{formatCurrency(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bar Chart: project-wise budgeting allocation vs expenditure */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-3 bg-slate-900/25 border border-slate-900 p-6 rounded-3xl backdrop-blur-md shadow-xl"
                    >
                        <h3 className="text-lg font-black text-slate-200 mb-6 flex items-center gap-2">
                            <Coins className="w-5 h-5 text-blue-500" /> Contract Allocation vs Spent
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={barData}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#94a3b8" 
                                        fontSize={11} 
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        tickFormatter={formatChartCurrency}
                                    />
                                    <Tooltip 
                                        formatter={(val) => [formatCurrency(val), ""]}
                                        contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "12px" }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }} />
                                    <Bar dataKey="Budget Allocated" fill="#1e293b" stroke="#334155" strokeWidth={1} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Budget Spent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Audit Registry Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-slate-950/40 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-slate-900 bg-slate-950/80 flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h4 className="text-lg font-black text-slate-100">Project Expenditure Ledgers</h4>
                            <p className="text-xs text-slate-500 mt-1">Detailed transparency logs of certified government constructors.</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                            Updates live daily at 00:00 IST
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-900 bg-slate-950/45">
                                    <th className="py-4.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Project Name</th>
                                    <th className="py-4.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Sector Type</th>
                                    <th className="py-4.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Allocated Treasury</th>
                                    <th className="py-4.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Disbursed Funds</th>
                                    <th className="py-4.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PROJECT_DATA.map((proj, idx) => (
                                    <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-all duration-200">
                                        <td className="py-4.5 px-6 font-bold text-slate-200 text-sm">{proj.name}</td>
                                        <td className="py-4.5 px-6">
                                            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800/80 px-2.5 py-1 rounded-lg">
                                                {proj.type}
                                            </span>
                                        </td>
                                        <td className="py-4.5 px-6 font-semibold text-slate-300 font-mono text-xs">{formatCurrency(proj.allocated)}</td>
                                        <td className="py-4.5 px-6 font-semibold text-blue-400 font-mono text-xs">{formatCurrency(proj.spent)}</td>
                                        <td className="py-4.5 px-6">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                                                proj.status === "Active" 
                                                    ? "bg-amber-500/5 border-amber-500/20 text-amber-400 animate-pulse" 
                                                    : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${proj.status === "Active" ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                                                {proj.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}

export default Transparency;
