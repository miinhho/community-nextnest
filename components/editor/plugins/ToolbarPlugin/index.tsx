'use client';

import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Redo, Strikethrough, Underline, Undo, Video } from 'lucide-react';
import { useCallback, useEffect, useState } from "react";
import { INSERT_YOUTUBE_COMMAND } from "../YouTubePlugin";
import "./ToolbarPlugin.css";

const Divider = () => {
  return <div className="w-0.5 bg-neutral-300 mr-1" />;
};

/**
 * 에디터의 툴을 구현한 플러그인
 */
export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="flex mb-0.5 bg-white p-1 rounded-tl-xl rounded-tr-xl align-middle">
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item mr-0.5"
        aria-label="이전으로"
        title="이전으로"
      >
        <Undo />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="이후로"
        title="이후로"
      >
        <Redo />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={cn("toolbar-item mr-0.5", `${isBold ? "bg-neutral-300" : ""}`)}
        aria-label="굵게"
        title="굵게"
      >
        <Bold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={cn("toolbar-item mr-0.5", `${isItalic ? "bg-neutral-300" : ""}`)}
        aria-label="기울이기"
        title="기울이기"
      >
        <Bold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={cn("toolbar-item mr-0.5", `${isUnderline ? "bg-neutral-300" : ""}`)}
        aria-label="밑줄"
        title="밑줄"
      >
        <Underline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={cn("toolbar-item mr-0.5", `${isStrikethrough ? "bg-neutral-300" : ""}`)}
        aria-label="취소선"
        title="취소선"
      >
        <Strikethrough />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="toolbar-item mr-0.5"
        aria-label="왼쪽 정렬"
        title="왼쪽 정렬"
      >
        <AlignLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="toolbar-item mr-0.5"
        aria-label="중앙 정렬"
        title="중앙 정렬"
      >
        <AlignCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="toolbar-item mr-0.5"
        aria-label="오른쪽 정렬"
        title="오른쪽 정렬"
      >
        <AlignRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="toolbar-item mr-0.5"
        aria-label="양쪽 정렬"
        title="양쪽 정렬"
      >
        <AlignJustify />
      </button>
      <Divider />
      <button
        // TODO : Modal 로 대체하여 표시하기
        onClick={() => {
          const url = prompt("Youtube url");
          editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, url || "");
        }}
        className="toolbar-item mr-0.5"
        aria-label="유튜브 비디오 첨부"
        title="유튜브 비디오 첨부"
      >
        <Video />
      </button>
    </div>
  );
}
