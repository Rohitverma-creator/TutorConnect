import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import gsap from "gsap";
import { Zap, Clock, BookOpen, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

const durationOptions = [
  { value: 30, label: "30 min", sublabel: "Quick Doubt", price: 50 },
  { value: 60, label: "1 Hour", sublabel: "Deep Dive", price: 100 },
  { value: 90, label: "1.5 Hours", sublabel: "Full Session", price: 150 },
];

const EmergencyComponent = () => {
  const [subject, setSubject] = useState("");
  const [problemText, setProblemText] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [dots, setDots] = useState(1);

  const cardRef = useRef(null);
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const statusRef = useRef(null);

  const fee = Math.ceil(duration / 30) * 50;

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(heroRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(cardRef.current, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55 }, "-=0.3");
  }, []);

  useEffect(() => {
    if (statusRef.current) {
      gsap.fromTo(statusRef.current, { opacity: 0, scale: 0.95, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" });
    }
  }, [status]);

  useEffect(() => {
    if (status !== "pending") return;
    const iv = setInterval(() => setDots((d) => (d % 3) + 1), 600);
    return () => clearInterval(iv);
  }, [status]);

  useEffect(() => {
    if (!requestId || status !== "pending") return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/emergency/status/${requestId}`, { withCredentials: true });
        if (res.data.status === "accepted") { setStatus("accepted"); clearInterval(interval); }
        if (res.data.status === "expired") { setStatus("expired"); clearInterval(interval); }
      } catch (err) { console.log(err); }
    }, 3000);
    return () => clearInterval(interval);
  }, [requestId, status]);

  const handleSubmit = async () => {
    if (!subject.trim() || !problemText.trim()) { setMessage("Please fill all fields"); return; }
    try {
      setLoading(true); setMessage("");
      const res = await axios.post(`${backendUrl}/api/emergency/create`, { subject, problemText, duration }, { withCredentials: true });
      setRequestId(res.data.requestId);
      setStatus("pending");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyPayment = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/payment/create-order`, { type: "emergency", requestId }, { withCredentials: true });
      if (!res.data.success) { alert("Order failed"); return; }
      const { order, key } = res.data;
      const options = {
        key, amount: order.amount, currency: "INR",
        name: "TutorConnect", description: "Instant Session", order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${backendUrl}/api/payment/verify-payment`,
              { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, type: "emergency", requestId },
              { withCredentials: true }
            );
            if (!verifyRes.data.success) { alert("Payment verification failed"); return; }
            if (!verifyRes.data.meetingLink) { alert("Meeting link not received"); return; }
            window.location.href = verifyRes.data.meetingLink;
          } catch { alert("Something went wrong during verification"); }
        },
        theme: { color: "#F59E0B" },
      };
      new window.Razorpay(options).open();
    } catch { alert("Payment error"); }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Raleway:wght@400;500;600;700;800&display=swap');`}</style>

      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Raleway', sans-serif" }}>

        <div className="h-[3px] fixed top-0 left-0 right-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent z-50" />

        <div ref={heroRef} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[10px] tracking-[3px] text-red-600 uppercase font-black">Emergency Mode</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
            Instant <span className="text-amber-500">Tutor</span>
          </h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase font-semibold mt-2">Get help in minutes · Available 24/7</p>
        </div>

        <div ref={cardRef} className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-xl shadow-amber-900/8 overflow-hidden">
            <div className="h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />

            {(status === "idle" || status === "expired") && (
              <div ref={statusRef} className="p-6 sm:p-7 space-y-5">
                {status === "expired" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-[12px] text-red-600 font-semibold">No tutor available right now. Try again.</p>
                  </div>
                )}

                <div>
                  <label className="text-[9px] tracking-[3px] text-amber-500 uppercase font-black block mb-2">Subject</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300" />
                    <input
                      type="text"
                      placeholder="e.g. Mathematics, Physics…"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5  border border-amber-100 rounded-xl text-sm text-gray-700 placeholder-gray-300 font-medium outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] tracking-[3px] text-amber-500 uppercase font-black block mb-2">Describe Your Problem</label>
                  <textarea
                    placeholder="Explain what you're stuck on…"
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3.5  border border-amber-100 rounded-xl text-sm text-gray-700 placeholder-gray-300 font-medium outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] tracking-[3px] text-amber-500 uppercase font-black block mb-3">Session Duration</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {durationOptions.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDuration(d.value)}
                        className={`relative p-3.5 rounded-xl border-2 text-center transition-all duration-200 active:scale-95 ${
                          duration === d.value
                            ? "border-amber-500 bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-200"
                            : "border-amber-100 bg-white hover:border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        {duration === d.value && (
                          <div className="absolute top-1.5 right-1.5">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <Clock className={`w-4 h-4 mx-auto mb-1.5 ${duration === d.value ? "text-white" : "text-amber-400"}`} />
                        <p className={`text-[11px] font-black ${duration === d.value ? "text-white" : "text-gray-700"}`}>{d.label}</p>
                        <p className={`text-[9px] font-semibold mt-0.5 ${duration === d.value ? "text-white/70" : "text-gray-400"}`}>{d.sublabel}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">Session Fee</p>
                    <p className="text-2xl font-black text-gray-900 mt-0.5" style={{ fontFamily: "'Cinzel', serif" }}>₹{fee}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-200">
                    <Zap className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>

                {message && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-[12px] text-red-600 font-semibold">{message}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full relative overflow-hidden group py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.25em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600" />
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="relative z-10 flex items-center justify-center gap-2.5 text-white">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Finding Tutor…</>
                    ) : (
                      <><Zap className="w-4 h-4 fill-white" />Find Tutor Now</>
                    )}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <p className="text-[10px] text-gray-400 font-medium tracking-wide">Secure · Instant · Available 24/7</p>
                </div>
              </div>
            )}

            {status === "pending" && (
              <div ref={statusRef} className="p-8 text-center space-y-6">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-100 animate-ping opacity-30" />
                  <div className="absolute inset-2 rounded-full border-4 border-amber-200 animate-ping opacity-40" style={{ animationDelay: "0.3s" }} />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-200">
                    <Zap className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>

                <div>
                  <p className="text-[9px] tracking-[4px] text-amber-500 uppercase font-black mb-2">Connecting You</p>
                  <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                    Searching Tutor{".".repeat(dots)}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1.5">We're finding the best available expert for you</p>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left space-y-2.5">
                  {[
                    { label: "Subject", value: subject },
                    { label: "Duration", value: `${duration} minutes` },
                    { label: "Fee", value: `₹${fee}` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">{item.label}</span>
                      <span className="text-[12px] font-black text-gray-700">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-amber-400"
                      style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
                <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
              </div>
            )}

            {status === "accepted" && (
              <div ref={statusRef} className="p-8 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
                  <CheckCircle2 className="w-9 h-9 text-white" />
                </div>

                <div>
                  <p className="text-[9px] tracking-[4px] text-emerald-500 uppercase font-black mb-2">Tutor Found!</p>
                  <h3 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>Ready to Learn</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1.5">Complete payment to start your session instantly</p>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                  <p className="text-[9px] tracking-widest text-gray-400 uppercase font-bold mb-1">Total Due</p>
                  <p className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>₹{fee}</p>
                </div>

                <button
                  onClick={handleEmergencyPayment}
                  className="w-full relative overflow-hidden group py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.25em] transition-all duration-200 active:scale-[0.99]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600" />
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="relative z-10 flex items-center justify-center gap-2.5 text-white">
                    <Zap className="w-4 h-4 fill-white" />
                    Pay & Join Session
                  </span>
                </button>

                <p className="text-[10px] text-gray-400 font-medium tracking-wide">🔒 &nbsp;Secured by Razorpay · 256-bit SSL</p>
              </div>
            )}

            {status === "expired" && null}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmergencyComponent;
