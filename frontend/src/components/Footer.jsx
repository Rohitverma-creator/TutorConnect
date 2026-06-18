import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-950 text-gray-300 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">cd

          <div>
            <h3 className="text-white text-2xl font-bold mb-4">
              Smart Tutor Connect
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering students through personalized and flexible learning.
              Connect with expert tutors and unlock your full potential.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/tutors" className="hover:text-white transition">Tutors</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white transition cursor-pointer">Help Center</li>
              <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white transition cursor-pointer">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <div className="bg-green-900 p-3 rounded-full hover:bg-green-700 transition cursor-pointer">
                <FaFacebookF />
              </div>
              <div className="bg-green-900 p-3 rounded-full hover:bg-green-700 transition cursor-pointer">
                <FaTwitter />
              </div>
              <div className="bg-green-900 p-3 rounded-full hover:bg-green-700 transition cursor-pointer">
                <FaInstagram />
              </div>
              <div className="bg-green-900 p-3 rounded-full hover:bg-green-700 transition cursor-pointer">
                <FaLinkedinIn />
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-green-800 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Smart Tutor Connect. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
