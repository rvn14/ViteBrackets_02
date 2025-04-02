"use client";
import { usePathname } from "next/navigation";
import ChatBot from "@/components/ChatBot";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Provider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Existing hidden paths for Navbar and ChatBot
  const hiddenPaths = ["/auth/login", "/auth/signup", ...pathname.startsWith("/admin") ? [pathname] : []];
  
  // New array for paths where the Footer should be hidden.
  // Replace "/your-page" with the actual route of your page.tsx.
  const hideFooterPaths = ["/"]; 
  
  // Compute whether to show the common components.
  const show = !hiddenPaths.includes(pathname);
  // Decide if the Footer should be rendered.
  const showFooter = !hideFooterPaths.includes(pathname);

  return (
    <div className="overflow-x-hidden w-full">
      {show && <Navbar />}
      {show && <ChatBot />}
      {children}
      {show && showFooter && <Footer />}
    </div>
  );
}
