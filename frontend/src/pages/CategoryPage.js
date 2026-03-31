import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import products from "../data/products";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CategoryPage({ forcedCategory }) {
  const { category: paramCategory } = useParams();
  const query = useQuery();
  const gender = query.get("gender") || query.get("g"); // support ?gender=

  const category = forcedCategory || paramCategory; // support direct /shawls route wrapper or /category/shawls

  const filtered = products.filter((p) => p.category === category && (!gender || p.gender === gender));

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold capitalize">{(gender ? `${gender} ` : "") + (category || "Products")}</h1>
        <Link to="/products" className="text-sm text-gray-600 underline">View All</Link>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link key={p.id} to={`/products/${p.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg">
              <img src={p.image} alt={p.name} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-gray-600 mt-1">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
