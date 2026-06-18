import { useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const useGetCurrentUser = () => {
  const dispatch = useDispatch(); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${backendUrl}/api/student/me`,
          {
            withCredentials: true,
          }
        );

   
        dispatch(setUserData(result.data.user));

      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;