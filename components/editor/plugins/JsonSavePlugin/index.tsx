import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import status from "http-status";

export function JsonSavePlugin() {
  const [editor] = useLexicalComposerContext();

  // TODO : 확인 Modal 추가하기
  const handlePost = async () => {
    const lexicalJson = JSON.stringify(editor.toJSON);
    console.log(lexicalJson);

    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: lexicalJson,
    });

    // TODO : status 분기별 처리
    switch (res.status) {
      case status.CREATED:
        break;
      case status.BAD_REQUEST:
        break;
      case status.UNAUTHORIZED:
        break;
      case status.INTERNAL_SERVER_ERROR:
        break;
    }
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