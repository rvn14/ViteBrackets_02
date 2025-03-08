"use client";

import { usePathname } from "next/navigation";
import ChatBot from "@/components/ChatBot";

export default function Provider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hiddenPaths = ["/auth/login", "/auth/signup"];
  const show = !hiddenPaths.includes(pathname);

  return (
    <div className="">
      {/* {show && <Navbar />} */}
      {children}
      {show && <ChatBot />}
      {/* {show && <Footer />} */}
    </div>
  );
}
