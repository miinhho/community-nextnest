'use client';

import { usePostCreateQuery } from "@/lib/query/post.query";
import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function JsonSavePlugin() {
  const [editor] = useLexicalComposerContext();
  const { mutate: postSaveMutation } = usePostCreateQuery();

  // TODO : Use modal to show success or error message
  const handlePost = async () => {
    const lexicalJson = JSON.stringify(editor.toJSON);

    postSaveMutation(lexicalJson, {
      onSuccess: () => {
        alert("게시글이 성공적으로 저장되었습니다!");
      },
      onError: (error) => {
        console.error("게시글 저장 중 오류 발생:", error);
        alert("게시글 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      },
    });
  }

  return (
    <div className={cn(
      "flex mt-15 -mb-23 justify-self-center -mr-4",
      "rounded-2xl border-2 px-20 py-2.5",
      "bg-white hover:bg-neutral-200/70"
    )}>
      <button
        onClick={handlePost}
        aria-label="게시하기"
        className="font-sans text-lg"
      >
        게시하기
      </button>
    </div>
  );
}