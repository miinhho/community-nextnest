/**
 * 댓글의 공통 Swagger 스키마 정의
 *
 * API 응답에서 댓글 정보를 문서화할 때 사용됩니다.
 */
export const commentCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    likesCount: { type: 'number' },
  },
};

/**
 * 사용자의 공통 Swagger 스키마 정의
 *
 * API 응답에서 사용자 정보를 문서화할 때 사용됩니다.
 * 민감한 정보는 제외된 공개 정보만 포함합니다.
 */
export const userCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    image: { type: 'string', nullable: true },
  },
};

/**
 * 게시글의 공통 Swagger 스키마 정의
 *
 * API 응답에서 게시글 정보를 문서화할 때 사용됩니다.
 */
export const postCommonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    likeCount: { type: 'number' },
  },
};
