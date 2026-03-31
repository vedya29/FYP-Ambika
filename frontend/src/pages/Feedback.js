import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const Feedback = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    liked: "",
    improvement: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", formData);
    alert("✨ Thank you for your valuable feedback! ✨");
    setFormData({ name: "", email: "", liked: "", improvement: "" }); // reset form
    navigate("/"); // optional: redirect to landing after submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f4f0] text-[#3b2f2f] px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 relative">
        {/* ❌ Close button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-serif text-center mb-4">
          🌸 We Value Your Feedback 🌸
        </h2>
        <p className="text-center text-sm mb-8">
          Share your thoughts with us 💬
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">👤 Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e]"
            />
          </div>

          {/* Email */}
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

          {/* Things you liked */}
          <div>
            <label className="block text-sm mb-1">✨ Things you liked</label>
            <textarea
              name="liked"
              placeholder="What did you like the most?"
              value={formData.liked}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e] resize-none"
            />
          </div>

          {/* Need of improvement */}
          <div>
            <label className="block text-sm mb-1">
              🛠️ Need of improvement (optional)
            </label>
            <textarea
              name="improvement"
              placeholder="Tell us what we can improve..."
              value={formData.improvement}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e] resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#c8a27e] text-white font-semibold py-3 rounded-md hover:bg-[#b48f6d] transition"
          >
            🚀 Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
