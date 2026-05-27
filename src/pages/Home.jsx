import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import StatsCard from "../components/StatsCard";

import IssueCard from "../components/IssueCard";

import { getIssues } from "../services/localIssueService";

function Home() {

    const [issues, setIssues] = useState([]);

    useEffect(() => {

        const fetchIssues = async () => {

            const data = await getIssues();

            setIssues(data);

        };

        fetchIssues();

    }, []);

    return (

        <Layout>

            <div className="
        max-w-7xl
        mx-auto
        px-6
        py-20
      ">

                {/* HERO SECTION */}
                <div className="
          text-center
          mb-20
        ">

                    <div className="
            inline-block
            px-5
            py-2
            rounded-full
            bg-blue-500/10
            text-blue-400
            mb-6
          ">

                        Smart Civic Infrastructure

                    </div>

                    <h1 className="
            text-6xl
            md:text-7xl
            font-black
            mb-6
            leading-tight
          ">

                        Smarter Roads.
                        <br />

                        <span className="text-blue-500">
                            Safer Cities.
                        </span>

                    </h1>

                    <p className="
            text-slate-400
            text-xl
            max-w-3xl
            mx-auto
            mb-10
            leading-relaxed
          ">

                        Report potholes, broken roads,
                        waterlogging and dangerous
                        infrastructure issues in real-time.

                    </p>

                    <div className="
            flex
            flex-col
            md:flex-row
            justify-center
            gap-5
          ">

                        <Link
                            to="/report"
                            className="
                bg-blue-600
                hover:bg-blue-700
                transition
                px-8
                py-5
                rounded-2xl
                font-semibold
                text-lg
              "
                        >
                            Report Issue
                        </Link>

                        <Link
                            to="/map"
                            className="
                bg-slate-800
                hover:bg-slate-700
                transition
                px-8
                py-5
                rounded-2xl
                font-semibold
                text-lg
              "
                        >
                            View Live Map
                        </Link>

                    </div>

                </div>

                {/* STATS */}
                <div className="
          grid
          md:grid-cols-3
          gap-6
          mb-20
        ">

                    <StatsCard
                        title="Total Reports"
                        value={issues.length}
                    />

                    <StatsCard
                        title="Pending Issues"
                        value={
                            issues.filter(
                                issue => issue.status === "Pending"
                            ).length
                        }
                    />

                    <StatsCard
                        title="Resolved Issues"
                        value={
                            issues.filter(
                                issue => issue.status === "Resolved"
                            ).length
                        }
                    />

                </div>

                {/* COMMUNITY FEED */}
                <div>

                    <div className="
            flex
            justify-between
            items-center
            mb-10
          ">

                        <h2 className="
              text-4xl
              font-black
            ">
                            Community Feed
                        </h2>

                    </div>

                    <div className="
            grid
            md:grid-cols-3
            gap-8
          ">

                        {issues.length === 0 ? (

                            <div className="
                col-span-3
                text-center
                py-20
                text-slate-500
                text-2xl
              ">

                                No reports yet.

                            </div>

                        ) : (

                            issues.map(issue => (

                                <IssueCard
                                    key={issue.id}
                                    issue={issue}
                                />

                            ))

                        )}

                    </div>

                </div>

            </div>

        </Layout>

    );
}

export default Home;