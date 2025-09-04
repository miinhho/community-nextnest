'use client'

import { viewerConfig } from '@/components/editor/editor-config'
import { cn } from '@/lib/utils'
import { TailWindClasses } from '@/types/component-util.types'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { JsonLoadPlugin } from './plugins/JsonLoadPlugin'

interface LexicalViewerProps extends TailWindClasses {
  json: string
}

/**
 * @param json - 에디터에 불러올 json 데이터
 */
const LexicalViewer = ({ json, className }: LexicalViewerProps) => {
  return (
    <LexicalComposer initialConfig={viewerConfig}>
      <div
        className={cn(
          'relative min-w-md mr-auto ml-auto',
          'font-normal text-left',
          className,
        )}
      >
        <div className="relative rounded-xl">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  'relative resize-none text-base tab-1 min-h-10 h-auto',
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