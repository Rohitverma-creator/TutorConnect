// hooks/useGetAllTeacher.js

import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setTutors } from "../redux/tutorSlice";

const useGetAllTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { tutors } = useSelector((state) => state.tutor); 

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${backendUrl}/api/tutor/approved-tutors`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setTutors(res.data.tutors));
      }

     
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return { tutors, loading, error }; 
};

export default useGetAllTeacher;