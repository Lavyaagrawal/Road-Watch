function StatsCard({ title, value }) {

    return (

        <div className="
      bg-slate-900
      border
      border-slate-800
      rounded-3xl
      p-8
      shadow-xl
      hover:scale-[1.02]
      transition
    ">

            <h2 className="
        text-slate-400
        text-lg
        mb-3
      ">
                {title}
            </h2>

            <p className="
        text-5xl
        font-black
        text-blue-500
      ">
                {value}
            </p>

        </div>

    );
}

export default StatsCard;