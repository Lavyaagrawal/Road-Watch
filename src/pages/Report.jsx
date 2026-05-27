import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { saveIssue } from "../services/localIssueService";

function Report() {
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Pothole");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Geolocation state
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [locLoading, setLocLoading] = useState(false);
    const [locError, setLocError] = useState(null);

    // Track Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Detect User Location using HTML5 Geolocation API
    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocError("Geolocation is not supported by your browser");
            // Set mock coordinates near Pune as fallback
            const randomOffsetLat = (Math.random() - 0.5) * 0.1;
            const randomOffsetLng = (Math.random() - 0.5) * 0.1;
            setLatitude(18.5204 + randomOffsetLat);
            setLongitude(73.8567 + randomOffsetLng);
            return;
        }

        setLocLoading(true);
        setLocError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setLocLoading(false);
                setLocError(null);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocError("Location access denied or unavailable. Using fallback location.");
                // Set mock coordinates near Pune as fallback
                const randomOffsetLat = (Math.random() - 0.5) * 0.1;
                const randomOffsetLng = (Math.random() - 0.5) * 0.1;
                setLatitude(18.5204 + randomOffsetLat);
                setLongitude(73.8567 + randomOffsetLng);
                setLocLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Detect location on mount
    useEffect(() => {
        detectLocation();
    }, []);

    // COMPRESS IMAGE AND CONVERT TO BASE64 (Canvas Resizing)
    const compressAndConvertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to 70% quality JPEG to keep payload extremely small (30KB-80KB)
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login first");
            return;
        }

        if (!image) {
            alert("Please upload image");
            return;
        }

        setLoading(true);

        try {
            // COMPRESS IMAGE TO BASE64
            const compressedBase64 = await compressAndConvertToBase64(image);

            const finalLat = latitude !== null ? latitude : 18.5204;
            const finalLng = longitude !== null ? longitude : 73.8567;

            saveIssue({
                description,
                type,
                imageUrl: compressedBase64,
                status: "Pending",
                userEmail: user.email,
                latitude: finalLat,
                longitude: finalLng,
                createdAt: new Date().toISOString(),
            });

            alert("Issue Reported Successfully!");

            setDescription("");
            setType("Pothole");
            setImage(null);
            // Refresh location to ensure next report gets fresh GPS reading
            detectLocation();
        } catch (error) {
            console.error(error);
            alert("Failed to submit report");
        } finally {
            setLoading(false);
        }
    };

    return (

        <Layout>

            <div className="max-w-2xl mx-auto px-6 py-20">

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">

                    <h1 className="text-5xl font-black mb-10 text-center">
                        Report Road Issue
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImage(e.target.files[0])
                            }
                            className="bg-slate-800 p-5 rounded-2xl"
                        />

                        <textarea
                            placeholder="Describe issue..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="bg-slate-800 p-5 rounded-2xl h-40"
                        />

                        <select
                            value={type}
                            onChange={(e) =>
                                setType(e.target.value)
                            }
                            className="bg-slate-800 p-5 rounded-2xl"
                        >

                            <option>Pothole</option>
                            <option>Waterlogging</option>
                            <option>Broken Signal</option>
                            <option>Road Crack</option>

                        </select>

                        {/* Premium Geolocation capture UI */}
                        <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    Incident Location
                                </span>
                                <button
                                    type="button"
                                    onClick={detectLocation}
                                    disabled={locLoading}
                                    className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-all flex items-center gap-1"
                                >
                                    {locLoading ? (
                                        <span className="inline-block animate-spin mr-1">🔄</span>
                                    ) : "🔄"} Recalculate
                                </button>
                            </div>

                            {locLoading ? (
                                <p className="text-sm text-slate-300 animate-pulse">Detecting your exact GPS coordinates...</p>
                            ) : locError ? (
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-amber-400 font-semibold">⚠️ {locError}</p>
                                    {latitude !== null && longitude !== null && (
                                        <p className="text-xs text-slate-400">
                                            Fallback Location: <span className="font-mono text-slate-300">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <p className="text-sm text-emerald-400 font-semibold flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                                        GPS Location Confirmed
                                    </p>
                                    <p className="text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                        {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 transition p-5 rounded-2xl font-bold"
                        >

                            {loading
                                ? "Submitting..."
                                : "Submit Report"}

                        </button>

                    </form>

                </div>

            </div>

        </Layout>

    );

}

export default Report;