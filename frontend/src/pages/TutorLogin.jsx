import React, { useState, useEffect, useRef, use } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useDispatch } from "react-redux";
import { setTutor } from "../redux/tutorSlice";

const TutorLogin = () => {
  const cardRef = useRef();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch();

  useEffect(() => {
    gsap.set([cardRef.current, ".reveal"], { clearProps: "all", force3D: false });

    const tl = gsap.timeline();
    tl.fromTo(cardRef.current, 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", force3D: false }
    )
    .fromTo(".reveal", 
      { y: 10, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.05, 
        duration: 0.5, 
        ease: "power2.out",
        force3D: false,
        onComplete: function() {
          gsap.set(this.targets(), { clearProps: "transform, opacity" });
        }
      }, "-=0.5");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/tutor/login`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setTutor(res.data));
        navigate("/tutor-dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-black antialiased overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>

      <div ref={cardRef} className="w-full max-w-[370px]" style={{ backfaceVisibility: "hidden" }}>
        
        <div className="text-center mb-8">
          <div className="reveal inline-block px-3 py-1 rounded-full border border-gray-100  text-black text-[9px] font-bold uppercase tracking-[3px] mb-4">
            Expert Gateway
          </div>
          <h1 className="reveal text-4xl font-black tracking-tighter mb-1">
            Tutor <span className="text-emerald-500">Connect</span>
          </h1>
          <p className="reveal text-gray-400 text-[10px] font-medium tracking-widest uppercase italic">Expert Portal</p>
        </div>

        <div className="bg-white rounded-[30px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="reveal">
              <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] mb-2 block ml-1">Work Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="expert@tutorconnect.com"
                className="w-full pb-2 bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none transition-all text-sm font-medium placeholder:text-gray-300"
                required
              />
            </div>

            <div className="reveal">
              <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] mb-2 block ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pb-2 bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none transition-all text-sm font-medium placeholder:text-gray-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="reveal w-full bg-black hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 uppercase tracking-[2px] text-[10px] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Login as Expert"}
            </button>
          </form>

          <div className="reveal mt-8 text-center">
            <button 
              onClick={() => navigate('/tutor-register')}
              className="text-[9px] font-bold text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest"
            >
              Become a Tutor
            </button>
          </div>
        </div>

        <div className="reveal mt-10 flex justify-center">
          <button
            onClick={() => navigate("/student-login")}
            className="group flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-50"
          >
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[2px]">Student?</span>
            <span className="text-[10px] font-black text-black group-hover:text-emerald-500 transition-colors border-b border-black group-hover:border-emerald-500">
              SWITCH TO STUDENT PORTAL →
            </span>
          </button>
        </div>

      </div>

      <div className="reveal mt-12 opacity-10">
         <p className="text-[8px] font-bold tracking-[5px] uppercase">© 2026 TutorConnect Global</p>
      </div>
    </div>
  );
};

export default TutorLogin;