import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import gsap from "gsap";
import { backendUrl } from "../App";
import { Star, Sparkles, MessageSquare } from "lucide-react";

const TutorProfile = () => {
  const tutor = useSelector((state) => state.tutor.tutor);
  console.log("Tutor Data in Profile Component:", tutor);
  const leftRef = useRef();
  const rightRef = useRef();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/feedback/tutor/${tutor._id}`);
        const ratingRes = await axios.get(`${backendUrl}/api/feedback/rating/${tutor._id}`);
        if (res.data.success) setReviews(res.data.feedbacks || []);
        if (ratingRes.data.success) setAvgRating(ratingRes.data.avgRating || 0);
      } catch (err) {
        console.log("Error fetching feedback:", err);
      }
    };
    if (tutor?._id) fetchFeedback();
  }, [tutor]);

  useEffect(() => {
    if (tutor) {
      const tl = gsap.timeline();
      tl.fromTo(leftRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 })
        .fromTo(rightRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.5");
    }
  }, [tutor]);

  if (!tutor) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="font-black text-xs uppercase tracking-[0.5em] animate-pulse">Loading Profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-10 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <h1 className="text-[20vw] font-black uppercase">MY PORTFOLIO</h1>
      </div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white border-[8px] border-black shadow-[30px_30px_0px_#b28451]">
        
        {/* LEFT SIDE: Visuals */}
        <div ref={leftRef} className="lg:col-span-4 bg-black p-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="w-full h-1 bg-[#b28451] mb-8" />
          
          <div className="relative mb-6">
            <img
              src={tutor.image}
              className="w-48 h-60 object-cover border-4 border-[#b28451] grayscale"
              alt={tutor.name}
            />
            <div className="absolute -bottom-3 -right-3 bg-white text-black p-2 font-black text-xs border-2 border-black">
              {tutor.qualification}
            </div>
          </div>

          <h1 className="text-4xl font-black text-white uppercase leading-none mb-4">
            {tutor.name}
          </h1>
          
          <div className="flex flex-col gap-3 w-full">
            <div className="bg-[#b28451] text-white px-4 py-2 font-black text-[10px] uppercase tracking-widest text-center">
              {tutor.subject} Specialist
            </div>
            {/* Rating Display */}
            <div className="bg-white/10 p-3 flex items-center justify-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="text-white font-black text-lg">{avgRating.toFixed(1)}</span>
              <span className="text-gray-500 font-bold text-[10px] uppercase">/ 5.0</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Stats & Reviews */}
        <div ref={rightRef} className="lg:col-span-8 p-8 md:p-14 overflow-y-auto max-h-[85vh]">
          
          <div className="space-y-12">
            {/* Core Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border-2 border-black">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Experience</p>
                <p className="text-xl font-black">{tutor.experience} Yrs</p>
              </div>
              <div className="p-4 border-2 border-black">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Students</p>
                <p className="text-xl font-black">{tutor.students || 0}</p>
              </div>
              <div className="p-4 border-2 border-black">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Sessions</p>
                <p className="text-xl font-black">{tutor.sessions || 0}</p>
              </div>
              <div className="p-4 bg-black text-white">
                <p className="text-[10px] font-black text-[#b28451] uppercase mb-1">Hourly Fee</p>
                <p className="text-xl font-black">₹{tutor.fees}</p>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-[10px] font-black text-[#b28451] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles size={14} /> My Teaching Methodology
              </h3>
              <p className="text-lg font-bold text-black italic leading-tight uppercase">
                "{tutor.about || "Providing quality education through conceptual clarity."}"
              </p>
            </div>

            {/* Student Reviews Section - NEW */}
            <div className="pt-8 border-t-2 border-black">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} /> Student Feedback ({reviews.length})
                </h3>
                <div className="h-[2px] flex-1 bg-gray-100 mx-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.length > 0 ? (
                  reviews.slice(0, 4).map((r) => (
                    <div key={r._id} className="p-5 border border-gray-200 hover:border-black transition-all">
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-gray-600 italic leading-snug">"{r.review}"</p>
                      <p className="text-[9px] font-black uppercase text-gray-400 mt-3">— Verified Student</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs font-bold uppercase italic">No reviews found yet.</p>
                )}
              </div>
            </div>

            {/* Profile Status */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 font-black text-[9px] uppercase">
                Status: <span className={tutor.status === 'approved' ? 'text-green-600' : 'text-amber-500'}>{tutor.status}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 font-black text-[9px] uppercase">
                Online: <span className={tutor.isOnline ? 'text-green-600' : 'text-red-500'}>{tutor.isOnline ? 'YES' : 'NO'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;