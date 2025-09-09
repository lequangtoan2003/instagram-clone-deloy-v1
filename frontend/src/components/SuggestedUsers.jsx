import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

export default function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex justify-between items-center text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      <div className="flex gap-3 flex-col my-4">
        {suggestedUsers.map((user) => {
          return (
            <div key={user._id} className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage
                      className="object-cover"
                      src={user?.profilePicture}
                      alt="post_image"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col gap-1 font-bold text-sm">
                  <h1 className="font-semibold text-sm">
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </h1>
                  <span className="font-normal text-gray-600 text-sm">
                    {user?.bio || "Bio here..."}
                  </span>
                </div>
              </div>
              <div className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6] pl-2">
                Follow
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
