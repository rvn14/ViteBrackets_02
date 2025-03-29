import Link from "next/link";
import React from "react";

export default function Content() {
  return (
    <div className="bg-[#030322] py-8 px-12 h-full w-screen flex flex-col justify-between gap-8">
      <Section />
    </div>
  );
}

const Section = () => {
  return (
    <div className="flex flex-col justify-center items-center ">
      <img className="w-96" src="/images/logo-hor.png" alt="" />

      <p className="text-gray-400">&copy;2025ViteBrackets.</p>
    </div>
  );
};
