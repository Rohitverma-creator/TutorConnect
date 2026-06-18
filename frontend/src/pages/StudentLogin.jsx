import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function StudentLogin() {
  const cardRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

export const backendUrl = "https://tutorconnect-3-dpps.onrender.com";


  useEffect(() => {
    gsap.set([cardRef.current, ".reveal"], {
      clearProps: "all",
      force3D: false,
    });

    const tl = gsap.timeline();

    tl.fromTo(
      cardRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        force3D: false,
      },
    ).fromTo(
      ".reveal",
      { y: 10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        force3D: false,
        onComplete: function () {
          gsap.set(this.targets(), { clearProps: "transform, opacity" });
        },
      },
      "-=0.5",
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/student/login`,
        { email, password },
        { withCredentials: true },
      );

      dispatch(setUserData({ user: res.data.user, token: res.data.token }));


      navigate("/");
    } catch (error) {
      alert("Access Denied");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-black antialiased overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>

      <div
        ref={cardRef}
        className="w-full max-w-[370px]"
        style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
      >
        <div className="text-center mb-8">
          <div className="reveal inline-block px-3 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-[3px] mb-4">
            Authorized
          </div>
          <h1 className="reveal text-4xl font-black tracking-tighter mb-1">
            Tutor <span className="text-emerald-500">Connect</span>
          </h1>
          <p className="reveal text-gray-400 text-[10px] font-medium tracking-widest uppercase">
            Student Portal
          </p>
        </div>

        <div className="bg-white rounded-[30px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-9 transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="reveal">
              <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] mb-2 block">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="identity@tutorconnect.com"
                className="w-full pb-2 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all text-sm font-medium placeholder:text-gray-300"
                required
              />
            </div>

            <div className="reveal">
              <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] mb-2 block">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full pb-2 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all text-sm font-medium placeholder:text-gray-300"
                required
              />
            </div>

            <button
              disabled={isLoading}
              className="reveal w-full bg-black hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 uppercase tracking-[2px] text-[10px] flex items-center justify-center gap-3"
            >
              {isLoading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="reveal mt-8 text-center">
            <button
              onClick={() => navigate("/student-register")}
              className="text-[9px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
            >
              Don't have an account? Register
            </button>
          </div>
        </div>

        <div className="reveal mt-10 flex justify-center">
          <button
            onClick={() => navigate("/tutor-login")}
            className="group flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-50"
          >
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[2px]">
              Are you an Expert?
            </span>
            <span className="text-[10px] font-black text-black group-hover:text-emerald-500 transition-colors border-b border-black group-hover:border-emerald-500">
              LOGIN AS TUTOR →
            </span>
          </button>
        </div>
      </div>

      <div className="reveal mt-12 opacity-10">
        <p className="text-[8px] font-bold tracking-[5px] uppercase">
          © 2026 TutorConnect
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;
