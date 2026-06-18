import React, { useEffect, useRef, useState } from "react";
import {
  LogOut,
  Clock,
  Crown,
  TrendingUp,
  Star,
  Award,
  ChevronRight,
  Bell,
  User2Icon,
  CheckCircle2,
  Zap,
  Users,
 Info, ShieldCheck, Wifi,AlertCircle, Shield, ZapOff
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import { backendUrl } from "../App";
import { setTutor } from "../redux/tutorSlice";

const TutorDashboard = () => {
  const tutorData = useSelector((state) => state.tutor?.tutor);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = tutorData?.status || "pending";
  const containerRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [available, setAvailable] = useState(tutorData?.available || false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
    totalHours: 0,
    avgRating: 0,
  });
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (status === "approved" && tutorData) {
      let ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.fromTo(
          ".hero-content",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
        )
          .fromTo(
            ".stat-card",
            { scale: 0.9, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "back.out(1.7)",
            },
            "-=0.4",
          )
          .fromTo(
            ".main-card",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            "-=0.2",
          );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [status, tutorData]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/feedback/tutor/${tutorData._id}`,
        );
        const ratingRes = await axios.get(
          `${backendUrl}/api/feedback/rating/${tutorData._id}`,
        );

        if (res.data.success) {
          setReviews(res.data.feedbacks || []);
        }
        if (ratingRes.data.success) {
          setAvgRating(ratingRes.data.avgRating || 0);
        }
      } catch (err) {
        console.log("Error fetching feedback:", err);
      }
    };

    if (tutorData?._id) {
      fetchFeedback();
    }
  }, [tutorData?._id]);

  const logoutHandler = async () => {
    try {
      await axios.get(`${backendUrl}/api/tutor/logout`, {
        withCredentials: true,
      });
      navigate("/tutor-login");
      dispatch(setTutor(null));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/tutor/stats`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchEarnings = async () => {
      const res = await axios.get(`${backendUrl}/api/tutor/earnings`, {
        withCredentials: true,
      });
      if (res.data) {
        setEarnings(res.data.earnings);
      }
    };

    fetchEarnings();
  }, []);

  const toggleAvailability = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/tutor/toggle-availability`,
        {},
        { withCredentials: true },
      );

      setAvailable(res.data.available);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!available) return;

    const interval = setInterval(async () => {
      try {
        await axios.get(`${backendUrl}/api/tutor/ping`, {
          withCredentials: true,
        });
      } catch (err) {}
    }, 30000);

    return () => clearInterval(interval);
  }, [available]);

  useEffect(() => {
  const fetchTutor = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/tutor/profile`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setTutor(res.data.tutor)); 
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchTutor();
}, []);

  if (!tutorData) return <LoadingState />;
  if (status === "rejected") return <RejectedState navigate={navigate} />;
  if (status === "pending") return <PendingState navigate={navigate} />;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white text-slate-900 font-sans"
    >
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase">
              Tutor<span className="text-emerald-500">Connect</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative group">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full border-2 border-black p-0.5 overflow-hidden active:scale-95 transition-transform"
              >
                <img
                  src={tutorData.image}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50">
                  <div className="px-4 py-3 border-b border-slate-50 mb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Logged in as
                    </p>
                    <p className="font-bold text-slate-800">{tutorData.name}</p>
                  </div>
                  <button
                    onClick={() => navigate("/tutor-profile")}
                    className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-slate-50 rounded-2xl flex items-center gap-3 transition-colors"
                  >
                    <User2Icon size={18} className="text-emerald-500" /> My
                    Public Profile
                  </button>
                  <button
                    onClick={() => navigate("/tutor-booking")}
                    className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-slate-50 rounded-2xl flex items-center gap-3 transition-colors"
                  >
                    <Clock size={18} className="text-emerald-500" /> Booking
                    History
                  </button>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl flex items-center gap-3 transition-colors mt-2"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              )}

              <button
                onClick={toggleAvailability}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                  available
                    ? "bg-emerald-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {available ? "🟢 Online" : "🔴 Go Online"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="hero-content mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                Verified Expert
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">
              Welcome back, <br />
              <span className="text-emerald-500">
                {tutorData?.name.split(" ")[0]}
              </span>
              .
            </h1>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 text-right">
              Total Net Earnings
            </p>
            <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl shadow-emerald-100 ring-8 ring-slate-50">
              <div>
                <p className="text-3xl font-black text-white">
                  ₹{earnings?.totalEarnings || 0}
                </p>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Revenue Growth +12%
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total Students",
              val: stats?.totalStudents || 0,
              icon: Users,
              color: "bg-blue-500",
            },
            {
              label: "Sessions Done",
              val: stats?.totalSessions || 0,
              icon: Zap,
              color: "bg-emerald-500",
            },
            {
              label: "Teaching Hours",
              val: stats?.totalHours || 0,
              icon: Clock,
              color: "bg-purple-500",
            },
            {
              label: "Avg Rating",
              val: stats?.avgRating
                ? Number(stats.avgRating).toFixed(1)
                : "0.0",
              icon: Star,
              color: "bg-orange-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="stat-card group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
            >
              <div
                className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6`}
              >
                <stat.icon size={22} />
              </div>

              <h3 className="text-4xl font-black text-slate-900 mb-1">
                {stat.val}
              </h3>

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 main-card">
            <div className="bg-emerald-600 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-3xl font-black mb-4 leading-tight">
                  Your Portfolio is <br />
                  Live & Approved!
                </h3>
                <p className="text-emerald-100 font-medium mb-8 max-w-sm">
                  Students can now see your expertise. Keep your availability
                  updated to get more requests.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <button
                    onClick={() => navigate("/tutor-booking")}
                    className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 transition-all"
                  >
                    Check Bookings <ChevronRight size={16} />
                  </button>

                  <button
                    onClick={() => navigate("/tutor-emergency")}
                    className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 transition-all"
                  >
                    Instants Bookings <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="hidden md:block relative z-10">
                <CheckCircle2
                  size={180}
                  strokeWidth={1}
                  className="text-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                Expertise Level
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-2">
                    <span>Profile Strength</span>
                    <span className="text-emerald-600">92%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">
                      Response Rate
                    </p>
                    <p className="text-lg font-black italic text-slate-800">
                      Ultra Fast
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-white flex items-center justify-center text-center">
    <div>
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">
        Loading Dashboard...
      </p>
    </div>
  </div>
);

const RejectedState = ({ navigate }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
    <div className="max-w-md">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <Award size={40} />
      </div>
      <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase">
        Action Required
      </h2>
      <button
        onClick={() => navigate("/profile")}
        className="w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-transform mt-4"
      >
        Update Now
      </button>
    </div>
  </div>
);


const PendingState = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 antialiased">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
         <div className="flex justify-center mb-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-24 h-24 bg-neutral-900 border border-emerald-500/30 text-emerald-400 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Zap size={44} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            The Final <span className="text-emerald-500">Pitch</span>
          </h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

  
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-amber-500/20 rounded-[2rem] p-6 mb-4 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-amber-500" />
            <p className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.3em]">
              Critical Briefing
            </p>
          </div>

          <ul className="space-y-3">
            {[
              { icon: <Shield size={14}/>, text: "No external assistance allowed" },
              { icon: <Wifi size={14}/>, text: "Ensure stable connection" },
              { icon: <ZapOff size={14}/>, text: "Do not refresh the page" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
                <span className="text-amber-500/60">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

       
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between shadow-inner">
          <div>
            <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Target Threshold</p>
            <p className="text-2xl font-black text-emerald-400">70%</p>
          </div>
          <CheckCircle2 size={32} className="text-emerald-500/20" />
        </div>

        <button
          onClick={() => navigate("/ai-interview")}
          className="group relative w-full mt-8"
        >
       
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          
          <div className="relative flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all duration-300 active:scale-[0.98]">
            Launch Interview
            <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Footer Meta */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-neutral-800" />
          <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.4em]">
            System Ready
          </p>
          <span className="h-px w-8 bg-neutral-800" />
        </div>
      </div>
    </div>
  );
};



export default TutorDashboard;
