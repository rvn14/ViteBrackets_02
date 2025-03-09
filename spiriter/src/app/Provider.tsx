/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Lenis, ReactLenis, useLenis } from 'lenis/react'
import { usePathname } from "next/navigation";
import ChatBot from "@/components/ChatBot";
import { useRef } from 'react';

export default function Provider({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const hiddenPaths = ["/auth/login", "/auth/signup"];
  const show = !hiddenPaths.includes(pathname);

  return (
    // <ReactLenis root>
    <div className="">
      {/* {show && <Navbar />} */}
      {show && (<ChatBot />)}
      {children}
      {/* {show && <Footer />} */}
    </div>
    //</ReactLenis>
  );
}
