'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentRef, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMount } from 'react-use';

export const ContentModal = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const dialogRef = useRef<ComponentRef<'dialog'>>(null);

  useMount(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  });

  const onDismiss = () => {
    router.back();
  }

  return (
    <div className={cn(
      "absolute top-0 left-0 right-0 bottom-0",
      "flex justify-center items-center z-[1000]",
      "bg-[rgba(0,0,0,0.7)]")}
    >
      <dialog
        ref={dialogRef}
        className={cn(
          "w-4/5 max-w-lg h-auto max-h-lg p-5",
          "relative flex justify-center items-center",
          "text-5xl font-medium",
          "border-none rounded-xl bg-white dark:bg-neutral-800"
        )}
        onClose={onDismiss}
      >
        {children}
        <X
          className={cn(
            'absolute top-2.5 right-2.5 small-icon',
            'flex items-center justify-center',
            'font-medium text-2xl',
            'bg-transparent border-none rounded-2xl cursor-pointer',
            'hover:bg-neutral-200 dark:hover:bg-neutral-700',
          )}
          onClick={onDismiss}
          aria-label="모달 닫기 버튼"
        />
      </dialog>
    </div>
  );
}

const ContentModalPortal = ({ children }: React.PropsWithChildren) => {
  return createPortal(
    <ContentModal>
      {children}
    </ContentModal>,
    document.getElementById('modal-root')!
  );
}

export default ContentModalPortal;