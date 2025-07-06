'use client';

import { MainSidebar } from "@/app/(main)/main/MainSidebar";
import { useUserStore } from "@/hooks/useUserStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const image = useUserStore((state) => state.image);
  const name = useUserStore((state) => state.name);

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 사이드바 */}
      <MainSidebar
        image={image}
        name={name}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex overflow-y-auto">
        {children}
      </div>
    </div>
  );
}