import React from "react";

const Card = ({ label, value, icon, color }) => {
  return (
    <div
      className={`bg-gradient-to-br ${color} p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Stats
        </span>
      </div>

      <h2 className="text-gray-600 font-semibold mb-1">{label}</h2>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
};

export default Card;