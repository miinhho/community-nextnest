'use client'

import { JsonSavePlugin } from '@/components/editor/plugins/JsonSavePlugin'
import { cn } from '@/lib/utils'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { UseMutateFunction } from '@tanstack/react-query'
import type { JSX } from 'react'
import { editorConfig } from './editor-config'
import { LexicalAutoLinkPlugin as AutoLinkPlugin } from './plugins/AutoLinkPlugin'
import { JsonLoadPlugin } from './plugins/JsonLoadPlugin'
import { ToolbarPlugin } from './plugins/ToolbarPlugin'
import { YouTubePlugin } from './plugins/YouTubePlugin'

const LexicalEditorSaveButton = ({ title }: { title: string }) => (
  <div
    className={cn(
      'flex justify-self-center w-12 h-8 justify-center items-center',
      'rounded-2xl border-2 border-neutral-200 dark:border-neutral-700',
      'bg-white dark:bg-neutral-800/70',
    )}
  >
    <span className="font-sans text-sm dark:text-white">
      {title}
    </span>
  </div>
)

const defaultPlaceholder = '내용을 입력하세요...'

interface LexicalEditorProps {
  json?: string
  title?: string
  placeholder?: string
  saveButton?: JSX.Element
  mutateFn: UseMutateFunction<any, unknown, string, unknown>
}

/**
 * @param json - 에디터에 불러올 json 데이터
 * @param title - 에디터 상단에 표시할 제목 (기본값: "게시하기")
 * @param placeholder - 에디터에 표시할 플레이스홀더 텍스트
 * @param saveButton - 저장 버튼 컴포넌트 (기본값: LexicalEditorSaveButton 컴포넌트)
 * @param mutateFn - 에디터의 JSON 데이터를 저장하는 함수 (React Query의 useMutation에서 반환된 함수)
 */
const LexicalEditor = ({
  json,
  title,
  placeholder = defaultPlaceholder,
  saveButton = <LexicalEditorSaveButton title={title ?? '게시'} />,
  mutateFn
}: LexicalEditorProps) => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        className={cn(
          'relative max-w-xl mt-5 mb-5 mr-auto ml-auto',
          'rounded-xs rounded-tl-xl rounded-tr-xl border-2 border-neutral-300 dark:border-neutral-800',
          'font-normal text-left',
        )}
      >
        <ToolbarPlugin />
        <div className="relative bg-neutral-100 dark:bg-neutral-900 p-6">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  'relative pt-3.5 pb-2.5 resize-none text-base tab-1 outline-none min-h-36',
                  'text-neutral-800 dark:text-neutral-100',
                )}
                aria-placeholder={placeholder}
                aria-label="내용 입력창"
                placeholder={
                  <div className="absolute top-9 left-6 text-neutral-500 pointer-events-none">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <AutoFocusPlugin />
          <HistoryPlugin />
          <YouTubePlugin />
          <AutoLinkPlugin />
          <JsonLoadPlugin json={json} />
          <JsonSavePlugin
            mutateFn={mutateFn}
            saveButton={saveButton}
          />
        </div>
      </div>
    </LexicalComposer>
  )
}

export default LexicalEditor