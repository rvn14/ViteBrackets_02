"use client";

import Link from "next/link";

const Hero = () => {
  return (
    <div className='relative w-full h-screen flex justify-center items-center'>
        
        <div className='w-4/5 h-full flex flex-col justify-center items-center bg-center bg-cover'>
            <div className="font-poppins text-5xl lg:text-9xl font-semibold text-white text-center select-none">Unleash Your Cricket Passion</div>
            <div className="text-gray-300 font-poppins text-md lg:text-xl text-center select-none ">Create Your Dream Team, Compete in Thrilling Matches, and Win Big – Sign Up Now to Play!</div>
            <Link href="/auth/signup"><div className="CTAbutton bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold px-8 py-4 rounded-4xl text-white text-xl mt-7 cursor-pointer hover:scale-97 transition-all duration-500">Sign Up Now & Play Free!</div></Link>
        </div>

    </div>
  )
}

export default Hero