function IssueCard({ issue }) {

    const statusColor = {

        Pending: "bg-yellow-500",

        "In Progress": "bg-blue-500",

        Resolved: "bg-green-500",

    };

    return (

        <div className="
      bg-slate-900
      border
      border-slate-800
      rounded-3xl
      overflow-hidden
      shadow-2xl
      hover:scale-[1.02]
      transition
      duration-300
    ">

            {/* IMAGE */}
            <img
                src={issue.imageUrl}
                alt=""
                className="
          w-full
          h-56
          object-cover
        "
            />

            <div className="p-6">

                {/* TOP ROW */}
                <div className="
          flex
          justify-between
          items-center
          mb-4
        ">

                    <h2 className="
            text-2xl
            font-black
            text-blue-500
          ">
                        {issue.type}
                    </h2>

                    <div className={`
            px-4
            py-1
            rounded-full
            text-sm
            font-semibold
            text-white
            ${statusColor[issue.status]}
          `}>

                        {issue.status}

                    </div>

                </div>

                {/* DESCRIPTION */}
                <p className="
          text-slate-300
          leading-relaxed
          mb-5
        ">

                    {issue.description}

                </p>

                {/* USER INFO */}
                <div className="
          border-t
          border-slate-800
          pt-4
          flex
          flex-col
          gap-3
          text-sm
          text-slate-400
        ">

                    <p>
                        Reported by:
                        {" "}
                        <span className="text-blue-400">
                            {issue.userEmail}
                        </span>
                    </p>

                    <p className="flex justify-between items-center flex-wrap gap-2">
                        <span>
                            Coordinates:{" "}
                            <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                                {issue.latitude !== undefined && issue.latitude !== null ? Number(issue.latitude).toFixed(4) : "N/A"}, {issue.longitude !== undefined && issue.longitude !== null ? Number(issue.longitude).toFixed(4) : "N/A"}
                            </span>
                        </span>
                        {issue.latitude !== undefined && issue.latitude !== null && issue.longitude !== undefined && issue.longitude !== null && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 font-bold transition flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/20"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                                Google Maps
                            </a>
                        )}
                    </p>

                    <p>
                        Status:
                        {" "}
                        <span className="text-white">
                            {issue.status}
                        </span>
                    </p>

                </div>

            </div>

        </div>

    );
}

export default IssueCard;