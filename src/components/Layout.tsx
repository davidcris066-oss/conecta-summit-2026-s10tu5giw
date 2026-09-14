import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050A15] text-white selection:bg-[#00E5FF]/30 selection:text-white">
      <main className="flex-1 w-full pb-20 sm:pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
