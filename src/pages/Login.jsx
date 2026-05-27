import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/dashboard");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return alert("Please fill in all fields");
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            // Translate common firebase errors for better user experience
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                alert("Invalid email or password.");
            } else {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[85vh] flex items-center justify-center px-6">
                <form
                    onSubmit={handleLogin}
                    className="bg-slate-900 border border-slate-800 p-10 rounded-3xl w-full max-w-md flex flex-col gap-5 shadow-2xl"
                >
                    <h1 className="text-4xl font-black text-center mb-2">
                        Login
                    </h1>

                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="bg-slate-800 p-4 rounded-2xl border border-slate-700 focus:border-blue-500 focus:outline-none transition disabled:opacity-50 text-white"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="bg-slate-800 p-4 rounded-2xl border border-slate-700 focus:border-blue-500 focus:outline-none transition disabled:opacity-50 text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition p-4 rounded-2xl font-bold text-white shadow-lg"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="text-center mt-2 text-slate-400">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Create Account
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default Login;