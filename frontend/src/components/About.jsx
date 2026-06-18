import React from "react";
import { FaUsers, FaChalkboardTeacher, FaClock, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const About = () => {
  const navigate = useNavigate()
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Learn Anytime, Anywhere
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Teach What You Love
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Share your expertise with students across the globe. Join our
            growing community of passionate educators and make a real impact
            through personalized and interactive learning experiences.
          </p>

          <ul className="space-y-3 text-gray-700 text-sm">
            <li>✔ Join a Global Teaching Community</li>
            <li>✔ Teach on Your Own Schedule</li>
            <li>✔ Conduct One-on-One & Live Sessions</li>
            <li>✔ Earn While Making an Impact</li>
          </ul>

          <button onClick={()=>navigate("/tutor-register")}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Become a Tutor
          </button>
        </div>

        <div className="p-8 rounded-2xl shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Do You Have Formal Teaching Experience?
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Whether you're a certified educator or an industry professional with
            deep subject knowledge, we welcome passionate mentors who are
            dedicated to delivering quality education and guiding students
            toward success.
          </p>
        </div>
      </div>

      <div className="text-center mb-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          Why Choose Smart Tutor Connect?
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          We combine technology, flexibility, and expert mentorship to create a
          seamless digital learning experience for students worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <FaChalkboardTeacher className="text-3xl text-blue-600 mx-auto mb-4" />
          <h4 className="font-semibold text-lg mb-2">Expert Tutors</h4>
          <p className="text-gray-500 text-sm">
            Learn from experienced educators and industry professionals.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <FaUsers className="text-3xl text-blue-600 mx-auto mb-4" />
          <h4 className="font-semibold text-lg mb-2">Personalized Learning</h4>
          <p className="text-gray-500 text-sm">
            Tailored one-on-one sessions focused on your goals.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <FaClock className="text-3xl text-blue-600 mx-auto mb-4" />
          <h4 className="font-semibold text-lg mb-2">24/7 Flexibility</h4>
          <p className="text-gray-500 text-sm">
            Schedule sessions at your convenience anytime.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <FaStar className="text-3xl text-blue-600 mx-auto mb-4" />
          <h4 className="font-semibold text-lg mb-2">Top Rated Platform</h4>
          <p className="text-gray-500 text-sm">
            Trusted by students and professionals worldwide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
