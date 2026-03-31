import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#f8f4f0] text-[#3b2f2f] relative">
      {/* ❌ Close Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-6 text-gray-600 hover:text-red-500"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Page Title */}
        <section className="text-center">
          <h1 className="text-5xl font-serif mb-4">📞 Contact Us</h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions or want to connect with us? We’d love to hear from you.  
            Whether it’s about our products, collaborations, or feedback — reach out today.
          </p>
        </section>

        {/* Contact Info + Form */}
        <section className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <h2 className="text-3xl font-serif mb-4">🤝 Get in Touch</h2>
            <p>
              <b>📍 Address:</b> Kathmandu, Nepal
            </p>
            <p>
              <b>📧 Email:</b> ambikapashmina@gmail.com
            </p>
            <p>
              <b>📞 Phone:</b> +977 970-1261033
            </p>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold mb-2">Follow Us:</h3>
              <div className="flex gap-4 text-xl">
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <FaInstagram className="hover:text-gray-600" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <FaFacebook className="hover:text-gray-600" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer">
                  <FaTiktok className="hover:text-gray-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-serif mb-6">✉️ Send Us a Message</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
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
                <label className="block text-sm mb-1">💬 Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a27e] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c8a27e] text-white py-3 rounded-md hover:bg-[#b48f6d] transition"
              >
                🚀 Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Google Map Embed */}
        <section className="text-center">
          <h2 className="text-3xl font-serif mb-6">🗺️ Find Us</h2>
          <div className="w-full h-80 rounded-lg shadow-md overflow-hidden">
            <iframe
              title="Ambika Pashmina Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0054388472784!2d85.3240!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1905d4e1d5d1%3A0x7b8f17c6fafd1d5b!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2snp!4v1694430000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Back to Home button */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-[#c8a27e] text-white px-8 py-3 rounded-md hover:bg-[#b48f6d] transition"
          >
            ⬅️ Back to Home
          </button>
        </section>
      </div>
    </div>
  );
}

export default Contact;
