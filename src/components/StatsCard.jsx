function StatsCard({ title, value, icon }) {
    return (
        <div className="bg-slate-900/40 border border-slate-900/80 rounded-3xl p-7.5 shadow-xl hover:scale-[1.015] hover:border-slate-850 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden backdrop-blur-md group">
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                    {title}
                </h3>
                {icon && (
                    <div className="h-10 w-10 bg-slate-950 border border-slate-850 text-blue-400 rounded-xl flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition duration-300">
                        {icon}
                    </div>
                )}
            </div>

            <p className="text-5xl font-black tracking-tight text-blue-500 group-hover:text-blue-400 transition-colors">
                {value !== undefined ? value : 0}
            </p>
        </div>
    );
}

export default StatsCard;