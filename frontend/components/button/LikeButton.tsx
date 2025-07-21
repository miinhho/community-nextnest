'use client';

import { Button } from "@/components/ui/button";
import { SizeProps, TailWindClasses } from "@/lib/types/component-util.types";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";

interface LikeButtonProps extends TailWindClasses, SizeProps {
  onClick: () => void;
}

const LikeButton = ({ onClick, className, size }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onClick();
  };

  return (
    <Button
      variant="ghost"
      size={size || "sm"}
      className={cn("flex items-center gap-1", className)}
      onClick={handleLike}
    >
      <Heart className={cn(
        "w-4 h-4",
        liked ? "bg-red-500" : "bg-accent",
      )} />
      <span className="sr-only">좋아요</span>
    </Button>
  )
}

export default LikeButton