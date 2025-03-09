import Link from 'next/link'
import React from 'react'



export default function Content() {

  return (

    <div className='bg-[#030322] py-8 px-12 h-full w-screen flex flex-col justify-between gap-8'>

        <Section1 />

        <Section2 />

    </div>

  )

}



const Section1 = () => {

    return (

        <div className='flex flex-col self-center'>

            <Nav />

        </div>

    )

}



const Section2 = () => {

    return (

        <div className='flex flex-col justify-center items-center '>

            <img className='w-96' src="/images/logo-hor.png" alt=""/>

            <p className='text-gray-400'>&copy;2025ViteBrackets.</p>

        </div>

    )

}



const Nav = () => {

    return (

        <div className='flex items-center justify-between'>

            <div className='flex flex-row gap-8'>


                <Link className='nav-hover-btn' href=''>Home</Link>

                <Link className='nav-hover-btn' href=''>Leaderboard</Link>

                <Link className='nav-hover-btn' href=''>Players</Link>

                <Link className='nav-hover-btn' href=''>Signup</Link>

            </div>


        </div>

    )

}