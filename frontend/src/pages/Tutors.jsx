import React, { useEffect, useRef, useState, useMemo } from "react";
import { MapPin, Briefcase, Star, Zap, LayoutGrid, Sparkles, User, SearchX } from "lucide-react";
import gsap from "gsap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const subjects = [
  { name: "All", icon: <LayoutGrid size={18} /> },
  { name: "Math", icon: "📐" },
  { name: "Physics", icon: "⚛️" },
  { name: "Chemistry", icon: "🧪" },
  { name: "English", icon: "📚" },
  { name: "Computer", icon: "💻" },
  { name: "Biology", icon: "🧬" },
  { name: "Hindi", icon: "📝" },
];

const TutorMarketplace = () => {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const domainRef = useRef(null);
  const gridRef = useRef(null);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const { tutors } = useSelector((state) => state.tutor);

  const filteredTutors = useMemo(() => {
    if (!tutors) return [];
    if (selectedSubject === "All") return tutors;
    return tutors.filter((t) => t.subject?.toLowerCase() === selectedSubject.toLowerCase());
  }, [selectedSubject, tutors]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(heroRef.current, { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(domainRef.current?.children ? Array.from(domainRef.current.children) : [], { opacity: 0, y: 16, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05 }, "-=0.3");
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".tutor-card");
    gsap.fromTo(cards, { opacity: 0, y: 28, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: "back.out(1.3)" });
  }, [filteredTutors]);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Raleway:wght@400;500;600;700;800&display=swap');`}</style>

      <div ref={mainRef} className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20" style={{ fontFamily: "'Raleway', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div ref={heroRef} className="mb-14">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-200">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-500">Exclusive Access</span>
              <div className="h-px w-12 bg-gradient-to-r from-amber-300 to-transparent" />
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
              Choose Your <br />
              <span className="text-amber-500">Expertise.</span>
            </h1>
            <p className="mt-4 text-sm text-gray-400 tracking-widest uppercase font-semibold">Find the perfect tutor for every subject</p>
          </div>

          <div className="mb-16">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-100">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Browse Domains</h3>
              <span className="text-[10px] tracking-widest text-amber-500 uppercase font-bold">{subjects.length - 1} subjects</span>
            </div>

            <div ref={domainRef} className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {subjects.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 text-center flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                    selectedSubject === sub.name
                      ? "bg-gradient-to-br from-amber-500 to-amber-600 border-amber-500 shadow-lg shadow-amber-200"
                      : "bg-white border-amber-100 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100"
                  }`}
                >
                  <span className="text-2xl leading-none block">{sub.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-tight whitespace-nowrap ${selectedSubject === sub.name ? "text-white" : "text-gray-500"}`}>
                    {sub.name}
                  </span>
                  {selectedSubject === sub.name && (
                    <div className="absolute top-2 right-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                Top <span className="text-amber-500">{selectedSubject}</span> Tutors
              </h2>
              <p className="text-[11px] text-gray-400 tracking-widest uppercase font-semibold mt-1">{filteredTutors.length} expert{filteredTutors.length !== 1 ? "s" : ""} available</p>
            </div>
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-amber-200 to-transparent hidden sm:block" />
          </div>

          {filteredTutors.length > 0 ? (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-amber-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-7 h-7 text-amber-300" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Experts Available</p>
              <p className="text-xs text-gray-300 mt-1">Try a different subject</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const handleHover = (enter) => {
    gsap.to(cardRef.current, {
      y: enter ? -4 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className="tutor-card bg-white rounded-2xl border border-amber-100 shadow-sm shadow-amber-900/5 overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-amber-900/8 hover:border-amber-200"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="h-[2px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />

     <div className="relative h-72 overflow-hidden bg-neutral-50 flex items-end justify-center group">
  <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none flex items-center justify-center overflow-hidden">
    <span className="text-9xl font-black uppercase tracking-tighter leading-none italic rotate-12 scale-150 text-amber-900">
      {tutor.subject}
    </span>
  </div>

  <div className="absolute -bottom-10 w-2/3 h-1/2 bg-gradient-to-t from-amber-100/60 to-transparent blur-3xl rounded-full" />

  {tutor.image ? (
    <img
      src={tutor.image}
      className="relative z-10 w-full h-[110%] object-contain object-bottom transition-all duration-700 group-hover:scale-105 origin-bottom"
      alt={tutor.name}
      loading="lazy"
    />
  ) : (
    <div className="relative z-10 w-full h-full flex items-center justify-center bg-amber-50/30">
      <div className="w-24 h-24 rounded-[2.5rem] bg-white border-2 border-amber-200 flex items-center justify-center shadow-2xl rotate-3">
        <User className="w-12 h-12 text-amber-500" />
      </div>
    </div>
  )}

  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl shadow-amber-900/5 border border-amber-100">
      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
    </div>
  </div>

  <div className="absolute top-4 left-4 z-20">
    <div className="bg-amber-500 px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/10">
      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
        {tutor.subject}
      </span>
    </div>
  </div>

  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
</div>

      <div className="p-4">
        <h3 className="text-lg font-black text-gray-900 truncate leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>{tutor.name}</h3>
        <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.25em] mt-0.5">{tutor.subject} Specialist</p>

        <div className="flex gap-2 my-4">
          <div className="flex-1 bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-center">
            <MapPin className="w-3 h-3 mx-auto text-amber-400 mb-1" />
            <span className="text-[8px] font-black text-gray-500 uppercase block truncate">{tutor.address || "Local"}</span>
          </div>
          <div className="flex-1 bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-center">
            <Briefcase className="w-3 h-3 mx-auto text-amber-400 mb-1" />
            <span className="text-[8px] font-black text-gray-500 uppercase block">{tutor.experience}Y Exp</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-0.5">
          <span className="text-[10px] font-semibold text-gray-400">Starting at</span>
          <div className="text-right">
            <span className="text-xl font-black text-gray-900 tracking-tight">₹{tutor.fees}</span>
            <span className="text-[10px] text-gray-400 font-medium">/hr</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => navigate(`/view-tutor/${tutor._id}`, { state: { tutor } })}
            className="w-full py-2.5 rounded-xl border-2 border-gray-900 text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-all duration-200 active:scale-95"
          >
            <User size={12} />
            View Profile
          </button>

          <button
            onClick={() => navigate("/upload-problem", { state: { tutor } })}
            className="w-full relative overflow-hidden group py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 transition-all duration-200 active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <span className="relative z-10 flex items-center gap-2">
              Instant Book
              <Zap className="w-3 h-3 fill-white" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorMarketplace;
