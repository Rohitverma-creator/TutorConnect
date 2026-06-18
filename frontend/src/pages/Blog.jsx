import React from "react";
import { motion } from "framer-motion";

const blogData = [
  {
    id: 1,
    title: "How to Choose the Right Tutor",
    desc: "Finding the right tutor can transform your learning experience. Discover tips to select the best tutor for your subject and learning style.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: 2,
    title: "5 Study Techniques That Actually Work",
    desc: "Improve your learning efficiency with these proven study techniques used by top students worldwide.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8",
  },
  {
    id: 3,
    title: "Benefits of Online Tutoring",
    desc: "Online tutoring is growing rapidly. Learn how it offers flexibility, convenience, and personalized learning.",
    image:
      "https://plus.unsplash.com/premium_photo-1664372145591-f7cc308ff5da?q=80&w=696&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1584697964403-7d4e2d8f9e71",
  },
  {
    id: 4,
    title: "How to Stay Motivated While Studying",
    desc: "Staying motivated during study sessions can be difficult. Here are simple ways to keep yourself focused.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0",
  },
];

function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-800">Learning Blog</h1>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Explore useful articles, learning strategies, and tips to help you
          improve your studies and choose the right tutor for your goals.
        </p>
      </motion.div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogData.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-44 object-cover group-hover:scale-110 transition duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800">
                {blog.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2">{blog.desc}</p>

              <button className="mt-4 text-pink-600 font-medium hover:underline">
                Read More →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Blog;
