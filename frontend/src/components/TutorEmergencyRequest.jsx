import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { gsap } from "gsap";

const TutorEmergencyRequest = () => {
  const [requests, setRequests] = useState([]);
  const [prevIds, setPrevIds] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [history, setHistory] = useState([]);

  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const activeRef = useRef(null);
  const requestsRef = useRef(null);
  const historyRef = useRef(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/emergency/pending`, { withCredentials: true });
      const newRequests = res.data.requests || [];
      const newIds = newRequests.map((r) => r._id);
      if (newIds.some((id) => !prevIds.includes(id)) && prevIds.length > 0) {
        new Audio("/notification.mp3").play();
      }
      setPrevIds(newIds);
      setRequests(newRequests);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/emergency/tutor-sessions`, { withCredentials: true });
      setActiveSession(res.data.active || null);
      setHistory(res.data.history || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchSessions();
    const interval = setInterval(() => {
      fetchRequests();
      fetchSessions();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(badgeRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4 }, "-=0.3")
      .fromTo([requestsRef.current, historyRef.current], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.2");
  }, []);

  useEffect(() => {
    if (activeSession && activeRef.current) {
      gsap.fromTo(activeRef.current, { opacity: 0, y: -16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" });
    }
  }, [activeSession]);

  useEffect(() => {
    if (!requestsRef.current) return;
    const cards = requestsRef.current.querySelectorAll(".req-card");
    gsap.fromTo(cards, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" });
  }, [requests]);

  const acceptRequest = async (id) => {
    await axios.post(`${backendUrl}/api/emergency/accept`, { requestId: id }, { withCredentials: true });
    fetchRequests();
    fetchSessions();
  };

  const rejectRequest = async (id) => {
    await axios.post(`${backendUrl}/api/emergency/reject`, { requestId: id }, { withCredentials: true });
    fetchRequests();
  };

  const completeSession = async (id) => {
    await axios.post(`${backendUrl}/api/emergency/complete`, { requestId: id }, { withCredentials: true });
    fetchSessions();
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Raleway:wght@400;500;600;700&display=swap');`}</style>

      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30" style={{ fontFamily: "'Raleway', sans-serif" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div ref={titleRef}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-amber-300 to-transparent" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                Tutor <span className="text-amber-500">Live Dashboard</span>
              </h1>
              <p className="text-sm text-gray-400 tracking-widest uppercase font-semibold mt-1">AI-powered instant doubt solving</p>
            </div>

            <div ref={badgeRef} className="flex items-center gap-2.5 bg-white border border-amber-100 px-4 py-2.5 rounded-2xl shadow-sm shadow-amber-900/5 self-start sm:self-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm font-bold text-gray-700">Live System</span>
            </div>
          </div>

          {activeSession && (
            <div
              ref={activeRef}
              className="bg-white rounded-2xl border border-amber-200 shadow-lg shadow-amber-900/8 overflow-hidden mb-10"
            >
              <div className="h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />
              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <p className="text-[10px] tracking-[3px] text-red-500 uppercase font-bold">Live Session</p>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{activeSession.subject}</h2>
                <p className="text-gray-500 italic text-sm mb-5 leading-relaxed">"{activeSession.problemText}"</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={activeSession.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="relative overflow-hidden group px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Meeting
                  </a>
                  <button
                    onClick={() => completeSession(activeSession._id)}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-gray-700 border border-gray-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2" ref={requestsRef}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-gray-900 tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                  Incoming Requests
                </h2>
                <span className="text-[10px] tracking-widest uppercase font-bold bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-full">
                  {requests.length} pending
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-400">Waiting for students…</p>
                  <p className="text-xs text-gray-300 mt-1">New requests will appear here automatically</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((r) => (
                    <div
                      key={r._id}
                      className="req-card bg-white rounded-2xl border border-amber-100 shadow-sm shadow-amber-900/5 hover:shadow-md hover:border-amber-200 hover:shadow-amber-900/8 transition-all duration-300 overflow-hidden"
                    >
                      <div className="h-[2px] bg-gradient-to-r from-amber-400 to-transparent" />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-base font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>{r.subject}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {r.duration} mins
                              </span>
                              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                ₹{r.fee}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] tracking-widest uppercase font-bold bg-amber-50 text-amber-500 border border-amber-200 px-2.5 py-1 rounded-full flex-shrink-0">New</span>
                        </div>

                        <p className="text-gray-500 italic text-[13px] leading-relaxed mb-4 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                          "{r.problemText}"
                        </p>

                        <div className="flex gap-2.5">
                          <button
                            onClick={() => acceptRequest(r._id)}
                            className="flex-1 relative overflow-hidden group py-2.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-300 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Accept
                          </button>
                          <button
                            onClick={() => rejectRequest(r._id)}
                            className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-gray-500 border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                          >
                            Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div ref={historyRef}>
              <h2 className="text-sm font-black text-gray-900 tracking-widest uppercase mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Your Performance
              </h2>

              <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-6 mb-4 shadow-lg shadow-amber-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 translate-x-8 -translate-y-8" />
                <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 -translate-x-4 translate-y-4" />
                <p className="text-[10px] tracking-[3px] uppercase font-bold text-white/70 mb-1 relative">Sessions Completed</p>
                <p className="text-5xl font-black text-white relative" style={{ fontFamily: "'Cinzel', serif" }}>
                  {Array.isArray(history) ? history.length : 0}
                </p>
                <p className="text-xs text-white/60 mt-1 relative font-medium">Total earnings record</p>
              </div>

              <div className="space-y-2.5">
                {Array.isArray(history) && history.length === 0 && (
                  <div className="bg-white rounded-xl border border-amber-100 p-5 text-center">
                    <p className="text-xs text-gray-400 font-medium">No sessions yet</p>
                  </div>
                )}
                {Array.isArray(history) && history.slice(0, 5).map((s, i) => (
                  <div key={s._id} className="bg-white rounded-xl border border-amber-100 shadow-sm p-3.5 flex items-center justify-between hover:border-amber-200 transition-all duration-150">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-black text-amber-500">{i + 1}</span>
                      </div>
                      <p className="text-[13px] font-bold text-gray-800">{s.subject}</p>
                    </div>
                    <span className="text-[9px] tracking-widest uppercase font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">Done</span>
                  </div>
                ))}
              </div>

              {Array.isArray(history) && history.length > 5 && (
                <p className="text-center text-[11px] text-gray-400 font-medium mt-3 tracking-widest uppercase">+{history.length - 5} more sessions</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TutorEmergencyRequest;
