import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useParams, useNavigate } from "react-router-dom";

const FeedbackPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!rating) return alert("Select rating");

    try {
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/api/feedback/create`,
        { bookingId, rating, review },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Feedback submitted");
        navigate("/student/bookings");
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      alert("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Give Feedback
        </h2>

        {/* ⭐ Stars */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Review */}
        <textarea
          placeholder="Write your feedback..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        {/* Button */}
        <button
          onClick={submitFeedback}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;