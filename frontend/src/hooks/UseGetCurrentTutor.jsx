import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTutor, setLoading } from "../redux/tutorSlice";
import { backendUrl } from "../App";

const useGetCurrentTutor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        dispatch(setLoading(true));

        const res = await axios.get(
          `${backendUrl}/api/tutor/get-current-tutor`,
          { withCredentials: true },
        );

        if (res.data.success) {
          dispatch(setTutor(res.data.tutor));
        }
      } catch (error) {
        console.log("ERROR:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTutor();
  }, [dispatch]);
};

export default useGetCurrentTutor;
