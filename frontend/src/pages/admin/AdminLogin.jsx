import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ShieldCheck, Mail, Lock, LogIn } from "lucide-react";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const cardRef = useRef(null);
  const heroRef = useRef(null);
  const fieldsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(heroRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(cardRef.current, { opacity: 0, y: 32, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.55 }, "-=0.3")
      .fromTo(fieldsRef.current?.children ? Array.from(fieldsRef.current.children) : [], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.09 }, "-=0.2");
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post("https://tutorconnect-3-dpps.onrender.com
/api/admin/login", form, { withCredentials: true });
      if (res.data.success) {
        navigate("/admin-dashboard");
      } else {
        setError(res.data.message || "Login failed");
        gsap.fromTo(cardRef.current, { x: -10 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" });
      }
    } catch {
      setError("Invalid credentials. Please try again.");
      gsap.fromTo(cardRef.current, { x: -10 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Raleway:wght@400;500;600;700;800&display=swap');`}</style>

      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Raleway', sans-serif" }}>

        <div className="h-[3px] fixed top-0 left-0 right-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent z-50" />

        <div ref={heroRef} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-200">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
            Admin <span className="text-amber-500">Portal</span>
          </h1>
          <p className="text-[10px] tracking-[3px] text-amber-500 uppercase font-black mt-1.5">Restricted Access Only</p>
        </div>

        <div ref={cardRef} className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-xl shadow-amber-900/8 overflow-hidden">
            <div className="h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />

            <div className="p-7">
              <div ref={fieldsRef} className="space-y-4">

                <div>
                  <label className="text-[9px] tracking-[3px] text-amber-500 uppercase font-black block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      placeholder="admin@tutorconnect.com"
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-amber-100 rounded-xl text-sm text-gray-700 placeholder-gray-300 font-medium outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] tracking-[3px] text-amber-500 uppercase font-black block mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300 pointer-events-none" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••••"
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-amber-100 rounded-xl text-sm text-gray-700 placeholder-gray-300 font-medium outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <p className="text-[12px] text-red-600 font-semibold">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full relative overflow-hidden group py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.25em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] mt-2"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600" />
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="relative z-10 flex items-center justify-center gap-2.5 text-white">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Verifying…</>
                    ) : (
                      <><LogIn className="w-4 h-4" />Login to Dashboard</>
                    )}
                  </span>
                </button>

              </div>

              <div className="flex items-center justify-center gap-2 mt-5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <p className="text-[10px] text-gray-400 font-medium tracking-wide">256-bit SSL Encrypted · Secure Access</p>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-300 font-medium tracking-widest uppercase mt-5">
            TutorConnect · Admin System
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
