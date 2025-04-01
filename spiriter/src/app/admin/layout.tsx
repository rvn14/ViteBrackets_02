import AdminSidebar from "@/components/AdminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#000018] -z-10">
      <div className="fixed top-0 rounded-full w-full md:w-1/2 h-[300px] md:h-[500px] bg-[#1789DC] blur-[80px] md:blur-[150px] transform -translate-y-1/2 z-0"></div>

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6 overflow-auto z-10">
        {children}
      </main>
    </div>
  );
}
