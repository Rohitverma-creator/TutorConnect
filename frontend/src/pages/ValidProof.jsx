import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { backendUrl } from "../App";
import {
  Upload,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
  User,
  ShieldCheck,
  Clock,
  Calendar,
  Mail,
  BookOpen
} from "lucide-react";

const ValidProof = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const tutor = useSelector((state) => state.tutor.tutor);
  const currentUser = user || tutor;

  const [booking, setBooking] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/bookings/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setBooking(res.data.booking);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const otherPerson = currentUser?.role === "tutor" ? booking?.student : booking?.tutor;
  const canUpload = currentUser?.role === "student" 
    ? !booking?.isStudentUploaded 
    : !booking?.isTutorUploaded;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const url = currentUser?.role === "tutor"
        ? `${backendUrl}/api/bookings/${id}/tutor-proof`
        : `${backendUrl}/api/bookings/${id}/student-proof`;

      await axios.post(url, formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      alert("✅ Proof uploaded successfully!");
      setFile(null);
      setUploadProgress(0);
      fetchBooking();
    } catch (err) {
      alert("❌ Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-xs mx-auto space-y-4">
        {/* Header */}
        <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-lg shadow-md mb-2">
            <ShieldCheck className="w-5 h-5 text-pink-500" />
            <h1 className="text-lg font-bold text-gray-900">Proof</h1>
          </div>
        </div>

        {/* Session Info */}
        <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">{otherPerson?.name}</h2>
              {otherPerson?.email && (
                <div className="flex items-center gap-1 mt-1">
                  <Mail size={10} className="text-pink-500" />
                  <span className="text-xs text-gray-600 truncate">{otherPerson.email}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <BookOpen size={10} />
              <span>{booking.subject || 'General'}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              <span>{booking.startTime}</span>
            </span>
          </div>
        </div>

        {/* Proof Images */}
        <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-lg">
          <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">Proofs</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Tutor */}
            <div className="text-center">
              <div className={`p-2 rounded-lg mb-1 shadow-sm ${booking.isTutorUploaded ? 'bg-purple-100 border border-purple-300' : 'bg-white border'}`}>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-md mx-auto flex items-center justify-center">
                  {booking.tutorProofImage ? (
                    <img src={booking.tutorProofImage} className="w-full h-full rounded-md object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-white" />
                  )}
                </div>
                <p className="text-xs font-medium text-gray-800">Tutor</p>
              </div>
              {booking.isTutorUploaded && <CheckCircle className="w-5 h-5 text-purple-500 mx-auto" />}
            </div>

            {/* Student */}
            <div className="text-center">
              <div className={`p-2 rounded-lg mb-1 shadow-sm ${booking.isStudentUploaded ? 'bg-emerald-100 border border-emerald-300' : 'bg-white border'}`}>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-md mx-auto flex items-center justify-center">
                  {booking.studentProofImage ? (
                    <img src={booking.studentProofImage} className="w-full h-full rounded-md object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-white" />
                  )}
                </div>
                <p className="text-xs font-medium text-gray-800">Student</p>
              </div>
              {booking.isStudentUploaded && <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-lg">
          {canUpload ? (
            <form onSubmit={handleUpload} className="space-y-3">
              <label className="block w-full p-4 border-2 border-dashed border-pink-200 rounded-lg bg-white hover:border-pink-400 hover:shadow-md transition-all cursor-pointer group text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                  disabled={loading}
                />
                {file ? (
                  <>
                    <ImageIcon className="w-8 h-8 mx-auto text-pink-500 mb-2" />
                    <p className="text-xs font-semibold text-gray-900 truncate">{file.name}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-gray-400 group-hover:text-pink-500 mb-2 transition-all" />
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-pink-600">Select Image</p>
                  </>
                )}
              </label>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-900">Uploaded!</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidProof;