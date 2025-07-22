/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoLinkNode, LinkNode } from '@lexical/link'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ParagraphNode, TextNode } from 'lexical'
import { ComponentProps } from 'react'
import { YouTubeNode } from './nodes/YoutubeNode'

export type LexicalConfig = ComponentProps<typeof LexicalComposer>['initialConfig']

export const nodes: LexicalConfig['nodes'] = [
  ParagraphNode,
  TextNode,
  YouTubeNode,
  AutoLinkNode,
  LinkNode,
]

export const editorTheme = {
  image: 'editor-image',
  link: 'editor-link',
  ltr: 'ltr',
  paragraph: 'editor-paragraph',
  placeholder: 'editor-placeholder',
  rtl: 'rtl',
  text: {
    bold: 'editor-text-bold',
    hashtag: 'editor-text-hashtag',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    strikethrough: 'editor-text-strikethrough',
    underline: 'editor-text-underline',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
  },
}

export const editorConfig: LexicalConfig = {
  namespace: 'TextEditor',
  nodes,
  onError(error) {
    throw error
  },
  theme: editorTheme,
}

export const viewerConfig: LexicalConfig = {
  ...editorConfig,
  editable: false,
}
