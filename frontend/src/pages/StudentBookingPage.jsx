import React, { useEffect, useState, useRef } from "react";
import { ShieldCheck, Star, Zap, Clock, User, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addBooking } from "../redux/userSlice";
import { backendUrl } from "../App";
import gsap from "gsap";

const StudentBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: studentData } = useSelector((state) => state.user);
  const { tutor, problemText, file } = location.state || {};

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const heroRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);
    setSlots(Array.from({ length: 8 }, (_, i) => {
      const slot = new Date(nextHour);
      slot.setHours(nextHour.getHours() + i);
      return slot;
    }));
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(heroRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(leftRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.55 }, "-=0.3")
      .fromTo(rightRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.55 }, "-=0.45");
  }, []);

  const handleBooking = async () => {
    try {
      const formData = new FormData();
      formData.append("student", studentData._id);
      formData.append("tutor", tutor._id);
      formData.append("date", selectedSlot.toISOString().split("T")[0]);
      formData.append("startTime", selectedSlot.toISOString());
      formData.append("meetingLink", "https://meet.google.com/test");
      formData.append("price", tutor.fees || 500);
      formData.append("problemText", problemText);
      if (file) formData.append("image", file);
      const res = await axios.post(`${backendUrl}/api/bookings/create-booking`, formData, { withCredentials: true });
      if (res.data.success) {
        dispatch(addBooking(res.data.booking));
        navigate("/my-session");
      }
    } catch {
      alert("Booking failed");
    }
  };

  const handlePayment = async () => {
    if (!studentData) return alert("Login required");
    if (!selectedSlot) return alert("Select slot");
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/payment/create-order`, { type: "booking", amount: tutor.fees }, { withCredentials: true });
      if (!res.data.success || !res.data.order) { alert("Failed to create order"); return; }
      const { order, key } = res.data;
      const options = {
        key, amount: order.amount, currency: "INR",
        name: "TutorConnect", description: "Session Booking", order_id: order.id,
        handler: async (response) => {
          try {
            const verify = await axios.post(`${backendUrl}/api/payment/verify-payment`, { ...response, type: "booking" }, { withCredentials: true });
            if (verify.data.success) await handleBooking();
            else alert("Payment verification failed");
          } catch { alert("Verification error"); }
        },
        theme: { color: "#F59E0B" },
      };
      new window.Razorpay(options).open();
    } catch { alert("Payment error"); }
    finally { setLoading(false); }
  };

  if (!tutor) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" />
        <p className="text-xs tracking-widest text-amber-500 uppercase font-bold">Loading…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Raleway:wght@400;500;600;700;800&display=swap');`}</style>

      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20" style={{ fontFamily: "'Raleway', sans-serif" }}>

        <div className="h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent w-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div ref={heroRef} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-[10px] tracking-[3px] text-amber-600 uppercase font-black">Instant Booking</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
              Book Session with
              <br />
              <span className="text-amber-500">{tutor.name}</span>
            </h1>
            <p className="mt-3 text-sm text-gray-400 tracking-widest uppercase font-semibold">
              {tutor.subject} &nbsp;·&nbsp; ₹{tutor.fees}/hour
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">

            <div ref={leftRef} className="lg:col-span-5 space-y-5">

              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm shadow-amber-900/5 overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />
                <div className="p-6">
                  <p className="text-[9px] tracking-[3px] text-amber-500 uppercase font-black mb-4">Your Tutor</p>
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-shrink-0">
                      {tutor.image ? (
                        <img src={tutor.image} className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-100 shadow-md" alt={tutor.name} />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-amber-300" />
                        </div>
                      )}
                      <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg p-1 shadow-md">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900 leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>{tutor.name}</h2>
                      <p className="text-[10px] tracking-widest text-amber-500 uppercase font-bold mt-0.5">{tutor.subject} Specialist</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                        <span className="text-[10px] text-gray-400 font-semibold ml-1">4.9</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">Session Fee</p>
                        <p className="text-2xl font-black text-gray-900 mt-0.5" style={{ fontFamily: "'Cinzel', serif" }}>₹{tutor.fees}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">Per Hour</p>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mt-0.5 shadow-md shadow-amber-200 ml-auto">
                          <Zap className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm shadow-amber-900/5 overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />
                <div className="p-6">
                  <p className="text-[9px] tracking-[3px] text-amber-500 uppercase font-black mb-3">Your Problem</p>
                  <div className=" rounded-xl p-4 border border-gray-100">
                    <p className="text-[13px] text-gray-600 leading-relaxed italic">"{problemText}"</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm shadow-amber-900/5 p-5">
                <div className="space-y-3">
                  {[
                    { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: "100% Secure Payment", sub: "Razorpay encrypted" },
                    { icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, label: "Instant Confirmation", sub: "Session booked immediately" },
                    { icon: <Clock className="w-4 h-4 text-blue-400" />, label: "Flexible Scheduling", sub: "Pick your preferred slot" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3  rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-gray-800">{item.label}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div ref={rightRef} className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm shadow-amber-900/5 overflow-hidden sticky top-24">
                <div className="h-[2px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[9px] tracking-[3px] text-amber-500 uppercase font-black mb-1">Schedule</p>
                      <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>Select Time Slot</h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span className="text-[9px] text-amber-600 font-black uppercase tracking-widest">Today</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                    {slots.map((slot, i) => {
                      const isSelected = selectedSlot?.getTime() === slot.getTime();
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedSlot(slot);
                            gsap.fromTo(`#slot-${i}`, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
                          }}
                          id={`slot-${i}`}
                          className={`relative p-3 rounded-xl border-2 text-center transition-all duration-200 active:scale-95 overflow-hidden group ${
                            isSelected
                              ? "border-amber-500 bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-200"
                              : "border-amber-100 bg-white hover:border-amber-300 hover:bg-amber-50"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <p className={`text-[11px] font-black tracking-wide ${isSelected ? "text-white" : "text-gray-500"}`}>
                            {slot.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <p className={`text-[9px] font-semibold mt-0.5 ${isSelected ? "text-white/70" : "text-gray-300"}`}>
                            {slot.toLocaleDateString([], { weekday: "short" })}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {selectedSlot && (
                    <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-200">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] tracking-widest text-amber-600 uppercase font-black">Slot Selected</p>
                        <p className="text-[13px] font-bold text-gray-800">
                          {selectedSlot.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })} &nbsp;·&nbsp;
                          {selectedSlot.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-amber-100 pt-5 mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-gray-400 font-semibold">Session Fee</span>
                      <span className="text-[13px] font-bold text-gray-700">₹{tutor.fees}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-gray-400 font-semibold">Platform Fee</span>
                      <span className="text-[13px] font-bold text-emerald-600">Free</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-amber-100">
                      <span className="text-[13px] font-black text-gray-900">Total</span>
                      <span className="text-xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>₹{tutor.fees}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={!selectedSlot || loading}
                    className="w-full relative overflow-hidden group py-4 rounded-xl font-black text-[13px] uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
                    style={{ background: !selectedSlot || loading ? "#d1d5db" : undefined }}
                  >
                    {selectedSlot && !loading && (
                      <>
                        <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600" />
                        <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="absolute inset-0 shadow-lg shadow-amber-200 group-hover:shadow-amber-300 transition-shadow duration-200 rounded-xl" />
                      </>
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2.5 text-white">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white" />
                          Confirm & Pay ₹{tutor.fees}
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-center text-[10px] text-gray-400 font-medium mt-3 tracking-wide">
                    🔒 &nbsp;Secured by Razorpay &nbsp;·&nbsp; 256-bit SSL encrypted
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default StudentBookingPage;
