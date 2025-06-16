export const CommentCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    likesCount: { type: 'number' },
  },
};

export const UserCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    image: { type: 'string', nullable: true },
  },
};

export const PostCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    likeCount: { type: 'number' },
  },
};
