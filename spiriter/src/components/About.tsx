import React from 'react'

const About = () => {
  return (
    <div className=' w-4/5 min-h-screen flex lg:flex-row flex-col items-center justify-center lg:justify-start text-white'>

        <div className='p-8 flex-1'>
            <div className='font-poppins text-4xl lg:text-5xl font-bold text-center lg:text-left select-none'>
            Where Strategy <br/> Meets Glory
            </div>
            <hr className='text-white/50 mt-5'/>
            <div className='font-poppins text-md lg:text-xl text-center lg:text-left select-none mt-5'>
                <div>
                ✅ Play Real-Time Fantasy Cricket    
                </div> 
                <div className='text-gray-400 ml-4'>
                Draft players, captain your team, and earn points as live matches unfold.
                </div>
                <div>
                ✅ Win Cash Prizes & Exclusive Rewards
                </div> 
                <div className='text-gray-400 ml-4'>
                Compete in daily contests, leagues, and mega tournaments.
                </div>
                <div>
                ✅ Trusted by 1M+ Cricket Fans  
                </div> 
                <div className='text-gray-400 ml-4'>
                Join Island’s fastest-growing fantasy cricket community.
                </div>
            </div>
        </div>
        <div className='p-8 flex-1'>
            <div className='font-poppins text-4xl lg:text-5xl font-bold text-center lg:text-left select-none'>
            Step-by-Step <br/> Guide: How to Play
            </div>
            <hr className='text-white/50 mt-5'/>
            <div className='font-poppins text-md lg:text-xl text-center lg:text-left select-none mt-5'>
                <div>
                1️⃣ Sign Up in 10 Seconds  
                </div> 
                <div className='text-gray-400 ml-4'>
                Quick registration with email or social media.
                </div>
                <div>
                2️⃣ Build Your Ultimate XI
                </div> 
                <div className='text-gray-400 ml-4'>
                Pick players, assign roles, and strategize like a pro.
                </div>
                <div>
                3️⃣ Watch Live & Rise on Leaderboards
                </div> 
                <div className='text-gray-400 ml-4'>
                Track your score in real-time and claim your rewards.
                </div>
            </div>
        </div>

    </div>
  )
}

export default About