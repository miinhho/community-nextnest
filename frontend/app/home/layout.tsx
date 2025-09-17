import { MainSidebar } from '@/app/home/_components/MainSidebar'
import { cn } from '@/lib/utils'
import { UserStoreProvider } from '@/providers/UserStoreProvider'
import { Toaster } from 'sonner'

export default function MainLayout({ children, modal }: {
  children: React.ReactNode,
  modal: React.ReactNode
}) {
  return (
    <UserStoreProvider>
      <div
        className={cn(
          'flex flex-col justify-self-center max-w-screen max-lg:min-w-screen min-w-7xl min-h-screen',
          'my-auto mx-0 pl-4 pr-4 max-lg:pl-0 max-lg:pr-0',
        )}>
        <MainSidebar />
        <div className="flex overflow-y-auto">
          {children}
        </div>
      </div>
      <Toaster position='top-center' />
      {modal}
      <div id="modal-root" />
    </UserStoreProvider>
  )
}
