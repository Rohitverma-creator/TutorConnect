import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import Card from "../../components/admin/Card";
import Table from "../../components/admin/Table";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  PlayCircle, 
  IndianRupee, 
  BarChart3, 
  ArrowUpRight, 
  Globe,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sessionsRes, paymentsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/admin/stats`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/admin/sessions`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/admin/payments`, { withCredentials: true }),
        ]);

        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (sessionsRes.data.success) setSessions(sessionsRes.data.sessions.slice(0, 5));
        if (paymentsRes.data.success) setPayments(paymentsRes.data.payments.slice(0, 5));
      } catch (err) { console.log(err); }
    };
    fetchData();
  }, [backendUrl]);

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents || 0,
      icon: <Users size={20} />,
      trend: "+12.5%",
      color: "amber"
    },
    {
      label: "Expert Tutors",
      value: stats.totalTutors || 0,
      icon: <Globe size={20} />,
      trend: "Verified",
      color: "amber"
    },
    {
      label: "Total Sessions",
      value: stats.totalSessions || 0,
      icon: <PlayCircle size={20} />,
      trend: "Live Now",
      color: "amber"
    },
    {
      label: "Platform Revenue",
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <IndianRupee size={20} />,
      trend: "Total Gross",
      color: "amber"
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 lg:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* SIMPLE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-950">
              DASHBOARD<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg mt-1">Platform Performance Overview</p>
          </div>

          <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <button 
              onClick={() => navigate("/admin-sessions")}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              Sessions
            </button>
            <button 
              onClick={() => navigate("/admin-payments")}
              className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all"
            >
              Finance
            </button>

             <button 
              onClick={() => navigate("/admin-feedbacks")}
              className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all"
            >
              Feedback
            </button>
          </div>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* MAIN ANALYTICS SECTION */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 mb-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Growth Velocity</h3>
                <p className="text-sm text-slate-400">Monthly Transaction Volume</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Clock size={16} /> Real-time Update
            </div>
          </div>

          {/* Clean Analytics Visual */}
          <div className="h-72 w-full bg-slate-50 rounded-[2.5rem] flex items-end justify-around px-10 pb-8 border border-slate-100">
            {[30, 50, 40, 80, 60, 90, 100].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full max-w-[60px]">
                <div 
                  style={{ height: `${h}%` }} 
                  className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-2xl shadow-lg shadow-amber-100 transition-all hover:scale-110"
                ></div>
                <span className="text-[10px] font-bold text-slate-400">MAY 0{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DATA TABLES SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SESSIONS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 px-4">
              <h3 className="font-black text-slate-900 tracking-tight">RECENT SESSIONS</h3>
              <ArrowUpRight size={20} className="text-slate-300" />
            </div>
            <Table 
              columns={[
                { header: "Student", render: (s) => <span className="font-bold text-sm">{s.student?.name || "N/A"}</span> },
                { header: "Tutor", render: (s) => <span className="text-slate-500 text-sm">{s.tutor?.name || "N/A"}</span> },
                { 
                  header: "Status", 
                  render: (s) => (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {s.status}
                    </span>
                  ) 
                },
              ]} 
              data={sessions} 
            />
          </div>

          {/* PAYMENTS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 px-4">
              <h3 className="font-black text-slate-900 tracking-tight">FINANCIAL LOGS</h3>
              <ArrowUpRight size={20} className="text-slate-300" />
            </div>
            <Table 
              columns={[
                { header: "User", render: (p) => <span className="font-bold text-sm">{p.student?.name || "N/A"}</span> },
                { header: "Value", render: (p) => <span className="text-slate-900 font-black tracking-tighter text-sm">₹{p.amount}</span> },
                { 
                  header: "Auth", 
                  render: (p) => (
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{p.status}</span>
                    </div>
                  ) 
                },
              ]} 
              data={payments} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;