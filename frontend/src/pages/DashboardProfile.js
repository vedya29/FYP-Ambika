import React, { useState } from "react";
import { useCart } from "../context/CartContext";

function DashboardProfile() {
  const { user, setUser } = useCart();

  const [fullName, setFullName] = useState(user?.fullName || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [message, setMessage] = useState("");

  // 📸 handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 💾 save profile
  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      fullName,
      email,
      age,
      gender,
      profilePic,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage("Profile updated successfully ✨");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
          My Profile 🌸
        </h2>
        <p className="text-gray-700">
          Manage your personal details and personalize your experience.
        </p>
      </section>

      {/* Profile Card */}
      <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#eee4d8] shadow-sm">
        {message && (
          <div className="mb-6 text-green-600 bg-green-50 p-3 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[#f3e5d6] flex items-center justify-center">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>

            <label className="cursor-pointer text-sm text-blue-600 underline">
              Upload Photo 📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block mb-1 font-medium">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Save Button */}
          <button className="w-full bg-black text-white py-3 rounded-full hover:opacity-90">
            Save Profile
          </button>
        </form>
      </section>

      {/* Bottom message */}
      <section className="bg-white rounded-3xl p-8 border border-[#eee4d8] shadow-sm text-center">
        <div className="text-4xl mb-2">✨</div>
        <p className="text-gray-700">
          Your profile helps us personalize your experience beautifully.
        </p>
      </section>
    </div>
  );
}

export default DashboardProfile;