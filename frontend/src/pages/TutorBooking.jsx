import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import {
  Calendar,
  Clock,
  Video,
  Loader2,
  CheckCircle,
  UploadCloud,
  ShieldCheck,
  XCircle,
  ArrowUpRight,
  Wallet,
  Hourglass,
  LayoutDashboard,
} from "lucide-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const TutorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/bookings/tutor`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!loading && bookings.length > 0) {
      let ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.from(".stat-card", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          clearProps: "all",
        }).from(
          ".booking-card",
          {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power2.out",
            force3D: false,
            clearProps: "all",
          },
          "-=0.3",
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, bookings]);

  const isSessionOver = (b) => {
    if (!b?.date || !b?.startTime) return false;

    const now = new Date();

    let start;

    if (typeof b.startTime === "string" && /^\d{2}:\d{2}$/.test(b.startTime)) {
      const d = new Date(b.date);
      const [h, m] = b.startTime.split(":").map(Number);

      start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
    } else {
      start = new Date(b.startTime);
    }

    if (isNaN(start.getTime())) return false;

    const end = new Date(start.getTime() + (b.duration || 60) * 60000);

    const bufferEnd = new Date(end.getTime() + 10 * 60000);

    return now >= bufferEnd;
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${backendUrl}/api/bookings/${id}/status`,
        { status },
        { withCredentials: true },
      );
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const getActionButton = (b) => {
    const sessionOver = isSessionOver(b);

    if (b.status === "confirmed" && !sessionOver) {
      return (
        <a
          href={b.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
        >
          <Video size={16} className="text-emerald-400" /> Launch Session
        </a>
      );
    }

    if (b.status === "confirmed" && sessionOver) {
      return (
        <button
          onClick={() => updateStatus(b._id, "completed")}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition"
        >
          <CheckCircle size={16} /> Mark Executed
        </button>
      );
    }

    if (b.status === "completed" && sessionOver && !b.isTutorUploaded) {
      return (
        <button
          onClick={() => navigate(`/proof-validation/${b._id}`)}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition"
        >
          <UploadCloud size={16} /> Finalize Proof
        </button>
      );
    }

    if (b.status === "completed" && b.isTutorUploaded) {
      return (
        <div className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-600 p-4 rounded-2xl font-black text-[10px] uppercase">
          <ShieldCheck size={16} /> Deal Closed
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin w-10 h-10 text-emerald-600" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F1F5F9] pb-20 overflow-x-hidden"
    >
      <div className="bg-slate-900 text-white pt-16 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Command Center
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-8">
            Booking <span className="text-emerald-500 italic">Portfolio.</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <Wallet className="text-emerald-400 mb-2" size={20} />
              <p className="text-xs text-slate-400 font-bold uppercase">
                Total Deals
              </p>
              <p className="text-2xl font-black">{bookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16">
        {bookings.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] text-center shadow-xl border border-slate-100">
            <Hourglass className="w-12 h-12 mx-auto text-slate-200 mb-4" />
            <p className="font-bold text-slate-400 uppercase tracking-widest">
              No active pitches found
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                }}
                className="booking-card group bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-emerald-400">
                      {b.student?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-900">
                        {b.student?.name}
                      </h3>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        Class {b.student?.class}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <LayoutDashboard size={12} className="text-slate-400" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">
                        Problem Brief
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                      "{b.problemText}"
                    </p>
                    {b.problemImage && (
                      <img
                        src={b.problemImage}
                        alt="case"
                        className="mt-3 w-20 h-20 rounded-xl object-cover border-2 border-white shadow-sm"
                      />
                    )}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                      <Calendar size={14} className="text-emerald-500" />
                      {new Date(b.date).toLocaleDateString("en-GB")}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                      <Clock size={14} className="text-emerald-500" />
                      {b.startTime}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col gap-3 min-w-[220px]">
                  <div
                    className={`text-center py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      b.status === "confirmed"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                        : b.status === "pending"
                          ? "bg-amber-50 border-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {b.status}
                  </div>
                  <div className="flex gap-2">
                    {b.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(b._id, "confirmed")}
                          className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                        >
                          <ArrowUpRight size={14} className="inline mr-1" />{" "}
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(b._id, "rejected")}
                          className="flex-1 bg-white text-rose-500 border-2 border-rose-50 py-3.5 rounded-xl font-black text-[10px] uppercase hover:bg-rose-50 transition"
                        >
                          <XCircle size={14} className="inline mr-1" /> Pass
                        </button>
                      </>
                    )}
                    {getActionButton(b)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorBookings;
