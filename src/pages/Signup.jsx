import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

function Signup() {
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

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return alert("Please fill in all fields");
        }
        if (password.length < 6) {
            return alert("Password should be at least 6 characters");
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account Created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup error:", error);
            if (error.code === "auth/email-already-in-use") {
                alert("This email is already in use.");
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
                    onSubmit={handleSignup}
                    className="bg-slate-900 border border-slate-800 p-10 rounded-3xl w-full max-w-md flex flex-col gap-5 shadow-2xl"
                >
                    <h1 className="text-4xl font-black text-center mb-2">
                        Signup
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
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    <div className="text-center mt-2 text-slate-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default Signup;