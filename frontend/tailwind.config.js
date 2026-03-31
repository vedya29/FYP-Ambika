module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        subheading: ["Cormorant Garamond", "serif"],
        body: ["Lato", "sans-serif"],
        alt: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#4F46E5",   // indigo-600
        secondary: "#6B7280", // gray-500
        accent: "#F3F4F6",    // gray-100
      },
    },
  },
  plugins: [],
};
