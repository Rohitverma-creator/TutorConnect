import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  export const backendUrl = "https://tutorconnect-3-dpps.onrender.com";


  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/admin/logout`,
        {},
        { withCredentials: true }
      );

      navigate("/admin-login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b">
      <h1 className="text-xl font-semibold text-gray-800">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">👤 Admin</span>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
        >
          Logout
        </button>

        
      </div>
    </div>
  );
};

export default Navbar;
