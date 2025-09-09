import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function Comment({ comment }) {
  return (
    <div>
      <div className="flex gap-3 items-center py-2">
        <Avatar>
          <AvatarImage
            className="object-cover w-full h-full"
            src={comment?.author?.profilePicture}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm">
          {comment?.author?.username}
          <span className="font-normal pl-1">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
}
