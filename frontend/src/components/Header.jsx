import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import axios from "axios";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const result = await axios.post(
        `${backendUrl}/api/student/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#0F4C53] via-[#0F4C53]/90 to-[#0F4C53] shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-[#60A5FA]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-yellow-300 drop-shadow-lg animate-pulse">
                Tutor Connect
              </h1>
            </div>
          </div>

          {/* Navigation with Background */}
          <nav className="hidden md:flex items-center space-x-8 bg-[#0F4C53]/60 backdrop-blur-md px-8 py-4 rounded-3xl border border-[#60A5FA]/30 shadow-2xl">
            <a
              onClick={() => navigate("/")}
              href="#home"
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 transform hover:underline underline-offset-4 decoration-[#60A5FA]"
            >
              Home
            </a>
            <a
              onClick={() => navigate("/tutor")}
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 transform hover:underline underline-offset-4 decoration-[#60A5FA]"
            >
              Tutors
            </a>
            <a
              onClick={() => navigate("/blog")}
              href="#about"
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 transform hover:underline underline-offset-4 decoration-[#60A5FA]"
            >
              Blog
            </a>
            <a
              onClick={() => navigate("/contact")}
              href="#contact"
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 transform hover:underline underline-offset-4 decoration-[#60A5FA]"
            >
              Contact
            </a>

               <a
              onClick={() => navigate("/time-table")}
              
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 transform hover:underline underline-offset-4 decoration-[#60A5FA]"
            >
              Time Table Generator
            </a>
          </nav>

          {/* Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/my-profile")}
              className="px-6 py-3 bg-[#0F4C53]/60 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-[#0F4C53]/80 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-white/20"
            >
              My Profile
            </button>
            <button
              onClick={() => setToggle((prev) => !prev)}
              className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setDropdown((prev) => !prev)}
            className="md:hidden text-white p-2 rounded-xl hover:bg-[#0F4C53]/70 transition-all duration-300"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {toggle && (
          <div className="absolute right-4 top-14 bg-white shadow-lg rounded-xl w-44 border border-gray-200">
            <div className="flex flex-col p-2">
              <button
                onClick={() => navigate("/my-session")}
                className="text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                My Sessions
              </button>

                <button
                onClick={() => navigate("/emergency-session-history")}
                className="text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Emergency Session
              </button>
              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 rounded-lg hover:bg-red-100 text-red-500 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {dropdown && (
          <div className="absolute top-16 left-0 w-full bg-[#0F4A51] shadow-2xl border-t border-white/20 z-50">
            <nav className="flex flex-col p-5 space-y-4 text-white font-medium">
              <button
                onClick={() => navigate("/")}
                className="text-left hover:pl-2 transition-all duration-200 hover:text-yellow-300"
              >
                Home
              </button>

              <button
                onClick={() => navigate("/tutor")}
                className="text-left hover:pl-2 transition-all duration-200 hover:text-yellow-300"
              >
                Tutor
              </button>

              <button
                onClick={() => navigate("/blog")}
                className="text-left hover:pl-2 transition-all duration-200 hover:text-yellow-300"
              >
                Blog
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="text-left hover:pl-2 transition-all duration-200 hover:text-yellow-300"
              >
                Contacts
              </button>

              <hr className="border-white/20" />

              <button
                onClick={() => navigate("/my-profile")}
                className="text-left hover:pl-2 transition-all duration-200 hover:text-yellow-300"
              >
                My Profile
              </button>

              <button
                onClick={() => navigate("/sessions")}
                className="text-left hover:pl-2 transition-all duration-200 hover:text-yellow-300"
              >
                My Sessions
              </button>

              <button className="text-left text-red-300 hover:bg-red-500/20 px-2 py-1 rounded transition">
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
