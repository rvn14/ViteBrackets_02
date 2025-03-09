import React from 'react'
import Content from './Content'





export default function Footer() {

  return (

    <div 

        className='relative h-[200px] z-20'

        style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}

    >

        <div className='relative h-[calc(100vh+200px)] -top-[100vh] z-40'>

            <div className='h-[200px] sticky top-[calc(100vh-200px)] text-white z-40'>

            <Content />

            </div>

        </div>

    </div>

  )

}