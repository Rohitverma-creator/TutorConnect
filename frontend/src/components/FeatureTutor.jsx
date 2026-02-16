import React, { useContext } from "react";
import tutor1 from "../assets/tutor1.png";
import tutor2 from "../assets/tutor2.png";
import tutor3 from "../assets/tutor3.png";
import { FaStar } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const FeatureTutor = () => {
  const { tutors, navigate } = useContext(AppContext);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      
      <div className="text-center mb-14">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          Made For Professionals
        </h3>

        <div className="flex justify-center -space-x-3 mb-4">
          <img src={tutor1} alt="" className="w-11 h-11 rounded-full ring-2 ring-white shadow-md object-cover" />
          <img src={tutor2} alt="" className="w-11 h-11 rounded-full ring-2 ring-white shadow-md object-cover" />
          <img src={tutor3} alt="" className="w-11 h-11 rounded-full ring-2 ring-white shadow-md object-cover" />
        </div>

        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Trusted by experienced instructors and industry professionals who are passionate about delivering quality education.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tutors.slice(0, 5).map((tutor, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden shadow-md group hover:shadow-xl transition duration-300"
          >
            <div className="relative">
              <img
                src={tutor.image}
                alt={tutor.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>

              <div className="absolute bottom-4 left-4 text-white">
                <span className="flex items-center gap-1 text-xs bg-yellow-500 px-2 py-1 rounded-md font-semibold">
                  <FaStar className="text-white text-xs" /> 4.8
                </span>
                <h5 className="text-lg font-semibold mt-2">
                  {tutor.name}
                </h5>
                <p className="text-sm text-white/80">
                  {tutor.subject}
                </p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-end bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300">
              <div className="w-full p-4 flex flex-col gap-3">
                <button
                  className="bg-white text-gray-800 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  onClick={() => {
                    navigate(`/sessions/${tutor.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  View Profile
                </button>

                <button
                  className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    navigate(`/tutors`);
                    window.scrollTo(0, 0);
                  }}
                >
                  Explore Tutors
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default FeatureTutor;
