import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

const SmartTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const navigate = useNavigate();

  const fetchTutors = async () => {
    if (!subject) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/tutor/recommended-tutors`,
        {
          subject,
          maxFees: maxFees || 10000,
        },
      );
      setTutors(res.data.tutors);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 text-gray-900">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">
          Smart <span className="text-amber-500">Tutor</span>
        </h1>
        <div className="h-1.5 w-20 bg-amber-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-center mb-16 p-3 bg-white rounded-2xl border border-amber-100 shadow-2xl shadow-amber-100/20">
        <input
          type="text"
          placeholder="Which subject do you want to learn?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="px-6 py-4 rounded-xl border-none focus:ring-2 focus:ring-amber-500 w-full md:w-80 outline-none"
        />

        <input
          type="number"
          placeholder="Max Budget (₹)"
          value={maxFees}
          onChange={(e) => setMaxFees(e.target.value)}
          className="px-6 py-4 rounded-xl border-none focus:ring-2 focus:ring-amber-500 w-full md:w-48  outline-none"
        />

        <button
          onClick={fetchTutors}
          className="bg-amber-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 active:scale-95"
        >
          Find Tutors
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 text-lg font-medium">
              Enter details above to find the best matching tutors.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tutors.map((tutor) => (
              <div
                key={tutor._id}
                className="group bg-white rounded-3xl border border-gray-100 p-5 transition-all hover:border-amber-400 hover:shadow-xl hover:shadow-amber-100/50"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={tutor.image}
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-500"
                    alt=""
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    <span className="text-amber-500">⭐</span>{" "}
                    {tutor.avgRating?.toFixed(1) || 0}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800">
                  {tutor.name}
                </h2>
                <p className="text-amber-600 font-bold text-xs uppercase mb-3 tracking-widest">
                  {tutor.subject}
                </p>

                <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                      Hourly Rate
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      ₹{tutor.fees}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                      AI Score
                    </p>
                    <p className="text-lg font-bold text-amber-500">
                      {tutor.aiScore || 0}%
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/upload-problem", { state: { tutor } })
                  }
                  className="mt-6 w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold transition-all group-hover:bg-amber-500 group-hover:shadow-lg group-hover:shadow-amber-200"
                >
                  Book Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartTutor;
