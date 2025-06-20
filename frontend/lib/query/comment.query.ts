import { CommentSchema } from '@/lib/types/schema.types';

interface CommentData extends CommentSchema {
  postId: string;
  replies: CommentSchema[];
}
