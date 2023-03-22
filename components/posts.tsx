import { IPost, TagMap } from "@/types/post";
import Post from "./post";

interface IProps {
  posts: IPost[];
  total: number;
  search: string;
  tagMap: TagMap;
}

export default function Posts({ posts, total, search, tagMap }: IProps) {
  return (
    <>
      <p className="sticky top-0 p-2 py-5 text-xl bg-white border-b border-solid">
        POST LISTED: {total}
      </p>
      <div className="mt-10">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="p-4 mb-4 border border-solid rounded-md border-slate-300"
          >
            <Post post={post} search={search} tagMap={tagMap} />
          </div>
        ))}
      </div>
    </>
  );
}
