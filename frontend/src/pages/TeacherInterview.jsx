import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Mic,
  CheckCircle,
  Award,
  Clock,
  MicOff,
  ChevronRight,
  ChevronLeft,
  Zap,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

const TeacherInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interviewId, setInterviewId] = useState(null); 

  const navigate = useNavigate();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Animation refs
  const questionRef = useRef(null);
  const recordBtnRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // GSAP Entrance Animation
  useEffect(() => {
    if (questions.length > 0) {
      gsap.fromTo(
        [questionRef.current, recordBtnRef.current, progressRef.current],
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [questions.length]);

  // Question Change Animation
  useEffect(() => {
    if (questionRef.current) {
      gsap.fromTo(questionRef.current, 
        { scale: 0.95, opacity: 0.8 }, 
        { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [step]);

  // Timer Pulse Animation
  useEffect(() => {
    if (timerRef.current && isRecording) {
      gsap.to(timerRef.current, {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }
  }, [timeLeft, isRecording]);

  // ================= FETCH QUESTIONS =================
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/interview/generate`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        const formatted = data.questions.map((q) =>
          typeof q === "object" ? q.question : q
        );

        setQuestions(formatted);
        setInterviewId(data.interviewId); 
      } else {
        alert(data.message); 
        navigate("/");
      }
    } catch (error) {
      console.log("Error fetching questions:", error);
    }
  };

  // ================= TIMER =================
  useEffect(() => {
    let interval;

    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isRecording) {
      stopRecording();
    }

    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);

  // ================= RECORDING =================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setAnswers((prev) => {
            const newArr = [...prev];
            newArr[step - 1] = reader.result;
            return newArr;
          });
        };

        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimeLeft(30);
      
      // Record button animation
      gsap.to(recordBtnRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    } catch (err) {
      alert("Mic permission denied ❌");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Success bounce
      gsap.fromTo(recordBtnRef.current, 
        { scale: 1 }, 
        { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 }
      );
    }
  };

  const handleNext = async () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      await submitInterview();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitInterview = async () => {
    if (!interviewId) {
      alert("Something went wrong. Please restart interview.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/interview/submit`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          answers,
          interviewId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[step - 1];
  const currentAnswer = answers[step - 1];

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6 shadow-lg"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Questions...</h2>
          <p className="text-gray-600 text-sm">Preparing your teacher interview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-lg mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-sm border hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-1">
              <Shield className="w-3.5 h-3.5" />
              Secure Interview
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Teacher Interview
            </h1>
          </div>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className="text-center pt-16">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200/50 border-4 border-white">
              <Award className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Complete!
            </h1>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed px-4">
              Results available shortly
            </p>
            <button
              onClick={() => navigate("/view-result")}
              className="w-full max-w-xs mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 rounded-2xl font-semibold text-white shadow-2xl shadow-emerald-200/50 hover:shadow-emerald-300/60 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                View Results
                <TrendingUp className="w-4 h-4" />
              </span>
            </button>
          </div>
        ) : (
          /* Main Interview Screen */
          <div className="space-y-6">
            {/* Progress */}
            <div ref={progressRef} className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2.5 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full shadow-md transition-all duration-700 ease-out"
                  style={{ width: `${(step / questions.length) * 100}%` }}
                />
              </div>
              <div className="text-xs font-semibold text-gray-700 min-w-[50px] text-center">
                {step}/{questions.length}
              </div>
            </div>

            {/* Question Card */}
            <div 
              ref={questionRef}
              className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/50 mt-0.5">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight flex-1">
                  {currentQuestion}
                </h2>
              </div>
            </div>

            {/* Timer & Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/30">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div ref={timerRef}>
                    <div className="text-2xl font-mono font-bold text-gray-900">
                      {timeLeft.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">seconds</div>
                  </div>
                </div>
                {currentAnswer && (
                  <div className="flex items-center gap-1.5 bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl shadow-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-emerald-800 text-sm">Recorded</span>
                  </div>
                )}
              </div>

              {/* Record Button */}
              <button
                ref={recordBtnRef}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
                className={`group relative w-full p-5 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  isRecording
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-300/40 hover:shadow-red-400/50"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-300/40 hover:shadow-blue-400/50"
                } hover:-translate-y-1 active:scale-95 border border-transparent`}
              >
                {isRecording ? (
                  <>
                    <div className="w-6 h-6 bg-white/30 rounded-full animate-ping"></div>
                    <span>Stop</span>
                    <MicOff className="w-6 h-6" />
                  </>
                ) : (
                  <>
                    <Mic className="w-7 h-7 group-hover:scale-110 transition-transform" />
                    <span>{timeLeft === 30 ? "Start" : "Again"}</span>
                    <Zap className="w-5 h-5 opacity-90" />
                  </>
                )}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className="flex-1 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 font-medium text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              
              <button
                onClick={handleNext}
                disabled={loading || (!currentAnswer && step === questions.length)}
                className={`flex-1 p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg text-sm ${
                  loading || (!currentAnswer && step === questions.length)
                    ? "bg-gray-100 border border-gray-300 text-gray-500 cursor-not-allowed shadow-sm"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-purple-300/50 hover:-translate-y-1 shadow-indigo-300/40 group"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : step === questions.length ? (
                  "Finish"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Compact Progress Dots */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl border border-gray-200">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
              step === index + 1
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 scale-125 shadow-md"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setStep(index + 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherInterview;