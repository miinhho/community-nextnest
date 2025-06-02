import { $generateHtmlFromNodes } from "@lexical/html";
import { LexicalEditor } from "lexical";

/**
 * Lexical Editor 를 HTML 로 파싱
 * @returns - HTML
 */
export function exportLexicalHtml(editor: LexicalEditor): string {
  const editorState = editor.getEditorState();
  let htmlString = "";
  editorState.read(() => {
    htmlString = $generateHtmlFromNodes(editor);
  });

  return htmlString;
}
