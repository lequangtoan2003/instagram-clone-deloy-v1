import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

export default function Messages({ selectedUser }) {
  useGetRTM();
  useGetAllMessage();
  const { user } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-24 h-24">
            <AvatarImage
              className="object-cover"
              src={selectedUser?.profilePicture}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg, index) => (
            <div
              className={`flex ${
                msg.senderId === user?._id ? "justify-end" : "justify-start"
              }`}
              key={msg._id}
            >
              <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                  msg.senderId === user?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.message}
              </div>

              {index === messages.length - 1 && <div ref={messagesEndRef} />}
            </div>
          ))}
      </div>
    </div>
  );
}
