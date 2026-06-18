import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { Star, MapPin, Briefcase, ArrowLeft, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";

const ViewTutorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tutor = location.state?.tutor;

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/feedback/tutor/${tutor._id}`);
        const ratingRes = await axios.get(`${backendUrl}/api/feedback/rating/${tutor._id}`);
        if (res.data.success) setReviews(res.data.feedbacks || []);
        if (ratingRes.data.success) setAvgRating(ratingRes.data.avgRating || 0);
      } catch (err) { console.log(err); }
    };
    if (tutor?._id) fetchReviews();
  }, [tutor]);

  if (!tutor) return <div className="h-screen flex items-center justify-center font-bold tracking-tight text-slate-400">Loading Experience...</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-black selection:text-white pb-32">
      {/* Top Navigation */}
      <nav className="px-6 py-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button onClick={() => navigate(-1)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100">
          <ArrowLeft size={20} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">Verified Educator</span>
      </nav>

      <main className="max-w-md mx-auto px-6">
        {/* Profile Hero */}
        <div className="flex flex-col items-center mt-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 rounded-[2.8rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <img 
              src={tutor.image} 
              className="w-32 h-32 rounded-[2.5rem] object-cover relative border-4 border-white shadow-xl" 
              alt={tutor.name} 
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
              <ShieldCheck size={18} />
            </div>
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter mt-6">{tutor.name}</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">{tutor.subject} Specialist</p>
        </div>

        {/* Dynamic Stats Strip */}
        <div className="flex justify-between items-center mt-10 p-2 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <div className="flex items-center gap-3 pl-4">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="font-black text-sm">{avgRating.toFixed(1)}</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reviews.length} Reviews</span>
          </div>
          <div className="flex items-center gap-2 pr-2">
             <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
                <Sparkles size={12} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase">Top Rated</span>
             </div>
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-5 rounded-[2rem] border border-slate-100 bg-white shadow-sm">
            <Briefcase size={18} className="text-slate-400 mb-2" />
            <p className="text-xl font-black tracking-tight">{tutor.experience} Years</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1 text-nowrap">Experience</p>
          </div>
          <div className="p-5 rounded-[2rem] border border-slate-100 bg-white shadow-sm">
            <MapPin size={18} className="text-slate-400 mb-2" />
            <p className="text-xl font-black tracking-tight truncate">{tutor.address.split(',')[0]}</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Location</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-10">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">The Methodology</h3>
          <p className="text-lg text-slate-600 leading-snug font-medium italic">
            "{tutor.bio || tutor.about || "Focusing on conceptual clarity and real-world application."}"
          </p>
        </div>

        {/* Student Success Stories (Testimonials) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Student Feedback</h3>
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified</span>
          </div>
          
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((r) => (
                <div key={r._id} className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 transition-hover hover:border-emerald-200">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed italic">"{r.review}"</p>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs font-bold text-slate-300 uppercase italic">Awaiting first session review...</p>
            )}
          </div>
        </div>
      </main>

      {/* Floating Checkout (The Money Shot) */}
      <div className="fixed bottom-8 left-0 w-full px-6 z-50">
        <div className="max-w-md mx-auto bg-slate-900 rounded-[2.5rem] p-3 flex items-center justify-between shadow-2xl shadow-slate-300 ring-4 ring-white">
           <div className="pl-6">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hourly Rate</p>
             <p className="text-2xl font-black text-white leading-none mt-1">₹{tutor.fees}</p>
           </div>
           <button 
             onClick={() => navigate("/upload-problem", { state: { tutor } })}
             className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-colors active:scale-95"
           >
             Book Now <ChevronRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTutorProfile;