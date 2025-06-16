export const commentCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    likesCount: { type: 'number' },
  },
};

export const userCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    image: { type: 'string', nullable: true },
  },
};

export const postCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    likeCount: { type: 'number' },
  },
};
