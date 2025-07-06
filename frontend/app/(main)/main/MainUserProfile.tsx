import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  className?: string;
  image?: string;
  name?: string;
}

export const MainUserProfile = ({ image, name, className }: Props) => {
  return (
    <div className={cn("flex flex-row justify-center rounded-md bg-white shadow-sm", className)}>
      <Image
        src={image || '/default-avatar.webp'}
        alt={name || 'User Avatar'}
        className="flex rounded-full"
        width={64}
        height={64}
      />
      <span className="py-4 flex justify-self-end text-lg font-semibold max-lg:hidden">{name}</span>
    </div>
  );
}