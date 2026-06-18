import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-white text-black font-semibold"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="w-64 h-screen bg-black text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/admin-dashboard" className={linkClass("/admin-dashboard")}>
          📊 Dashboard
        </Link>

        <Link to="/admin-sessions" className={linkClass("/admin-sessions")}>
          📅 Sessions
        </Link>

        <Link to="/admin-payments" className={linkClass("/admin-payments")}>
          💰 Payments
        </Link>
      </nav>

      <div className="mt-auto pt-10">
        <p className="text-sm text-gray-400">Tutor Connect Admin</p>
      </div>
    </div>
  );
};

export default SideBar;