import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

export default function Posts() {
  const { posts } = useSelector((store) => store.post);
  console.log(posts);
  return (
    <div>
      {posts.map((post) => {
        return <Post post={post} key={post._id} />;
      })}
    </div>
  );
}
