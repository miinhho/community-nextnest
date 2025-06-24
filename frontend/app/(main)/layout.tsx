import { UserStoreProvider } from "@/providers/UserStoreProvider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserStoreProvider>
      {children}
    </UserStoreProvider>
  );
}