import BottomBar from "@/app/components/userdashboard/Sidebar";

 
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen overflow-auto bg-gray-900">
      <main className="flex-1 p-4 pb-24">{children}</main>
      <BottomBar />
    </div>
  )
}