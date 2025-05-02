import Sidebar from "@/app/components/userdashboard/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-50">{children}</main>
    </div>
  )
}
