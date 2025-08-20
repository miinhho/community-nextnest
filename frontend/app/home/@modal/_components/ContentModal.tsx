'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ComponentRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const ContentModal = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const dialogRef = useRef<ComponentRef<'dialog'>>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  const onDismiss = () => {
    router.back();
  }

  return createPortal(
    <div className={cn(
      "absolute top-0 left-0 right-0 bottom-0",
      "flex justify-center items-center z-[1000]",
      "bg-[rgba(0,0,0,0.7)]")}
    >
      <dialog ref={dialogRef} className={cn(
        "w-4/5 max-w-lg h-auto max-h-lg p-5",
        "relative flex justify-center items-center",
        "text-5xl font-medium",
        "border-none rounded-xl bg-white")}
        onClose={onDismiss}>
        {children}
        <button onClick={onDismiss} className="close-button" />
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  );
}