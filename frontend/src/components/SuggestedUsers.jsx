import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { updateFollowStatus } from "@/redux/authSlice";

export default function SuggestedUsers() {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const followOrUnfollow = async (targetUserId, isFollowing) => {
    try {
      const res = await axios.post(
        `https://instagram-clone-deloy-v1.onrender.com/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(
          updateFollowStatus({
            userId: user._id,
            targetUserId,
            isFollowing,
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Error following/unfollowing user");
    }
  };

  console.log("suggestedUsers", suggestedUsers);
  return (
    <div className="my-10">
      <div className="flex justify-between items-center text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      <div className="flex gap-3 flex-col my-4">
        {suggestedUsers.map((suggestedUser) => {
          const isFollowing = user?.following?.includes(suggestedUser._id);
          return (
            <div
              key={suggestedUser._id}
              className="flex justify-between items-center"
            >
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${suggestedUser?._id}`}>
                  <Avatar>
                    <AvatarImage
                      className="object-cover"
                      src={suggestedUser?.profilePicture}
                      alt="post_image"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col gap-1 font-bold text-sm">
                  <h1 className="font-semibold text-sm">
                    <Link to={`/profile/${suggestedUser?._id}`}>
                      {suggestedUser?.username}
                    </Link>
                  </h1>
                  <span className="font-normal text-gray-600 text-sm">
                    {suggestedUser?.bio || "Bio here..."}
                  </span>
                </div>
              </div>
              <div
                className={`text-xs font-bold cursor-pointer pl-2 ${
                  isFollowing
                    ? "text-gray-600 hover:text-gray-800"
                    : "text-[#3BADF8] hover:text-[#3495d6]"
                }`}
                onClick={() => followOrUnfollow(suggestedUser._id, isFollowing)}
              >
                <div className="pl-4 max-w-8">
                  {isFollowing ? "Unfollow" : "Follow"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
