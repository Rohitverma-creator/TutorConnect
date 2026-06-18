import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

function StudentRegister() {
  const cardRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);

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
        stagger: 0.04, 
        duration: 0.5, 
        ease: "power2.out", 
        force3D: false,
        onComplete: function() {
          gsap.set(this.targets(), { clearProps: "transform, opacity" });
        }
      }, "-=0.5");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !studentClass) {
      alert("Please fill required fields");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("class", studentClass);
      formData.append("gender", gender);
      formData.append("dob", dob);
      formData.append("address", JSON.stringify({ city, country }));
      if (image) formData.append("image", image);

      await axios.post(`${backendUrl}/api/student/register`, formData);
      navigate("/student-login");
    } catch (error) {
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-black antialiased">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-black"></div>

      <div ref={cardRef} className="w-full max-w-[480px]">
        
        <div className="text-center mb-8">
          <div className="reveal inline-block px-3 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-[3px] mb-4">
            Join the Network
          </div>
          <h1 className="reveal text-4xl font-black tracking-tighter mb-1">
            Tutor <span className="text-emerald-500">Connect</span>
          </h1>
          <p className="reveal text-gray-400 text-[10px] font-medium tracking-widest uppercase">Student Registration</p>
        </div>

        <div className="bg-white rounded-[35px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4 reveal">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@email.com"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="reveal space-y-1">
              <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Security Code</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 reveal">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91..."
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Class/Grade</label>
                <input
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="12th / Grad"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 reveal">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Gender</label>
                <input
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Male/Female"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Birth Date</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pb-1 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 reveal">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
              />
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="reveal">
              <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1 mb-2 block">Profile Picture</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-black file:text-white hover:file:bg-emerald-600 transition-all cursor-pointer"
              />
            </div>

            <button
              disabled={isLoading}
              className="reveal w-full bg-black hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 uppercase tracking-[2px] text-[10px] flex items-center justify-center gap-3 active:scale-95"
            >
              {isLoading ? "Processing..." : "Create Account"}
            </button>
          </form>

          <div className="reveal mt-6 text-center">
            <button 
              onClick={() => navigate('/student-login')}
              className="text-[9px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
            >
              Already a member? Login
            </button>
          </div>
        </div>
      </div>

      <div className="reveal mt-10 opacity-10">
         <p className="text-[8px] font-bold tracking-[5px] uppercase">© 2026 TutorConnect Infrastructure</p>
      </div>
    </div>
  );
}

export default StudentRegister;