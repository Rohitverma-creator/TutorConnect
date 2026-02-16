import React from "react";
import { subjectsData } from "../assets/data";
import { Link } from "react-router-dom";

const Subjects = () => {
  return (
    <section className="max-padd-container py-16 xl:py-20">
      <div className="text-center flex flex-col items-center justify-center py-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Explore Learning by Subject
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Discover a wide range of subjects tailored to your academic goals.
          From core fundamentals to advanced topics, choose your preferred
          subject and start learning with expert guidance and structured
          resources.
        </p>
      </div>
      <div className="flexCenter flex-wrap gap-1 sm:gap-14">
        {subjectsData.map((subject, i) => {
          return (
            <Link to={`/subject/${subject.name}`}
              key={i}
              className="flex flex-col items-center gap-2 p-4 hover:shadow-md rounded-lg"
            >
              <img
                src={subject.image}
                alt={subject.name}
                height={55}
                width={55}
              />
              <h5 className="text-sm font-medium text-gray-700">
                {subject.name}
              </h5>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Subjects;
