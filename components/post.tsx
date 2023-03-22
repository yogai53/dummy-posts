import { IPost, TagMap } from "@/types/post";
import React from "react";

function MarkedText({ text, search }: { text: string; search: string }) {
  if (search == "") return <span>{text}</span>;
  if (text == "") return <></>;
  const index = text.toLowerCase().indexOf(search.toLowerCase());
  if (index < 0) return <span>{text}</span>;
  else {
    return (
      <>
        <span>{text.substring(0, index)}</span>
        <mark>{text.substring(index, index + search.length)}</mark>
        <MarkedText
          text={text.substring(index + search.length)}
          search={search}
        />
      </>
    );
  }
}

interface IProps {
  post: IPost;
  search?: string;
  tagMap: TagMap;
}

export default function Post({ post, search, tagMap }: IProps) {
  return (
    <div>
      <p className="text-xl">
        <MarkedText text={post.title} search={search ?? ""} />
      </p>
      <div className="flex justify-between mt-10">
        <div className="flex gap-2">
          {post.tags.map((tag) => (
            <div
              key={tag}
              className={`px-2 border rounded-lg ${
                tagMap[tag] == true ? "bg-slate-200" : ""
              }`}
            >
              {tag}
            </div>
          ))}
        </div>
        <p>
          {post.reactions} {`Reaction${post.reactions > 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
  );
}
