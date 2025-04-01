/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import gsap from "gsap";
import About from "@/components/About";
import Hero from "@/components/Hero";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const refwrapper = useRef<HTMLDivElement>(null);
  const refcontent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(".gradDot", { x: -200, y: -200, opacity: 0 });
    gsap.to(".gradDot", {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.7,
    });
  }, []);

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
  }, []);

  return (
    <div ref={refwrapper} className="w-full h-screen overflow-hidden">
      <main
        ref={refcontent}
        className="bg-[#000018] w-full flex flex-col items-center relative"
      >
        <div className="gradDot fixed top-0 rounded-full w-1/2 h-[500px] bg-[#1789DC] blur-[150px] transform -translate-y-1/2 z-0"></div>
        <img
          className="fixed top-0 w-full h-full object-center object-cover opacity-10 z-0"
          src="/images/batman.jpg"
          alt=""
        />
        <div className="w-full h-full flex flex-col items-center z-10">
          <Hero />
          <div className="relative w-full bg-[#000018] flex flex-col items-center z-10">
            <img
              className="absolute w-full h-full object-center object-cover opacity-10"
              src="/images/bat.jpg"
              alt=""
            />
            <About />
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
