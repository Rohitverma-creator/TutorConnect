import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const ViewResult = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/interview/my`, {
        withCredentials: true,
      });

      console.log("Fetched Interviews:", res.data);

      if (res.data.success) {
        setInterviews(res.data.interviews);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;

  if (!interviews.length)
    return <h2 className="text-center mt-10">No Results Found</h2>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Interview Results
      </h1>

      {interviews.map((interview, i) => (
        <div key={i} className="mb-8 p-5 border rounded-lg shadow bg-white">
          {/* Score Section */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Score: {interview.score} / 10
            </h2>

            <p
              className={`font-bold ${
                interview.result === "pass" ? "text-green-600" : "text-red-600"
              }`}
            >
              Result: {interview.result.toUpperCase()}
            </p>

            <p className="text-gray-700 mt-1">Feedback: {interview.feedback}</p>
          </div>

          {/* Questions & Answers */}
          <div>
            <h3 className="font-semibold mb-2">Questions & Answers:</h3>

            {interview.questions.map((q, index) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <p className="font-medium">
                  Q{index + 1}: {q}
                </p>

                <p className="mt-1">
                  <span className="font-semibold">Your Answer: </span>

                  {interview.answers[index] ? (
                    interview.answers[index].startsWith("data:") ? (
                      <div className="mt-2">
                        <span className="text-green-600 font-medium">
                          🎤 Audio Answer Recorded
                        </span>

                        {/* 🔊 AUDIO PLAYER */}
                        <audio controls className="mt-2 w-full">
                          <source
                            src={interview.answers[index]}
                            type="audio/wav"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ) : (
                      <span className="text-blue-600">
                        {interview.answers[index]}
                      </span>
                    )
                  ) : (
                    <span className="text-red-500">Not Answered</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewResult;
