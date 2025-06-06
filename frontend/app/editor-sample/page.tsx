'use client'

import { LexicalTextEditor } from "@/components/editor/LexicalTextEditor";
import { LexicalViewer } from "@/components/editor/LexicalViewer";

export default function EditorSample() {
  return (
    <div className="flex flex-col gap-y-20">
      <LexicalTextEditor />
      <LexicalViewer
        json='{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Hello","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
      />
    </div>
  );
}
