'use client';

import { usePostLikeQuery, usePostQuery } from "@/lib/query/post.query";
import { LikeStatus } from "@/lib/types/status.types";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share } from "lucide-react";
import { useCallback, useState } from "react";
import { LexicalViewer } from "./editor/LexicalViewer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

interface Props {
  postId: string;
}

export const Post = ({ postId }: Props) => {
  const { data } = usePostQuery(postId);
  const { author, content } = data!;
  const { mutate: postLikeMutation } = usePostLikeQuery();
  const [liked, setLiked] = useState(false);

  const handleLike = useCallback(() => {
    postLikeMutation(postId, {
      onSuccess: (data) => {
        if (data.status === LikeStatus.PLUS) {
          alert("좋아요를 눌렀습니다!");
        } else if (data.status === LikeStatus.MINUS) {
          alert("좋아요를 취소했습니다!");
        }
        setLiked(true);
      },
      onError: (error) => {
        console.error("좋아요 처리 중 오류 발생:", error);
        alert("좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      },
    });
  }, [postId, postLikeMutation]);

  // TODO : show comment editor
  const handleComment = () => {

  };

  // TODO : use sonner to show success modal
  const handleShare = useCallback(async () => {
    const postUrl = `${process.env.URL}/post/${postId}`;
    await navigator.clipboard.writeText(postUrl);
    alert("링크가 성공적으로 복사되었습니다!");
  }, [postId]);

  return (
    <Card className="max-w-xl mx-auto my-6 shadow-sm border">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar>
          <AvatarImage src={author.image || ''} alt={author.name || ''} />
          <AvatarFallback>
            {author.name.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <>
          <div className="font-semibold text-neutral-900">{author.name}</div>
          <div className="text-xs text-neutral-500 flex gap-1">
            <span>@{author.name}</span>
            <span>.</span>
          </div>
        </>
      </CardHeader>
      <Separator />
      <CardContent className="py-4">
        <LexicalViewer json={content} />
      </CardContent>
      <Separator />
      <div className="flex items-center gap-4 px-6 py-2 text-neutral-500">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleComment}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="sr-only">댓글</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleLike}
        >
          <Heart className={cn(
            "w-4 h-4",
            liked ? "bg-red-500" : "bg-accent",
          )} />
          <span className="sr-only">좋아요</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleShare}
        >
          <Share className="w-4 h-4" />
          <span className="sr-only">공유</span>
        </Button>
      </div>
    </Card >
  );
};