'use client';

import { viewerConfig } from '@/components/editor/editor-config';
import { cn } from '@/lib/utils';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { JsonImportPlugin } from './plugins/JsonImportPlugin';

interface LexicalViewerProps {
  json: string;
}

// TODO : comment, post 별로 LexicalViewer 컴포넌트 분리
/**
 * @param json - 에디터에 불러올 json 데이터
 */
export const LexicalViewer = ({
  json
}: LexicalViewerProps) => {

  return (
    <LexicalComposer initialConfig={viewerConfig}>
      <div className={cn(
        "relative min-w-md mt-5 mb-5 mr-auto ml-auto",
        "rounded-2xl",
        "border-neutral-300 border-2",
        "font-normal text-left",
      )}>
        <div className="relative rounded-2xl bg-neutral-100 pl-4">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  "relative min-h-20 pt-3.5 pb-2.5 resize-none",
                  "text-base tab-size-1 text-neutral-700",
                  "outline-0"
                )}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <JsonImportPlugin json={json} />
        </div>
      </div>
    </LexicalComposer>
  );
}
