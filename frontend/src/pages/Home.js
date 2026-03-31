import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

function Home() {
  const [category, setCategory] = useState("Women");
  const [showFeedback, setShowFeedback] = useState(false);

  const productImages = {
    Women: {
      Shawl: "/6f91b62e-37fd-42de-b72b-cc46bb9602d8.jpg",
      Scarf: "/df04e8cd-6413-49f9-a405-762b6d2b18c4.jpg",
      Cardigan: "/ea393336-b7bc-4d56-90d3-be438b374f42.jpg",
      Poncho: "/33aec468-9244-41cd-b8fe-5c7b93e3f9ca.jpg",
    },
    Men: {
      Shawl: "/5d0ba00c-d132-434a-a1bf-2c148e95adee.jpg",
      Scarf: "/f70b190b-59c9-422f-a75c-35336c280ed5.png",
      Sweater: "/6a8b2e61-f589-43b3-8b96-678eb31dd5df.jpg",
      Cardigan: "/2af7e4c8-d621-47a6-bfe3-958e439fdfdc.jpg",
    },
  };

  return (
    <div className="bg-gray-50 text-gray-800 flex flex-col min-h-screen">
      
      {/* Brand */}
      <header className="py-6 text-center">
        <h1 className="text-4xl font-heading tracking-wide">
          Ambika Pashmina
        </h1>
      </header>

      {/* Hero with Video */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl text-white font-bold text-center px-4">
            Timeless Elegance in Every Thread
          </h2>
        </div>
      </section>

      {/* Category Toggle */}
      <section className="py-8 text-center flex-1">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setCategory("Women")}
            className={`px-4 py-2 rounded ${
              category === "Women"
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            Women
          </button>

          <button
            onClick={() => setCategory("Men")}
            className={`px-4 py-2 rounded ${
              category === "Men"
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            Men
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 px-6">
          {Object.entries(productImages[category]).map(
            ([item, img], idx) => (
              <Link
                key={idx}
                to={`/products?gender=${category}&category=${item}`}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={img}
                  alt={`${category} ${item}`}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4 text-center font-semibold">
                  {category} Pashmina {item}
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-10">
        <div className="container mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm">
          
          <div>
            <h3 className="font-bold mb-3">About Us</h3>
            <p>
              Ambika Pashmina brings authentic, handmade pashmina crafted
              with tradition and elegance.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Contact</h3>
            <p>Email: ambikapashmina@gmail.com</p>
            <p>Phone: +977 970-1261033</p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Connect</h3>
            <button
              onClick={() => setShowFeedback(true)}
              className="text-blue-400 hover:underline"
            >
              We love to hear your feedback.
            </button>

            {showFeedback && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-xl font-semibold mb-4">
                    Leave Feedback
                  </h3>

                  <textarea
                    rows="4"
                    placeholder="Your feedback..."
                    className="w-full border rounded p-2 mb-4"
                  />

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowFeedback(false)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        setShowFeedback(false);
                        alert("Thank you for your feedback!");
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold mb-3">Follow Us</h3>
            <div className="flex gap-4 mt-2 text-xl">
              <FaInstagram />
              <FaFacebook />
              <FaTiktok />
            </div>
          </div>

        </div>

        <div className="bg-gray-800 text-center py-3 text-xs">
          © 2025 Ambika Pashmina. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
