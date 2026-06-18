import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const TutorSignUp = () => {
  const cardRef = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    qualification: "",
    subject: "",
    experience: "",
    about: "",
    fees: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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
        stagger: 0.03, 
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      const res = await axios.post(`${backendUrl}/api/tutor/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        navigate("/tutor-dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-black antialiased overflow-x-hidden">
      
      <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>

      <div ref={cardRef} className="w-full max-w-[520px]">
        
        <div className="text-center mb-8">
          <div className="reveal inline-block px-3 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-[3px] mb-4">
            Expert Onboarding
          </div>
          <h1 className="reveal text-4xl font-black tracking-tighter mb-1">
            Tutor <span className="text-emerald-500">Connect</span>
          </h1>
          <p className="reveal text-gray-400 text-[10px] font-medium tracking-widest uppercase">Create Expert Profile</p>
        </div>

        <div className="bg-white rounded-[35px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-5 reveal">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="E.g. Dr. Smith"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="expert@email.com"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 reveal">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Qualification</label>
                <input
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="PhD, Masters..."
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 reveal">
              <div className="space-y-1 col-span-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Subject</label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Math"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
              <div className="space-y-1 col-span-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Exp.</label>
                <input
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
              <div className="space-y-1 col-span-1">
                <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Fees/hr</label>
                <input
                  name="fees"
                  type="number"
                  value={formData.fees}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="reveal space-y-1">
              <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Work Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Studio or City address"
                className="w-full pb-2 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            <div className="reveal space-y-1">
              <label className="text-[9px] font-extrabold text-black uppercase tracking-[2px] ml-1">Teaching Philosophy</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="1"
                placeholder="Briefly describe your style..."
                className="w-full pb-1 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all text-sm font-medium resize-none"
                required
              />
            </div>

            <div className="reveal flex items-center gap-4 py-2">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[8px] text-gray-300 font-bold uppercase">Photo</div>
                )}
              </div>
              <input
                type="file"
                id="tutor-image"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="tutor-image" className="text-[9px] font-bold bg-gray-50 hover:bg-black hover:text-white px-4 py-2 rounded-full border border-gray-100 cursor-pointer transition-all uppercase tracking-widest">
                Upload Image
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="reveal w-full bg-black hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 uppercase tracking-[2px] text-[10px] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Synchronizing..." : "Initialize Expert Profile"}
            </button>
          </form>

          <div className="reveal mt-6 text-center">
            <button 
              onClick={() => navigate('/tutor-login')}
              className="text-[9px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
            >
              Already Registered? Login
            </button>
          </div>
        </div>
      </div>

      <div className="reveal mt-10 opacity-10">
         <p className="text-[8px] font-bold tracking-[5px] uppercase">© 2026 TutorConnect Global Systems</p>
      </div>
    </div>
  );
};

export default TutorSignUp;