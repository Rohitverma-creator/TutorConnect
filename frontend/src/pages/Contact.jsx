import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">

      {/* Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-800">
          Contact Us
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Have questions or need help finding the right tutor? 
          Reach out to us and our team will assist you as soon as possible.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">

        {/* Contact Info */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-pink-100 rounded-full text-pink-600">
              <FaPhoneAlt />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Phone</h4>
              <p className="text-gray-500">+91 9876543210</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-pink-100 rounded-full text-pink-600">
              <FaEnvelope />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Email</h4>
              <p className="text-gray-500">support@tutorconnect.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-pink-100 rounded-full text-pink-600">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Location</h4>
              <p className="text-gray-500">Lucknow, Uttar Pradesh, India</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="bg-white shadow-lg rounded-xl p-8 space-y-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Message</label>
            <textarea
              rows="4"
              placeholder="Write your message..."
              className="w-full mt-1 p-3 border rounded-lg outline-none resize-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </div>
  );
}

export default Contact;