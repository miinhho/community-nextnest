import { Comment, Post, User } from '@prisma/client';

type SelectionUtil<Model> = Partial<Record<keyof Model, boolean>>;

export const commentSelections: SelectionUtil<Comment> = {
  id: true,
  content: true,
  likesCount: true,
};

export const postSelections: SelectionUtil<Post> = {
  id: true,
  content: true,
  likeCount: true,
};

export const userSelections: SelectionUtil<User> = {
  id: true,
  name: true,
  image: true,
};
