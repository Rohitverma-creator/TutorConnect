import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Image as ImageIcon, X, ArrowRight, MessageSquare } from "lucide-react";
import gsap from "gsap";

const UploadProblemPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tutor } = location.state || {};

  const [problemText, setProblemText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Sharp entrance animation without fuzzy transform artifacts
    gsap.from(".animate-up", {
      opacity: 0,
      y: 10,
      stagger: 0.1,
      duration: 0.4,
      ease: "power2.out",
      clearProps: "all" 
    });

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (preview) URL.revokeObjectURL(preview);
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleContinue = () => {
    if (!problemText.trim()) return alert("Please explain your challenge first!");
    navigate("/book-student-session", { state: { tutor, problemText, file } });
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4 antialiased">
      {/* Container with High-Contrast Sharp Edges */}
      <div className="w-full max-w-4xl bg-white rounded-[1.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row border border-[#E0E0E0]">
        
        {/* Left Side: Solid Onyx Black Panel */}
        <div className="md:w-1/3 bg-[#000000] p-10 text-white flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-[#222222] border border-[#333333] rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
              <MessageSquare className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-black leading-[1.1] mb-6 tracking-tight uppercase">
              Tell us your <br/> Challenge.
            </h2>
            <p className="text-[#A0A0A0] text-sm leading-relaxed font-bold">
              Precision details allow <span className="text-white">{tutor?.name || 'the Expert'}</span> to architect your solution.
            </p>
          </div>
          
          <div className="mt-12 p-5 bg-[#111111] rounded-xl border border-[#222222]">
            <p className="text-[10px] font-black text-[#666666] uppercase tracking-[0.2em] mb-3">Verified Expert</p>
            <div className="flex items-center gap-3">
              <img 
                src={tutor?.image} 
                className="w-12 h-12 rounded-lg object-cover border border-[#333333]" 
                alt="Tutor" 
              />
              <span className="font-black text-white text-sm uppercase tracking-tighter">{tutor?.name}</span>
            </div>
          </div>
        </div>

        {/* Right Side: High-Contrast White Workspace */}
        <div className="md:w-2/3 p-8 md:p-14 bg-white">
          <div className="animate-up mb-10">
            {/* Pure Black Label - Zero Blur */}
            <label className="text-[12px] font-black text-[#000000] uppercase tracking-[0.15em] block mb-6 antialiased">
              Describe your doubt in detail
            </label>
            
            {/* Pure Black Textarea */}
            <textarea
              placeholder="What exactly are you struggling with?"
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              className="w-full min-h-[250px] p-0 text-2xl font-bold text-[#000000] placeholder-[#D0D0D0] border-none outline-none resize-none bg-transparent leading-snug antialiased"
              autoFocus
            />
          </div>

          {/* Attachment Section: Sharp Outlines */}
          <div className="animate-up flex flex-wrap items-center gap-4 py-8 border-t-2 border-[#F5F5F5]">
            {!preview ? (
              <label className="flex items-center gap-3 px-6 py-4 bg-white hover:bg-black text-black hover:text-white rounded-xl cursor-pointer transition-all duration-200 border-2 border-black font-black uppercase text-[10px] tracking-widest active:scale-95 shadow-sm">
                <ImageIcon size={18} />
                <span>Add Image Attachment</span>
                <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
              </label>
            ) : (
              <div className="relative group">
                <img 
                  src={preview} 
                  className="w-36 h-36 rounded-xl object-cover border-2 border-black shadow-2xl" 
                  alt="Preview" 
                />
                <button 
                  onClick={() => {setFile(null); setPreview(null);}}
                  className="absolute -top-3 -right-3 bg-black text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Final Action Button: Solid Black */}
          <div className="animate-up mt-8">
            <button
              onClick={handleContinue}
              className="group w-full md:w-auto px-16 py-6 bg-[#000000] hover:bg-[#222222] text-white rounded-xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              Continue <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UploadProblemPage;