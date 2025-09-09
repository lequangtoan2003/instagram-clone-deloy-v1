import React from "react";
import Posts from "./Posts";

export default function Feed() {
  return (
    <div className="flex-1 flex flex-col my-8 items-center pl-[20%]">
      <Posts />
    </div>
  );
}
