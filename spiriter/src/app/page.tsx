/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import  Lenis  from "lenis";
import { useEffect, useRef } from "react";


export default function Home() {
  const refwrapper = useRef<HTMLDivElement>(null);
  const refcontent = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const lenis = new Lenis({
      wrapper: refwrapper.current || undefined,
      content: refcontent.current || undefined,
      orientation: "vertical",
      gestureOrientation: "vertical",

    });
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [])

  return (

    <div ref={refwrapper} className="w-full h-screen overflow-hidden">
        <Navbar  />
    <main ref={refcontent} className="bg-[#000018] w-full flex flex-col items-center relative">
      <div className="fixed top-0 rounded-full w-1/2 h-[500px] bg-[#1789DC] blur-[150px] transform -translate-y-1/2 z-0"></div>
      <img className="fixed top-0 w-full h-full object-center object-cover opacity-10 z-0" src="/images/batman.jpg" alt=""/>
      <div className="w-full h-full flex flex-col items-center z-10">
        
        <Hero />
        <div className="relative w-full bg-[#000018] flex flex-col items-center z-10">
          <img className="absolute w-full h-full object-center object-cover opacity-10" src="/images/bat.jpg" alt=""/>
            <About />
        </div>
        <div className="relative w-full min-h-screen bg-[#040445] flex flex-col items-center justify-center z-10">
          <div className="text-9xl font-poppins text-white">LEADERBOARD</div>
        </div>

      </div>
    </main>
        <Footer />
    </div>
    
  );
}
