import { IPost } from "@/types/post";
import React from "react";

interface IProps {
  post: IPost;
}

export default function Post({ post }: IProps) {
  return (
    <div>
      <p>{post.title}</p>
      <p>{post.reactions}</p>
      <p>{post.tags}</p>
    </div>
  );
}
