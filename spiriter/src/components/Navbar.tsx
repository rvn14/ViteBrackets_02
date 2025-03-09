"use client"

import Link from 'next/link'

import React, { useEffect, useState } from 'react'

const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          setIsLogged(true)
          return;
        }

      }
        catch (error) {
        console.error("Error fetching user:", error);

      }
    }

    fetchUser();
    
  }, [])
  


  return (
    <div className='fixed w-screen h-24 z-40 flex justify-center items-center backdrop-blur-xs shadow-2xs '>
            
        <div className='w-full h-full flex justify-center items-center text-white gap-16 lg:gap-128 '>
            <div className='flex justify-between items-center'>
                <img className='h-8' src="/images/logo-hor.png" alt=""/>
            </div>
            {isLogged?<div className='flex items-center gap-8'>
                <Link href="/"><div className='cursor-pointer rounded-3xl nav-hover-btn'>Home</div></Link>
                <Link href="/leaderboard"><div className='cursor-pointer rounded-3xl nav-hover-btn'>Leaderboard</div></Link>
                <Link href="/players"><div className='cursor-pointer rounded-3xl nav-hover-btn'>Players</div></Link>
                <Link href="/team"><div className='cursor-pointer rounded-3xl nav-hover-btn'>Your Team</div></Link>
                <Link href="/auth/login"><div className='cursor-pointer py-2 px-6 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500'>Logout</div></Link>
                
            </div>:<div className='flex items-center gap-8'>
                <Link href="/"><div className='cursor-pointer rounded-3xl nav-hover-btn'>Home</div></Link>
                <Link href="/leaderboard"><div className='cursor-pointer rounded-3xl nav-hover-btn'>Leaderboard</div></Link>
                <Link href="/leaderboard"><div className='cursor-pointer rounded-3xl nav-hover-btn'>Players</div></Link>
                <Link href="/auth/signup"><div className='cursor-pointer py-2 px-6 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500'>Sign Up</div></Link>
                </div>}
        </div>
    </div>
  )
}

export default Navbar