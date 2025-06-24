import { MainNavbar } from "@/app/(main)/MainNavbar";
import Image from "next/image";

export const MainSidebar = ({ image, name }: {
  image?: string;
  name?: string;
}) => {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <div className="flex flex-col gap-4">
        {/* 유저 프로필 */}
        <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
          <Image
            src={image || '/default-avatar.webp'}
            alt={name || 'User Avatar'}
            className="w-16 h-16 rounded-full"
            width={64}
            height={64}
          />
          <h2 className="text-lg font-semibold">{name}</h2>
        </div>

        {/* 네비게이션 메뉴 */}
        <MainNavbar />
      </div>
    </div>
  );
}