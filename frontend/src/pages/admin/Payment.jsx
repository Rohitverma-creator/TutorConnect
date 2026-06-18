import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";

const Payment = () => {
  const [payments, setPayments] = useState([]);



  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/admin/payments`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Payments</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Tutor</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    {p.student?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    {p.tutor?.name || "N/A"}
                  </td>
                  <td className="p-3">₹{p.amount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        p.status === "success"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;