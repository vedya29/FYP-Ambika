import React, { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();

  const [showNavShop, setShowNavShop] = useState(false);
  const [showHeroShop, setShowHeroShop] = useState(false);

  const storedUser = localStorage.getItem("user");

  // ✅ FIX: useEffect inside component
  useEffect(() => {
    if (storedUser) {
      navigate("/dashboard");
    }
  }, [storedUser, navigate]);

  const products = [
    { name: "Pashmina Shawl", price: "$99.00", img: "/images/shawl.jpg" },
    { name: "Pashmina Scarf", price: "$150.00", img: "/images/scarf.jpg" },
    { name: "Pashmina Sweater", price: "$99.00", img: "/images/sweater.jpg" },
    { name: "Pashmina Cardigan", price: "$149.00", img: "/images/cardigan.jpg" },
    { name: "Pashmina Poncho", price: "$149.00", img: "/images/poncho.jpg" },
    { name: "Pashmina Cap", price: "$149.00", img: "/images/cap.jpg" },
  ];

  const handleShop = (role, source) => {
    if (source === "nav") setShowNavShop(false);
    if (source === "hero") setShowHeroShop(false);

    if (role === "user") navigate("/login");
    else navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f4f0] text-[#3b2f2f] flex flex-col">
      <header className="flex justify-between items-center px-10 py-6 border-b bg-white relative">
        <h1 className="text-2xl font-serif">Ambika Pashmina</h1>

        <nav className="flex gap-8 items-center relative">
          <Link to={storedUser ? "/dashboard" : "/"}>
            Home
          </Link>

          <div className="relative">
            <button
              onClick={() => {
                setShowNavShop(!showNavShop);
                setShowHeroShop(false);
              }}
              className="hover:text-[#c8a27e]"
            >
              Shop
            </button>

            {showNavShop && (
              <div className="absolute top-full mt-2 w-44 bg-white shadow-lg rounded-md border z-50">
                <button
                  onClick={() => handleShop("user", "nav")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  👤 Continue as User
                </button>
                <button
                  onClick={() => handleShop("admin", "nav")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  🛡️ Continue as Admin
                </button>
              </div>
            )}
          </div>

          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="flex gap-4">
          <Search className="w-5 h-5 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 cursor-pointer" />
        </div>
      </header>

      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted className="absolute w-full h-full object-cover">
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-center text-white">
          <h2 className="text-5xl font-serif mb-4">Luxurious & Elegant</h2>
          <p className="mb-6">Pashmina Scarves & Shawls</p>

          <div className="relative inline-block">
            <button
              onClick={() => {
                setShowHeroShop(!showHeroShop);
                setShowNavShop(false);
              }}
              className="bg-[#c8a27e] px-6 py-3 rounded-md"
            >
              Shop Now
            </button>

            {showHeroShop && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-44 bg-white text-black shadow-lg rounded-md">
                <button
                  onClick={() => handleShop("user", "hero")}
                  className="w-full px-4 py-2 hover:bg-gray-100"
                >
                  👤 Continue as User
                </button>
                <button
                  onClick={() => handleShop("admin", "hero")}
                  className="w-full px-4 py-2 hover:bg-gray-100"
                >
                  🛡️ Continue as Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* rest stays same */}
    </div>
  );
}

export default LandingPage;