'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

/**
 * json 를 받아와 에디터에 띄우는 플러그인
 */
export function JsonImportPlugin({ json }: { json?: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!json) return

    const jsonString = typeof json === 'string' ? json : JSON.stringify(json)

    editor.update(() => {
      const editorState = editor.parseEditorState(jsonString)
      editor.setEditorState(editorState)
    })
  }, [editor, json])

  return null
}
