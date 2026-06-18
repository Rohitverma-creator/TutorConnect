import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import gsap from "gsap";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { backendUrl } from "../App";

function MyProfile() {
  const leftRef = useRef();
  const rightRef = useRef();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "", phone: "", gender: "", dob: "", address: "", class: "",
  });

  const formatAddress = (addr) => {
    if (!addr) return "Not Provided";
    try {
      if (typeof addr === "string" && addr.startsWith("{")) {
        const parsed = JSON.parse(addr);
        return `${parsed.city || ""}${parsed.city && parsed.country ? ", " : ""}${parsed.country || ""}`;
      }
      return addr;
    } catch (e) { return addr; }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dob: user.dob || "",
        address: typeof user.address === "object" ? JSON.stringify(user.address) : user.address || "",
        class: user.class || "",
      });
      setPreview(user.image);
    }
  }, [user]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(leftRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 })
      .fromTo(rightRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.5");
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-10 font-sans relative overflow-hidden">
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <h1 className="text-[20vw] font-black uppercase">STUDENT</h1>
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white border-[8px] border-black shadow-[30px_30px_0px_#b28451]">
        
        {/* LEFT SIDE */}
        <div ref={leftRef} className="lg:col-span-5 bg-black p-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="w-full h-1 bg-[#b28451] mb-8" />
          
          <div className="relative inline-block mb-8">
            <img
              src={preview || user.image}
              className="w-48 h-60 object-cover border-4 border-[#b28451]"
              alt="Profile"
            />
          </div>

          <h1 className="text-5xl font-black text-white uppercase leading-none mb-4">
            {user.name}
          </h1>
          
          <div className="bg-[#b28451] text-white px-6 py-2 font-bold text-sm uppercase tracking-widest">
            {user.class || "Student"}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div ref={rightRef} className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-center">
          
          <div className="space-y-12">
            {/* Main Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-[10px] font-black text-[#b28451] uppercase tracking-widest mb-2">Email Registry</h3>
                <p className="text-lg font-bold text-black break-all">{user.email}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-[#b28451] uppercase tracking-widest mb-2">Phone Link</h3>
                <p className="text-lg font-bold text-black">{user.phone || "Not Verified"}</p>
              </div>
            </div>

            {/* Quick Stats Grid - Fills the middle space */}
            <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-8">
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gender</h3>
                <p className="text-md font-bold text-black uppercase">{user.gender || "Not Set"}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date of Birth</h3>
                <p className="text-md font-bold text-black">{user.dob || "Not Set"}</p>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h3 className="text-[10px] font-black text-[#b28451] uppercase tracking-widest mb-2">Student Address</h3>
              <p className="text-xl font-bold text-black uppercase leading-tight">
                {formatAddress(user.address)}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-gray-400">Profile Completion</span>
                  <span className="text-[10px] font-black uppercase text-[#b28451]">Verified Account</span>
                </div>
                <div className="w-full h-2 bg-gray-100">
                  <div className="h-full bg-black w-[100%]" />
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full md:w-auto bg-black text-white px-12 py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-[#b28451] transition-all active:scale-95 shadow-[10px_10px_0px_#eee]"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-white/98 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="w-full max-w-xl border-[8px] border-black p-10 bg-white shadow-[25px_25px_0px_#b28451]">
            <h2 className="text-4xl font-black uppercase mb-10 italic">Update Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-[#b28451]">Full Name</label>
                <input className="w-full border-b-2 border-black p-2 font-bold text-lg focus:outline-none focus:border-[#b28451]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-[#b28451]">Class</label>
                <input className="w-full border-b-2 border-black p-2 font-bold text-lg focus:outline-none focus:border-[#b28451]" value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#b28451]">Phone</label>
                <input className="w-full border-b-2 border-black p-2 font-bold text-lg focus:outline-none focus:border-[#b28451]" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#b28451]">Gender</label>
                <select className="w-full border-b-2 border-black p-2 font-bold text-lg focus:outline-none bg-transparent" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#b28451]">DOB</label>
                <input type="date" className="w-full border-b-2 border-black p-2 font-bold text-lg focus:outline-none" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-[#b28451]">Address</label>
                <input className="w-full border-b-2 border-black p-2 font-bold text-lg focus:outline-none focus:border-[#b28451]" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-4 mt-12">
               <button onClick={() => setEditing(false)} className="flex-1 border-4 border-black py-4 font-black text-xs uppercase tracking-widest hover:bg-gray-100">Cancel</button>
               <button onClick={handleUpdateProfile} disabled={loading} className="flex-1 bg-black text-white py-4 font-black text-xs uppercase tracking-widest hover:bg-[#b28451] disabled:opacity-50">
                  {loading ? "Saving..." : "Save Now"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;