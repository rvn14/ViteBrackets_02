import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='fixed w-screen h-24 z-40 flex justify-center items-center backdrop-blur-xs shadow-2xs '>
            <div className='absolute w-20 h-20 flex justify-between items-center'>
                <img src="/images/logo.png" alt=""/>
            </div>
        <div className='w-full h-full flex justify-between items-center text-white px-12'>
            
        </div>
    </div>
  )
}

export default Navbar