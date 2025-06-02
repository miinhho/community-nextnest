import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";

/**
 * 에디터를 Tree / DOM 으로 보여주는 플러그인
 */
export const TreeViewPlugin = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <TreeView
      editor={editor}
    />
  )
}
