import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { X, UserPlus } from "lucide-react";

// *** IMPORTANT: CONFIGURE YOUR API URL HERE ***
const API_BASE_URL = 'http://localhost:5000/api'; 

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        age: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(""); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        // --- 1. Frontend Validation ---
        if (formData.password !== formData.confirmPassword) {
            setMessage("❌ Passwords do not match!");
            setLoading(false);
            return;
        }

        if (formData.age <= 0 || formData.age > 120) {
            setMessage("⚠️ Age must be between 1 and 120!");
            setLoading(false);
            return;
        }
        
        // Prepare data to send to the backend (excluding confirmPassword)
        const { confirmPassword, ...dataToSend } = formData;
        
        // --- 2. API Call to Backend ---
        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend), 
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Registration successful (Status 201)
                setMessage(`✅ ${data.message || 'Registration successful! Proceeding to login.'}`);
                // Navigate to Login after success
                setTimeout(() => {
                    navigate("/login"); 
                }, 1500);
            } else {
                // FAILURE: Backend sent an error (e.g., email already exists, password too weak)
                setMessage(`❌ ${data.message || 'Registration failed. Check server logs.'}`);
            }
        } catch (err) {
            console.error('Network Error:', err);
            setMessage("❌ Could not connect to the Node.js server. Please ensure it is running on port 5000.");
        } finally {
            setLoading(false);
        }
    };
    
    const isError = message.startsWith('❌') || message.startsWith('⚠️');

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f4f0] text-[#3b2f2f] px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 relative">
                {/* ❌ Close Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-3xl font-serif text-center mb-6"><UserPlus className="inline w-7 h-7 mr-2"/> Create Account</h2>
                <p className="text-center text-sm mb-6">Fill in the details below</p>

                {message && (
                    <div className={`mb-4 text-center font-medium p-3 rounded-lg ${isError ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                        {message}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm mb-1">👤 Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">🚻 Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e]"
                        >
                            <option value="">Select gender</option>
                            <option value="female">👩 Female</option>
                            <option value="male">👨 Male</option>
                            <option value="other">⚧ Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">🎂 Age</label>
                        <input
                            type="number"
                            name="age"
                            placeholder="Enter your age"
                            value={formData.age}
                            onChange={handleChange}
                            min="1"
                            max="120"
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">📧 Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">🔒 Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password (6+ chars)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">🔑 Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#c8a27e] text-white py-2 rounded-md hover:bg-[#b48f6d] transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                            '✅ Register'
                        )}
                    </button>
                </form>

                <div className="my-6 text-center text-sm text-gray-500">OR</div>

                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#c8a27e] font-semibold hover:underline">
                        🔑 Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
