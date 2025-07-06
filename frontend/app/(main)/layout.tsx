import { UserStoreProvider } from "@/providers/UserStoreProvider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserStoreProvider>
      <div className="flex flex-col justify-self-center max-w-screen max-lg:min-w-screen min-w-7xl my-auto mx-0 pl-4 pr-4 max-lg:pl-0 max-lg:pr-0">
        {children}
      </div>
    </UserStoreProvider>
  );
}