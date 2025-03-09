import AdminSidebar from "@/components/AdminSideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center h-screen bg-[#000018] -z-10">
    <div className="fixed top-0 rounded-full w-1/2 h-[500px] bg-[#1789DC] blur-[150px] transform -translate-y-1/2 z-0"></div>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto z-10">
        {children}
    </main>
    </div>
  );
}
