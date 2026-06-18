import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  Clock,
  Video,
  Home,
  Download,
} from "lucide-react";
import gsap from "gsap";

const ConfirmedBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef(null);
  
  const [data, setData] = useState(() => {
    if (location.state?.bookingDetails) {
      // Save for refresh persistence
      localStorage.setItem("lastBooking", JSON.stringify(location.state));
      return location.state;
    }
    const saved = localStorage.getItem("lastBooking");
    return saved ? JSON.parse(saved) : null;
  });

  const bookingDetails = data?.bookingDetails;
  const tutor = data?.tutor;

  // Use useLayoutEffect for GSAP to prevent "flicker" or blur issues
  useLayoutEffect(() => {
    if (bookingDetails) {
      let ctx = gsap.context(() => {
        const tl = gsap.timeline();
        
        // Ensure card starts from a visible state but moves into place
        tl.from(".success-card", {
          opacity: 0,
          scale: 0.95,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(".animate-item", { 
          opacity: 0, 
          y: 20, 
          stagger: 0.1, 
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.4");
      }, componentRef);

      return () => ctx.revert(); 
    }
  }, [bookingDetails]);

  const handleGoHome = () => {
    localStorage.removeItem("lastBooking");
    navigate("/");
  };

  if (!bookingDetails) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <div className="p-4 bg-red-50 rounded-full">
            <p className="text-red-600 font-bold text-lg text-center">No booking details found.</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div ref={componentRef} className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans overflow-x-hidden">
      <div className="success-card max-w-lg w-full bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden relative">
        
        {/* Header - Optimized for visibility */}
        <div className="bg-indigo-600 p-10 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}
          ></div>

          <div className="animate-item inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 ring-8 ring-white/10">
            <CheckCircle size={44} className="text-white" />
          </div>
          <h1 className="animate-item text-3xl font-black text-white mb-2 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="animate-item text-indigo-100 text-sm font-semibold">
            Your session is officially scheduled
          </p>
        </div>

        <div className="p-8 md:p-10 bg-white">
          {/* Instructor Info */}
          <div className="animate-item flex items-center gap-4 mb-8 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
            <img
              src={tutor?.image || "https://via.placeholder.com/150"}
              alt={tutor?.name}
              className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-white"
            />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Instructor
              </p>
              <h3 className="text-xl font-black text-slate-800">
                {tutor?.name || "Expert Tutor"}
              </h3>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-2 mb-10">
            <div className="animate-item flex items-center justify-between py-4 border-b border-slate-50">
              <div className="flex items-center gap-3 text-slate-500 font-bold">
                <Calendar size={18} className="text-indigo-600" /> Date
              </div>
              <span className="font-black text-slate-900">{bookingDetails.date}</span>
            </div>

            <div className="animate-item flex items-center justify-between py-4 border-b border-slate-50">
              <div className="flex items-center gap-3 text-slate-500 font-bold">
                <Clock size={18} className="text-indigo-600" /> Time
              </div>
              <span className="font-black text-slate-900">
                {bookingDetails.startTime} - {bookingDetails.endTime}
              </span>
            </div>

            <div className="animate-item flex items-center justify-between py-4">
              <div className="flex items-center gap-3 text-slate-500 font-bold">
                <Video size={18} className="text-indigo-600" /> Format
              </div>
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Online Session
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="animate-item flex flex-col gap-4">
            <a
              href={bookingDetails.meetingLink || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
            >
              Join Classroom <Video size={22} />
            </a>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoHome}
                className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-800 rounded-[1.25rem] font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                <Home size={20} /> Home
              </button>
              <button className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-800 rounded-[1.25rem] font-bold hover:bg-slate-200 transition-all active:scale-95">
                <Download size={20} /> Receipt
              </button>
            </div>
          </div>
        </div>

        <div className="animate-item p-6 text-center bg-slate-50 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Confirmation email sent to your registered ID
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedBooking;