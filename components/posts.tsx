import { IPost } from "@/types/post";
import Post from "./post";

interface IProps {
  posts: IPost[];
  total: number;
}

export default function Posts({ posts, total }: IProps) {
  return (
    <div>
      <p className="h3">POST LISTED: {total}</p>
      <div>
        {posts.map((post, index) => (
          <>
            <Post key={post.id} post={post} />
            <div>--------------------------------------------------</div>
          </>
        ))}
      </div>
    </div>
  );
}
