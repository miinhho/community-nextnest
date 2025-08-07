'use client'

import { cn } from '@/lib/utils'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { editorConfig } from './editor-config'
import { LexicalAutoLinkPlugin as AutoLinkPlugin } from './plugins/AutoLinkPlugin'
import { JsonImportPlugin } from './plugins/JsonImportPlugin'
import { JsonSavePlugin } from './plugins/JsonSavePlugin'
import { ToolbarPlugin } from './plugins/ToolbarPlugin'
import { YouTubePlugin } from './plugins/YouTubePlugin'

const placeholder = '내용을 입력하세요...'

interface LexicalEditorProps {
  json?: string
}

/**
 * @param json - 에디터에 불러올 json 데이터
 */
const LexicalEditor = ({ json }: LexicalEditorProps) => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        className={cn(
          'relative max-w-xl mt-5 mb-5 mr-auto ml-auto',
          'rounded-xs rounded-tl-xl rounded-tr-xl',
          'border-neutral-300 border-2',
          'font-normal text-left',
        )}
      >
        <ToolbarPlugin />
        <div className="relative bg-neutral-100 p-6">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  'relative min-h-36 pt-3.5 pb-2.5 resize-none',
                  'text-base tab-size-1 text-neutral-700',
                  'outline-0',
                )}
                aria-placeholder={placeholder}
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
          <JsonImportPlugin json={json} />
          <JsonSavePlugin />
        </div>
      </div>
    </LexicalComposer>
  )
}

export default LexicalEditor