import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { gsap } from "gsap";

const EmergencySessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);
  const emptyRef = useRef(null);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/emergency/student-sessions`, { withCredentials: true });
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(subtitleRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
  }, []);

  useEffect(() => {
    if (loading) return;
    if (sessions.length === 0 && emptyRef.current) {
      gsap.fromTo(emptyRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" });
      return;
    }
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".session-card");
      gsap.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
    }
  }, [loading, sessions]);

  const statusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-500";
    const s = status.toLowerCase();
    if (s === "completed") return "bg-emerald-50 text-emerald-600 border-emerald-200";
    if (s === "pending") return "bg-amber-50 text-amber-600 border-amber-200";
    if (s === "cancelled") return "bg-red-50 text-red-500 border-red-200";
    return "bg-gray-100 text-gray-500 border-gray-200";
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Raleway:wght@400;500;600;700&display=swap');`}</style>

      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30" style={{ fontFamily: "'Raleway', sans-serif" }}>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-200 flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
            </div>
            <h1
              ref={titleRef}
              className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Instant Session
              <span className="text-amber-500"> History</span>
            </h1>
            <p ref={subtitleRef} className="mt-2 text-sm tracking-widest text-amber-600 uppercase font-semibold">
              Your emergency learning sessions
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" />
              <p className="text-sm text-gray-400 tracking-widest uppercase font-medium">Loading sessions…</p>
            </div>
          )}

          {!loading && sessions.length === 0 && (
            <div
              ref={emptyRef}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-2">
                <svg className="w-9 h-9 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-gray-700">No sessions yet</p>
              <p className="text-sm text-gray-400 max-w-xs">Your emergency learning sessions will appear here once completed.</p>
            </div>
          )}

          {!loading && sessions.length > 0 && (
            <div ref={gridRef} className="grid gap-4">
              {sessions.map((item) => (
                <div
                  key={item._id}
                  className="session-card group bg-white rounded-2xl border border-amber-100 shadow-sm shadow-amber-900/5 hover:shadow-lg hover:shadow-amber-900/8 hover:border-amber-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">Tutor</p>
                          <p className="text-base font-bold text-gray-900 leading-tight">{item.tutor?.name || "—"}</p>
                        </div>
                      </div>
                      {item.status && (
                        <span className={`text-[10px] tracking-widest uppercase font-bold px-3 py-1.5 rounded-full border ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {[
                        {
                          icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          ),
                          label: "Subject",
                          value: item.subject,
                        },
                        {
                          icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          ),
                          label: "Duration",
                          value: `${item.duration} mins`,
                        },
                        {
                          icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          ),
                          label: "Fee",
                          value: `₹${item.fee}`,
                        },
                        {
                          icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          ),
                          label: "Date",
                          value: item.completedAt ? new Date(item.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
                        },
                      ].map((stat, i) => (
                        <div key={i} className="bg-amber-50/60 rounded-xl p-3 border border-amber-100/80">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {stat.icon}
                            </svg>
                            <p className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">{stat.label}</p>
                          </div>
                          <p className="text-[13px] font-bold text-gray-800 leading-tight">{stat.value || "—"}</p>
                        </div>
                      ))}
                    </div>

                 

                    {item.rating && (
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < item.rating ? "text-amber-400" : "text-gray-200"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-[11px] text-gray-400 font-medium ml-1">Reviewed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sessions.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-200" />
              <p className="text-[10px] tracking-widest text-amber-400 uppercase font-bold">{sessions.length} session{sessions.length !== 1 ? "s" : ""} total</p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-200" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmergencySessionHistory;
