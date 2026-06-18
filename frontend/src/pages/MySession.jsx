import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import {
  Calendar,
  Clock,
  Video,
  Loader2,
  XCircle,
  Star,
  ArrowRight,
  CheckCircle,
  UploadCloud,
  UserCheck,
  BookOpen,
  Mail,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/bookings/student`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSessions(res.data.bookings || []);
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
    if (!loading && sessions.length > 0) {
      let ctx = gsap.context(() => {
        gsap.from(".portfolio-header", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });
        gsap.from(".session-card", {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          force3D: false,
          clearProps: "all",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, sessions]);

  const isSessionOver = (session) => {
    const now = new Date();
    const sessionTime = new Date(session.date);
    const [hours, minutes] = session.startTime.split(":");
    sessionTime.setHours(parseInt(hours), parseInt(minutes));
    return now > sessionTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-slate-900 mb-4" />
        <p className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">
          Syncing Portfolio...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F8FAFC] pb-20 overflow-x-hidden"
    >
      {/* SHARK TANK HEADER */}
      <div className="bg-slate-900 text-white pt-20 pb-40 px-6">
        <div className="max-w-6xl mx-auto portfolio-header">
          <div className="flex items-center gap-2 text-emerald-400 mb-4">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Learning Portfolio
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                My{" "}
                <span className="text-emerald-500 italic font-light">
                  Assets.
                </span>
              </h1>
              <p className="text-slate-400 mt-4 font-medium max-w-sm">
                Manage your scheduled mentorships and knowledge sessions.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md min-w-[160px]">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">
                  Total Sessions
                </p>
                <p className="text-4xl font-black text-emerald-400">
                  {sessions.length}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md min-w-[160px]">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">
                  Status
                </p>
                <p className="text-4xl font-black text-white">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SESSION LIST */}
      <div className="max-w-6xl mx-auto px-6 -mt-20">
        {sessions.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center shadow-2xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              No Investments Yet.
            </h3>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
              Browse Top Experts →
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="session-card group bg-white/90 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden"
              >
                {/* STATUS VERTICAL BAR */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2 ${
                    session.status === "confirmed"
                      ? "bg-emerald-500"
                      : session.status === "pending"
                        ? "bg-amber-500"
                        : "bg-slate-300"
                  }`}
                />

                {/* TUTOR BRANDING */}
                <div className="flex items-center gap-6 min-w-[300px] w-full lg:w-auto">
                  <div className="relative">
                    <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-emerald-400 font-black text-3xl shadow-xl transform group-hover:rotate-6 transition-transform">
                      {session.tutor?.name?.charAt(0)}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-emerald-500 p-1.5 rounded-lg border-4 border-white">
                      <ShieldCheck size={14} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
                      {session.tutor?.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <BookOpen size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {session.subject || "Expert Mentorship"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 opacity-60">
                      <Mail size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400">
                        {session.tutor?.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SCHEDULE BOX */}
                <div className="flex-1 w-full lg:w-auto flex gap-4">
                  <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center">
                    <Calendar size={18} className="text-slate-400 mb-1" />
                    <span className="text-[10px] font-black text-slate-900 uppercase">
                      {new Date(session.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center">
                    <Clock size={18} className="text-slate-400 mb-1" />
                    <span className="text-[10px] font-black text-slate-900 uppercase">
                      {session.startTime}
                    </span>
                  </div>
                  <div
                    className={`flex-1 p-4 rounded-2xl flex flex-col items-center justify-center border ${
                      session.status === "confirmed"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    <Zap size={18} className="mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {session.status}
                    </span>
                  </div>
                </div>

                {/* CTA ACTIONS */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
                  {getActionButton(session, isSessionOver(session), navigate)}

                  {session.status !== "completed" && (
                    <button className="flex items-center justify-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] py-3 px-6 hover:bg-rose-50 rounded-xl transition-all active:scale-95">
                      <XCircle size={16} /> Cancel Deal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getActionButton = (session, sessionOver, navigate) => {
  if (session.status === "confirmed" && !sessionOver) {
    return (
      <a
        href={session.meetingLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 group/btn"
      >
        <Video
          size={16}
          className="text-emerald-400 group-hover/btn:animate-pulse"
        />{" "}
        Launch Asset
      </a>
    );
  }

  if (sessionOver && !session.isStudentUploaded) {
    return (
      <button
        onClick={() => navigate(`/proof-validation/${session._id}`)}
        className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
      >
        <UploadCloud size={16} /> Submit Proof
      </button>
    );
  }

  if (session.status === "completed" && !session.isReviewed) {
    return (
      <button
        onClick={() => navigate(`/feedback/${session._id}`)}
        className="flex items-center justify-center gap-3 bg-white border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all active:scale-95"
      >
        <Star size={16} className="text-amber-500 fill-amber-500" /> Rate
        Mentorship
      </button>
    );
  }

  if (session.status === "completed" && session.isReviewed) {
    return (
      <div className="flex items-center justify-center gap-2 bg-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase">
        <Star size={16} className="text-yellow-400" /> Feedback Submitted
      </div>
    );
  }

  return null;
};

export default MySessions;
