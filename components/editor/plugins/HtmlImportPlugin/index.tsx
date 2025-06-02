'use client';

import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { useEffect } from 'react';

/**
 * Html 데이터를 받아와 에디터에 띄우는 플러그인
 * @param htmlString - Html 데이터
 */
export function HtmlImportPlugin({ htmlString }: { htmlString?: string }) {
  const [editor] = useLexicalComposerContext();

  if (htmlString) {
    useEffect(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, 'text/html');

      editor.update(() => {
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
    }, [editor, htmlString]);
  }

  return null;
}