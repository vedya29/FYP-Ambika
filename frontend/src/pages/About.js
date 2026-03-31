import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

function About() {
  const navigate = useNavigate();

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
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-5xl font-serif mb-4">About Ambika Pashmina</h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed">
            At <b>Ambika Pashmina</b>, we believe luxury is not just about style
            — it’s about heritage, authenticity, and timeless craftsmanship. Our
            mission is to bring you pure, handmade pashmina that carries the soul
            of Nepalese tradition.
          </p>
        </section>

        {/* Story & Image */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1601121143721-99f46db98e9e?auto=format&fit=crop&w=1200&q=80"
              alt="Pashmina Craft"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-serif mb-4">🌸 Our Story</h2>
            <p className="text-lg leading-relaxed">
              Founded with a passion for preserving tradition, Ambika Pashmina
              connects the artistry of skilled Nepalese weavers with modern
              elegance. Every thread is a promise of authenticity, woven with
              patience and love.
            </p>
          </div>
        </section>

        {/* Craftsmanship & Ethics in Boxes */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-serif mb-4">🧵 Craftsmanship</h3>
            <p className="text-lg leading-relaxed">
              Each pashmina is meticulously handmade by artisans who have honed
              their craft for generations. The result? A timeless masterpiece
              that radiates elegance and warmth.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-serif mb-4">🌍 Sustainability & Ethics</h3>
            <p className="text-lg leading-relaxed">
              We are committed to fair trade, eco-friendly practices, and
              supporting the communities behind our products. With Ambika
              Pashmina, luxury meets responsibility.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-3xl font-serif text-center mb-8">⭐ Why Choose Us</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl mb-2">✨</p>
              <h4 className="font-semibold">Authentic Pashmina</h4>
              <p className="text-sm mt-2">100% pure and certified.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl mb-2">🕰️</p>
              <h4 className="font-semibold">Timeless Designs</h4>
              <p className="text-sm mt-2">Styles that never fade.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl mb-2">🤲</p>
              <h4 className="font-semibold">Handmade</h4>
              <p className="text-sm mt-2">Artisanship in every thread.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl mb-2">💎</p>
              <h4 className="font-semibold">Luxury Guaranteed</h4>
              <p className="text-sm mt-2">Premium quality ensured.</p>
            </div>
          </div>
        </section>

        {/* Vision & Promise */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-serif mb-4">🎯 Vision & Mission</h3>
            <p className="text-lg leading-relaxed">
              <b>Mission:</b> To bring the warmth and elegance of pure pashmina
              to the world, while supporting artisans and preserving culture.{" "}
              <br />
              <b>Vision:</b> To be the most trusted global brand for authentic
              pashmina, symbolizing Nepalese heritage.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-serif mb-4">❤️ Our Promise</h3>
            <p className="text-lg leading-relaxed">
              With Ambika Pashmina, you own more than just a garment. You embrace
              authenticity, heritage, and timeless luxury that stays with you for
              life.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-serif mb-6">🛍️ Discover Elegance</h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#c8a27e] text-white px-8 py-3 rounded-md hover:bg-[#b48f6d] transition"
          >
            Explore Our Collection
          </button>
        </section>
      </div>
    </div>
  );
}

export default About;
