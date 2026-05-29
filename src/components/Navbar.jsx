import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../firebase/config";
import { 
    Menu, 
    X, 
    Home, 
    PlusCircle, 
    Map, 
    FileSpreadsheet, 
    PieChart, 
    LayoutDashboard, 
    Shield, 
    LogOut, 
    LogIn, 
    UserPlus 
} from "lucide-react";

function Navbar() {
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Track authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Close mobile menu on path changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClasses = (path) => `
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
        ${isActive(path) 
            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
            : "text-slate-300 hover:text-white hover:bg-slate-900/50 border border-transparent"}
    `;

    const mobileNavLinkClasses = (path) => `
        flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300
        ${isActive(path) 
            ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
            : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent"}
    `;

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-900/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                {/* Brand Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2.5 hover:opacity-90 transition-all duration-300 group"
                >
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-blue-500 bg-clip-text text-transparent">
                        RoadWatch
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-2">
                    <Link to="/" className={navLinkClasses("/")}>
                        <Home className="w-4 h-4" /> Home
                    </Link>
                    <Link to="/report" className={navLinkClasses("/report")}>
                        <PlusCircle className="w-4 h-4" /> Report Issue
                    </Link>
                    <Link to="/map" className={navLinkClasses("/map")}>
                        <Map className="w-4 h-4" /> Live Map
                    </Link>
                    <Link to="/road-info" className={navLinkClasses("/road-info")}>
                        <FileSpreadsheet className="w-4 h-4" /> Road Info
                    </Link>
                    <Link to="/transparency" className={navLinkClasses("/transparency")}>
                        <PieChart className="w-4 h-4" /> Budget Transparency
                    </Link>

                    {user && (
                        <Link to="/dashboard" className={navLinkClasses("/dashboard")}>
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                    )}

                    {user?.email === ADMIN_EMAIL && (
                        <Link to="/admin" className={navLinkClasses("/admin")}>
                            <Shield className="w-4 h-4 text-amber-500" /> Admin
                        </Link>
                    )}
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono px-3 py-1.5 rounded-xl shadow-inner">
                                {user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl border border-red-500/10 shadow-[0_4px_15px_rgba(239,68,68,0.2)] hover:shadow-[0_4px_20px_rgba(239,68,68,0.4)] transition-all duration-300 cursor-pointer active:scale-95"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="flex items-center gap-2 border border-slate-800 bg-slate-900 hover:bg-slate-800/80 text-slate-200 text-sm font-semibold px-4.5 py-2.5 rounded-xl transition duration-300"
                            >
                                <LogIn className="w-4 h-4 text-blue-500" /> Login
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold px-4.5 py-2.5 rounded-xl border border-blue-500/20 shadow-[0_4px_15px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all duration-300 cursor-pointer active:scale-95"
                            >
                                <UserPlus className="w-4 h-4" /> Signup
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 border border-slate-900 transition-colors duration-300"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-900 bg-slate-950/95 backdrop-blur-xl px-6 py-6 absolute top-20 left-0 w-full shadow-[0_20px_30px_rgba(0,0,0,0.85)] z-50 flex flex-col gap-2">
                    <Link to="/" className={mobileNavLinkClasses("/")}>
                        <Home className="w-5 h-5 text-blue-400" /> Home
                    </Link>
                    <Link to="/report" className={mobileNavLinkClasses("/report")}>
                        <PlusCircle className="w-5 h-5 text-blue-400" /> Report Issue
                    </Link>
                    <Link to="/map" className={mobileNavLinkClasses("/map")}>
                        <Map className="w-5 h-5 text-blue-400" /> Live Map
                    </Link>
                    <Link to="/road-info" className={mobileNavLinkClasses("/road-info")}>
                        <FileSpreadsheet className="w-5 h-5 text-blue-400" /> Road Info
                    </Link>
                    <Link to="/transparency" className={mobileNavLinkClasses("/transparency")}>
                        <PieChart className="w-5 h-5 text-blue-400" /> Budget Transparency
                    </Link>

                    {user && (
                        <Link to="/dashboard" className={mobileNavLinkClasses("/dashboard")}>
                            <LayoutDashboard className="w-5 h-5 text-blue-400" /> Dashboard
                        </Link>
                    )}

                    {user?.email === ADMIN_EMAIL && (
                        <Link to="/admin" className={mobileNavLinkClasses("/admin")}>
                            <Shield className="w-5 h-5 text-amber-500" /> Admin Control Room
                        </Link>
                    )}

                    <div className="h-px bg-slate-900 my-4"></div>

                    {user ? (
                        <div className="flex flex-col gap-4">
                            <div className="text-sm bg-slate-900 text-slate-400 font-mono px-4 py-3 rounded-xl border border-slate-800 text-center shadow-inner">
                                {user.email}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 rounded-xl border border-red-500/10 shadow-[0_4px_15px_rgba(239,68,68,0.2)] active:scale-98 transition duration-300 cursor-pointer"
                            >
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold py-3.5 rounded-xl text-center transition"
                            >
                                <LogIn className="w-4 h-4 text-blue-500" /> Login
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 rounded-xl text-center shadow-[0_4px_15px_rgba(37,99,235,0.2)] transition active:scale-98"
                            >
                                <UserPlus className="w-4 h-4" /> Signup
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;