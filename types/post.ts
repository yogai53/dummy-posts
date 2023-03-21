export type Tag = string;

export type TagMap = Record<Tag, true | false>;

export interface IPost {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: Tag[];
  reactions: number;
}

export interface IPostsData {
  posts: IPost[];
  total: number;
  skip: number;
  limit: number;
}
