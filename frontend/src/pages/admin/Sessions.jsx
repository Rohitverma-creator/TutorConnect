import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/admin/sessions`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setSessions(res.data.sessions);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Sessions</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Tutor</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {sessions.length > 0 ? (
              sessions.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">
                    {s.student?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    {s.tutor?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    {s.subject || "N/A"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        s.status === "completed"
                          ? "bg-green-500"
                          : s.status === "accepted"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sessions;