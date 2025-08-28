'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { UseMutateFunction } from '@tanstack/react-query'
import type { JSX } from 'react'

/**
 * Lexical 에디터 JSON 저장 플러그인 훅
 * 
 * @param mutateFn - 에디터의 JSON 데이터를 저장하는 함수 (React Query의 useMutation에서 반환된 함수)
 * @returns JSON 저장 핸들러 함수
 */

interface JsonSavePluginProps {
  mutateFn: UseMutateFunction<any, unknown, string, unknown>
  saveButton: JSX.Element
}

export function JsonSavePlugin({ mutateFn, saveButton }: JsonSavePluginProps) {
  const [editor] = useLexicalComposerContext()

  const handleJsonSave = async () => {
    const lexicalJson = JSON.stringify(editor.toJSON())
    mutateFn(lexicalJson, {
      onError: () => {
        throw new JsonSaveError("에디터 내용을 저장하는데 실패했습니다.");
      },
    })
  }

  return (
    <button onClick={handleJsonSave} data-testid="editor-save-button">
      {saveButton}
    </button>
  )
}

/**
 * Lexical 에디터 JSON 저장 오류 클래스
 */
export class JsonSaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JsonSaveError";
  }
}
