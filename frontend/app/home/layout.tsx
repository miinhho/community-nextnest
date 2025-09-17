import { UserStoreProvider } from "@/features/user/stores/provider"
import { HomeSidebar } from "@/layouts/home/HomeSidebar"
import { cn } from "@/lib/utils/cn"
import { Toaster } from "sonner"

export default function MainLayout({ children, modal }: {
  children: React.ReactNode,
  modal: React.ReactNode
}) {
  return (
    <UserStoreProvider>
      <main className={cn(
        'flex flex-col justify-self-center max-w-screen max-lg:min-w-screen min-w-7xl min-h-screen',
        'my-auto mx-0 pl-4 pr-4 max-lg:pl-0 max-lg:pr-0',
      )}>
        <HomeSidebar />
        <div className="flex overflow-y-auto">
          {children}
        </div>
        <Toaster position='top-center' />
      </main>
      {modal}
      <div id="modal-root" />
    </UserStoreProvider>
  )
}
