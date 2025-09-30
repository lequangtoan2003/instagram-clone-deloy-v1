import { setUserProfile, setProfileLoading } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      dispatch(setProfileLoading(true));
      try {
        const res = await axios.get(
          `http://localhost:8001/api/v1/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.message) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
        dispatch(setProfileLoading(false));
      }
    };
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, dispatch]);
};
export default useGetUserProfile;
