import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";

import {
    db,
    auth,
    ADMIN_EMAIL
} from "../firebase/config";
import {

    getIssues,

    updateIssueStatus,

    deleteIssue

} from "../services/localIssueService";
function Admin() {

    const [issues, setIssues] = useState([]);

    const user = auth.currentUser;

    useEffect(() => {

        fetchIssues();

    }, []);

    const fetchIssues = async () => {
        const data = await getIssues();
        setIssues(data);
    };

    // UPDATE STATUS
    const updateStatus = async (id, status) => {
        try {
            await updateIssueStatus(id, status);
            await fetchIssues();
        } catch (error) {
            console.error(error);
        }
    };

    // DELETE ISSUE
    const handleDeleteIssue = async (id) => {
        try {
            await deleteIssue(id);
            await fetchIssues();
        } catch (error) {
            console.error(error);
        }
    };

    // NOT ADMIN
    if (
        !user ||
        user.email !== ADMIN_EMAIL
    ) {

        return (

            <Layout>

                <div className="
          min-h-screen
          flex
          items-center
          justify-center
          text-3xl
          font-bold
        ">

                    Access Denied

                </div>

            </Layout>

        );

    }

    return (

        <Layout>

            <div className="
        max-w-7xl
        mx-auto
        px-6
        py-20
      ">

                <h1 className="
          text-5xl
          font-black
          mb-14
        ">
                    Admin Dashboard
                </h1>

                <div className="
          grid
          gap-8
        ">

                    {issues.map(issue => (

                        <div
                            key={issue.id}
                            className="
                bg-slate-900
                border
                border-slate-800
                rounded-3xl
                overflow-hidden
                grid
                md:grid-cols-3
              "
                        >

                            {/* IMAGE */}
                            <img
                                src={issue.imageUrl}
                                alt=""
                                className="
                  h-full
                  w-full
                  object-cover
                "
                            />

                            {/* INFO */}
                            <div className="
                p-6
                md:col-span-2
              ">

                                <div className="
                  flex
                  justify-between
                  items-center
                  mb-4
                ">

                                    <h2 className="
                    text-3xl
                    font-black
                    text-blue-500
                  ">
                                        {issue.type}
                                    </h2>

                                    <div className="
                    bg-slate-800
                    px-4
                    py-2
                    rounded-xl
                  ">
                                        {issue.status}
                                    </div>

                                </div>

                                <p className="
                  text-slate-300
                  mb-6
                ">
                                    {issue.description}
                                </p>

                                <div className="
                   text-sm
                   text-slate-500
                   mb-8
                   flex
                   flex-col
                   gap-2
                 ">

                                    <div>
                                        Reported by:
                                        {" "}
                                        <span className="text-blue-400 font-semibold">{issue.userEmail}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-400">
                                        <span>Coordinates:</span>
                                        <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                                            {issue.latitude !== undefined && issue.latitude !== null ? Number(issue.latitude).toFixed(6) : "N/A"}, {issue.longitude !== undefined && issue.longitude !== null ? Number(issue.longitude).toFixed(6) : "N/A"}
                                        </span>
                                    </div>

                                </div>

                                {/* ACTIONS */}
                                <div className="
                  flex
                  flex-wrap
                  gap-4
                ">

                                    {issue.latitude !== undefined && issue.latitude !== null && issue.longitude !== undefined && issue.longitude !== null && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                          bg-slate-800
                          hover:bg-slate-700
                          text-blue-400
                          hover:text-blue-300
                          border
                          border-slate-700
                          px-5
                          py-3
                          rounded-2xl
                          font-semibold
                          flex
                          items-center
                          gap-2
                          transition
                        "
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            Open in Maps
                                        </a>
                                    )}

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                issue.id,
                                                "Pending"
                                            )
                                        }
                                        className="
                      bg-yellow-500
                      px-5
                      py-3
                      rounded-2xl
                      font-semibold
                    "
                                    >
                                        Pending
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                issue.id,
                                                "In Progress"
                                            )
                                        }
                                        className="
                      bg-blue-500
                      px-5
                      py-3
                      rounded-2xl
                      font-semibold
                    "
                                    >
                                        In Progress
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                issue.id,
                                                "Resolved"
                                            )
                                        }
                                        className="
                      bg-green-500
                      px-5
                      py-3
                      rounded-2xl
                      font-semibold
                    "
                                    >
                                        Resolved
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteIssue(issue.id)
                                        }
                                        className="
                      bg-red-500
                      px-5
                      py-3
                      rounded-2xl
                      font-semibold
                    "
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </Layout>

    );
}

export default Admin;