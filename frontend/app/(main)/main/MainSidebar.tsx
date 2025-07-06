import { MainNavbar } from "@/app/(main)/main/MainNavbar";
import { MainUserProfile } from "@/app/(main)/main/MainUserProfile";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  image?: string;
  name?: string;
}

export const MainSidebar = ({ image, name, className }: Props) => {
  return (
    <div className={cn("flex flex-col h-screen bg-gray-50 border-r border-gray-200 p-6", className)}>
      <div className="flex flex-col justify-between h-full">
        {/* 네비게이션 메뉴 */}
        <MainNavbar className="gap-4" />
        {/* 유저 프로필 */}
        <div className="flex justify-center">
          <MainUserProfile
            image={image}
            name={name || "John Doe"}
            className="my-3 gap-2 p-2"
          />
        </div>
      </div>
    </div>
  );
}