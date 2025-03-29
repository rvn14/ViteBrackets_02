/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { usePathname } from "next/navigation";
import ChatBot from "@/components/ChatBot";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Provider({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const hiddenPaths = ["/auth/login", "/auth/signup", "/", ...pathname.startsWith("/admin") ? [pathname] : []];
  const show = !hiddenPaths.includes(pathname);

  return (
    // <ReactLenis root>
    <div className="overflow-x-hidden w-full ">
      {show && <Navbar />}
      {show && (<ChatBot />)}
      {children}
      {show && <Footer />}
    </div>
    //</ReactLenis>
  );
}
