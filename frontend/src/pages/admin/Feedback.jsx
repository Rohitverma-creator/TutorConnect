import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { Star, MessageSquare, Quote, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Feedbacks = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/admin/feedbacks`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.feedbacks);
        }
      });
  }, []);

  return (
    <div className="p-6 lg:p-10 bg-[#fafafa] min-h-screen text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-amber-600 font-bold text-sm mb-4 hover:gap-3 transition-all"
            >
              <ArrowLeft size={16} /> BACK TO DASHBOARD
            </button>
            <h1 className="text-4xl font-black tracking-tighter text-slate-950 flex items-center gap-3">
              QUALITY <span className="text-amber-500 underline decoration-4 underline-offset-8">ASSURANCE</span>
            </h1>
            <p className="text-slate-400 font-medium mt-4 uppercase tracking-[0.2em] text-xs">
              Direct Platform Feedback & Integrity
            </p>
          </div>

          <div className="bg-white px-6 py-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Rating</p>
              <p className="text-2xl font-black text-slate-900">4.8/5.0</p>
            </div>
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <Star size={24} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* FEEDBACK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((f) => (
            <div
              key={f._id}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group hover:border-amber-400 transition-all duration-300"
            >
              {/* Quote Icon Decoration */}
              <div className="absolute top-6 right-8 text-slate-50 group-hover:text-amber-50 transition-colors">
                <Quote size={48} fill="currentColor" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 border-2 border-white shadow-sm">
                    {f.student?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <h2 className="font-black text-slate-900 leading-none mb-1">
                      {f.tutor?.name}
                    </h2>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-tighter">
                      Assigned Tutor
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < f.rating ? "text-amber-500" : "text-slate-200"} 
                      fill={i < f.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed italic text-sm mb-6">
                  "{f.review}"
                </p>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Verified Review by {f.student?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold italic">Waiting for platform engagement data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;