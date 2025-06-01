import Sidebar from "@/app/components/userdashboard/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen overflow-auto">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-900">{children}</main>
    </div>
  )
}
