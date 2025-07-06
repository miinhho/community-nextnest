'use client';

import { MainSidebar } from "@/app/(main)/main/MainSidebar";
import { useUserStore } from "@/hooks/useUserStore";

export default function HomePage() {
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
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">홈 타임라인</h1>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">메인 콘텐츠 영역</p>
          </div>
        </div>
      </div>
    </div>
  );
}