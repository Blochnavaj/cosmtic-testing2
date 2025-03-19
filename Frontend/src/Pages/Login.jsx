import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const navigate = useNavigate();
    const [currentState, setCurrentState] = useState("login");
    const { setToken, token, backendUrl } = useContext(ShopContext);
    const [userInfo, setUserInfo] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!token && storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`; // ✅ Ensure token is used
        }
    }, [token, setToken]);

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const toggleState = () => {
        setCurrentState(currentState === "login" ? "register" : "login");
    };

    const handleClick = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            let response;
            if (currentState === "register") {
                response = await axios.post(`${backendUrl}/api/user/register`, {
                    name: userInfo.name,
                    email: userInfo.email,
                    password: userInfo.password,
                });
            } else {
                response = await axios.post(`${backendUrl}/api/user/login`, {
                    email: userInfo.email,
                    password: userInfo.password,
                });
            }

            if (response.data.success) {
                const authToken = response.data.token;

                if (authToken) {
                    localStorage.setItem("token", authToken);
                    setToken(authToken);
                    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`; // ✅ Set token for API calls
                }

                toast.success(currentState === "login" ? "Login successful! 🎉" : "Registration successful! 🎉");
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-16">
            <div className="flex justify-center items-center min-h-screen">
                <form onSubmit={handleClick} className="w-full max-w-2xl bg-white p-10 shadow-lg rounded-2xl">
                    <h2 className="text-3xl font-bold text-gray-500 text-center mb-6">
                        {currentState === "login" ? "Login" : "Register"}
                    </h2>

                    {currentState === "register" && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={userInfo.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={userInfo.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        />
                    </div>

                    <button
                        className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition font-semibold shadow-md flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : currentState === "login" ? "Login" : "Register"}
                    </button>

                    <p className="text-center mt-4 text-sm">
                        {currentState === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                        <span onClick={toggleState} className="text-green-500 cursor-pointer hover:underline">
                            {currentState === "login" ? "Register here" : "Login here"}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
