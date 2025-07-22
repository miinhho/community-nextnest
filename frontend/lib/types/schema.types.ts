export interface BaseTimestamp {
  updatedAt: Date
  createdAt: Date
}

export interface UserSchema {
  id: string
  name: string
  image: string
}

export interface PostSchema extends BaseTimestamp {
  id: string
  content: string
  likeCount: number
  commentCount: number
  author: UserSchema
}

export interface CommentSchema extends BaseTimestamp {
  id: string
  content: string
  likeCount: number
  author: UserSchema
}
