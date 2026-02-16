import React, { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import Footer from "../components/Footer";

const Tutors = () => {
  const { tutors, navigate, currency } = useContext(AppContext);
  const [activeSubject, setActiveSubject] = useState("All");

  const subjects = ["All", ...new Set(tutors.map((t) => t.subject))];

  const filteredTutors =
    activeSubject === "All"
      ? tutors
      : tutors.filter((t) => t.subject === activeSubject);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 mt-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
          <span className="text-green-800">📘</span>
          Get Started With A Skilled Tutor
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Discover highly qualified tutors dedicated to helping you achieve your
          academic and professional goals. Filter by subject and connect with
          the perfect mentor to elevate your learning experience.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {subjects.map((subject, i) => (
          <button
            key={i}
            onClick={() => setActiveSubject(subject)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition 
              ${
                activeSubject === subject
                  ? "bg-green-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredTutors.map((tutor, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="relative">
              <img
                src={tutor.image}
                alt={tutor.name}
                className="w-full h-60 object-cover"
              />
              <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <FaStar className="text-white text-xs" /> 4.8
              </div>
            </div>

            <div className="p-5">
              <h4 className="text-lg font-semibold text-gray-800">
                {tutor.name}
              </h4>
              <p className="text-gray-500 text-sm mb-3">{tutor.subject}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-green-800 font-bold">
                  {currency}
                  {tutor.price}/hr
                </span>
              </div>

              <button
                onClick={() => {
                  navigate(`/sessions/${tutor.id}`);
                  window.scrollTo(0, 0);
                }}
                className="w-full bg-green-800 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-900 transition"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-24 bg-gradient-to-b from-white to-green-950">
        <Footer />
      </div>
    </section>
  );
};

export default Tutors;
