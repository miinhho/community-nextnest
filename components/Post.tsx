'use client';

import { fetchPostData } from "@/lib/fetch/post.fetch";
import { Heart, MessageCircle, Share } from "lucide-react";
import { LexicalViewer } from "./editor/LexicalViewer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

interface Props {
  postId: string;
}

export const Post = async ({ postId }: Props) => {
  const { author, post } = await fetchPostData(postId);

  // TODO : Like Fetch 를 fetch helper 로 만들기 (많이 쓰일 것 같음)
  const handleLike = async () => {
    const likeData = await fetch(
      `${process.env.URL}/api/post/${postId}:${process.env.PORT}`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  };

  // TODO : 댓글 달 수 있는 에디터 띄우기
  // shadcn/ui 의 Alert Dialog
  const handleComment = () => {

  };

  // TODO : alert 대신 Modal 처리
  // shadcn/ui 의 Sonner
  const handleShare = async () => {
    const postUrl = `${process.env.URL}/post/${postId}`;
    await navigator.clipboard.writeText(postUrl);
    alert("링크가 성공적으로 복사되었습니다!");
  };

  return (
    <Card className="max-w-xl mx-auto my-6 shadow-sm border">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar>
          <AvatarImage src={author.image || ''} alt={author.name || ''} />
          <AvatarFallback>
            {author.name.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-neutral-900">{author.name}</div>
          <div className="text-xs text-neutral-500 flex gap-1">
            <span>@{author.name}</span>
            <span>.</span>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="py-4">
        <LexicalViewer json={post.content} />
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
          <Heart className="w-4 h-4" />
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
    </Card>
  );
};