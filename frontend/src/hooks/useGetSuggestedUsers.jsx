import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8001/api/v1/user/suggested",
          {
            withCredentials: true,
          }
        );
        if (res.data.message) {
          console.log("sgu", res.data);
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllSuggestedUsers();
  }, []);
};
export default useGetSuggestedUsers;
