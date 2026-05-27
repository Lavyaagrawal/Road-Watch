import { useEffect, useState } from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import { auth } from "../firebase/config";

function Navbar() {

    const [user, setUser] = useState(null);

    const location = useLocation();

    const navigate = useNavigate();

    // TRACK LOGIN STATE
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {

                setUser(currentUser);

            }
        );

        return () => unsubscribe();

    }, []);

    // ACTIVE LINK STYLE
    const navLink = (path) =>

        location.pathname === path

            ? "text-blue-500 font-semibold"

            : "text-slate-300 hover:text-white transition";

    // LOGOUT
    const handleLogout = async () => {

        try {

            await signOut(auth);

            navigate("/login");

        } catch (error) {

            console.error("Logout Error:", error);

        }

    };

    return (

        <nav className="
      sticky
      top-0
      z-50
      backdrop-blur-xl
      bg-slate-950/80
      border-b
      border-slate-800
    ">

            <div className="
        max-w-7xl
        mx-auto
        px-6
        py-5
        flex
        justify-between
        items-center
      ">

                {/* LOGO */}
                <Link
                    to="/"
                    className="
            text-3xl
            font-black
            text-blue-500
            hover:opacity-90
            transition
          "
                >
                    RoadWatch
                </Link>

                {/* NAVIGATION */}
                <div className="
          flex
          gap-8
          items-center
          text-lg
        ">

                    {/* HOME */}
                    <Link
                        className={navLink("/")}
                        to="/"
                    >
                        Home
                    </Link>

                    {/* REPORT */}
                    <Link
                        className={navLink("/report")}
                        to="/report"
                    >
                        Report
                    </Link>

                    {/* MAP */}
                    <Link
                        className={navLink("/map")}
                        to="/map"
                    >
                        Map
                    </Link>

                    {/* USER LOGGED IN */}
                    {user ? (

                        <>

                            {/* DASHBOARD */}
                            <Link
                                className={navLink("/dashboard")}
                                to="/dashboard"
                            >
                                Dashboard
                            </Link>

                            {/* ADMIN LINK */}
                            {user?.email ===
                                "lavyaagrawal123@gmail.com" && (

                                    <Link
                                        className={navLink("/admin")}
                                        to="/admin"
                                    >
                                        Admin
                                    </Link>

                                )}

                            {/* USER EMAIL */}
                            <div className="
                hidden
                md:flex
                bg-slate-800
                px-4
                py-2
                rounded-xl
                text-sm
                text-slate-300
              ">

                                {user.email}

                            </div>

                            {/* LOGOUT */}
                            <button
                                onClick={handleLogout}
                                className="
                  bg-red-500
                  hover:bg-red-600
                  transition
                  text-white
                  px-5
                  py-2
                  rounded-xl
                  font-semibold
                "
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>
                            {/* LOGIN */}
                            <Link
                                className={navLink("/login")}
                                to="/login"
                            >
                                Login
                            </Link>

                            {/* SIGNUP */}
                            <Link
                                to="/signup"
                                className="
                  bg-blue-600
                  hover:bg-blue-700
                  transition
                  text-white
                  px-5
                  py-2
                  rounded-xl
                  font-semibold
                "
                            >
                                Signup
                            </Link>
                        </>

                    )}

                </div>

            </div>

        </nav>

    );

}

export default Navbar;