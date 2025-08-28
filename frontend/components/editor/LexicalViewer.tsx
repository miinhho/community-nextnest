'use client'

import { viewerConfig } from '@/components/editor/editor-config'
import { cn } from '@/lib/utils'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import './lexical-editor.css'
import { JsonLoadPlugin } from './plugins/JsonLoadPlugin'

interface LexicalViewerProps {
  json: string
}

/**
 * @param json - 에디터에 불러올 json 데이터
 */
const LexicalViewer = ({ json }: LexicalViewerProps) => {
  return (
    <LexicalComposer initialConfig={viewerConfig}>
      <div
        className={cn(
          'relative min-w-md mt-5 mb-5 mr-auto ml-auto',
          'rounded-2xl border-2 dark:border-0 border-neutral-300 dark:border-neutral-800',
          'font-normal text-left',
        )}
      >
        <div className="relative rounded-xl bg-neutral-100 dark:bg-neutral-800 pl-4">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  'editor-content-editable min-h-20',
                  'text-neutral-700 dark:text-neutral-200',
                )}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <JsonLoadPlugin json={json} />
        </div>
      </div>
    </LexicalComposer>
  )
}

export default LexicalViewer