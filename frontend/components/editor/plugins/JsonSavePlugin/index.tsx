'use client'

import { cn } from '@/lib/utils'
import { TailWindClasses } from '@/types/component-util.types'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { UseMutateFunction } from '@tanstack/react-query'
import { useEffect, useState, type JSX } from 'react'

interface JsonSavePluginProps extends TailWindClasses {
  mutateFn: UseMutateFunction<any, unknown, string, unknown>
  saveButton: JSX.Element
}

/**
 * Lexical 에디터 JSON 저장 플러그인 훅
 * 
 * @param mutateFn - 에디터의 JSON 데이터를 저장하는 함수 (React Query의 useMutation에서 반환된 함수)
 * @returns JSON 저장 핸들러 함수
 */
export function JsonSavePlugin({ mutateFn, saveButton, className }: JsonSavePluginProps) {
  const [editor] = useLexicalComposerContext()
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      setIsEmpty(editorState.isEmpty())
    })
  }, [editor])

  const handleJsonSave = async () => {
    const lexicalJson = JSON.stringify(editor.toJSON())
    mutateFn(lexicalJson, {
      onError: () => {
        throw new JsonSaveError("에디터 내용을 저장하는데 실패했습니다.");
      },
    })
  }

  return (
    <button
      className={cn('flex disabled:opacity-50 disabled:cursor-not-allowed', className)}
      disabled={isEmpty}
      onClick={handleJsonSave}
      data-testid="editor-save-button"
    >
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
