import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/bg.png";

const Hero = () => {
  return (
    <section
      className="w-full min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* dark overlay for text readability */}
      <div className="absolute inset-0 bg-[#0f4c53]/85"></div>

      <div className="relative max-w-7xl mx-auto px-8 pt-32">
        {/* LEFT CONTENT ONLY */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 border border-white/30 text-white px-4 py-1 rounded-full text-sm mb-6">
            <span className="text-lime-400 font-semibold">#1</span>
            Trusted Online Tutoring Platform
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Personalized 1-on-1 Tutoring <br />
            for Every Learner, Anytime, <br />
            Anywhere
          </h1>

          <p className="mt-6 text-white/80 text-lg">
            Experience expert guidance with our advanced platform that connects
            students with top tutors across a range of subjects built for
            results, flexibility, and growth.
          </p>

    <div className="mt-10 flex flex-wrap gap-4">
  <Link
    to="/emergency"
    className="px-7 py-3 rounded-full border border-white text-white hover:bg-white hover:text-[#0f4c53] transition"
  >
    Instant Tutor
  </Link>

  <Link
    to="/tutor"
    className="px-7 py-3 rounded-full bg-lime-400 text-[#0f4c53] font-semibold hover:bg-lime-300 transition"
  >
    Book Session
  </Link>

  <Link
    to="/smart-tutor"
    className="px-7 py-3 rounded-full bg-white text-[#0f4c53] font-semibold hover:bg-gray-200 transition"
  >
    🤖 Smart Tutor
  </Link>
</div>

    
        </div>
            
      </div>

      
    </section>
  );
};

export default Hero;
