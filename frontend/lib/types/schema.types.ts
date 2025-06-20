export interface BaseTimestamp {
  updatedAt: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  image: string;
}

export interface Post extends BaseTimestamp {
  id: string;
  content: string;
  likeCount: number;
  commentCount: number;
  author: User;
}

export interface Comment extends BaseTimestamp {
  id: string;
  content: string;
  likeCount: number;
  author: User;
}
