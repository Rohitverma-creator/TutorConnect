import React from "react";
import { FaUserTie, FaClock, FaUserFriends } from "react-icons/fa";
import { BsClipboardFill } from "react-icons/bs";
const Feature = () => {
  return (
    <section className="mx-auto max-w-[1140px] px-6 relative bottom-12 ">
      <div className=" flex flex-wrap gap-x-4 bg-light rounded-3xl p-8">
        <div className="flex flex-col gap-y-2 p-4 rounded-xl max-w-[233px] bg-secondary ">
          <FaClock className="text-xl mb-2" />
          <h5 className="text-xl font-semibold text-gray-800 mb-2">
            24/7 Availibility
          </h5>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our platform is available 24/7, allowing students to access learning
            materials, connect with instructors, and continue their studies
            anytime, anywhere at their convenience.
          </p>
        </div>

        <div className="flex flex-col gap-y-2 p-4 rounded-xl max-w-[233px] ">
          <FaUserTie className="text-xl mb-2" />
          <h5 className="text-xl font-semibold text-gray-800 mb-2">
            Qualified Instructors
          </h5>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our instructors are experienced professionals with strong academic
            knowledge and industry expertise. They focus on practical learning
            and provide personalized guidance to help students succeed.
          </p>
        </div>

        <div className="flex flex-col gap-y-2 p-4 rounded-xl max-w-[233px] ">
          <BsClipboardFill className="text-xl mb-2" />
          <h5 className="text-xl font-semibold text-gray-800 mb-2">
            Interactive WhiteBoard
          </h5>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our interactive whiteboard allows instructors and students to
            collaborate in real-time, draw diagrams, explain concepts visually,
            and make learning more engaging and easy to understand.
          </p>
        </div>

        <div className="flex flex-col gap-y-2 p-4 rounded-xl max-w-[233px] ">
          <FaUserFriends className="text-xl mb-2" />
          <h5 className="text-xl font-semibold text-gray-800 mb-2">
            1-on-1 live sessions
          </h5>
          <p className="text-gray-600 text-sm leading-relaxed">
            We offer personalized one-on-one live sessions where students
            receive individual attention, clear doubt resolution, and customized
            learning support to improve their understanding and performance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Feature;
