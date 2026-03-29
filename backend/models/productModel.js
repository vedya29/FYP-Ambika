const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    category: String,
    gender: String,
    description: String,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
