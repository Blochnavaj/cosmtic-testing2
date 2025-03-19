import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

function Hero() {
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400 mt-[100px]  '>
            <div className='w-full sm:w:1/2 flex items-center justify-center py-10 sm:py-0'>
                <div className='text-gray-600'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-14 h-[1px] bg-gray-800'></p>
                        <p className=' font-bold text-sm md:text-base'> OUR BESTSELLER </p>
                    </div>
                    <h1 className='text-3xl py-2 lg:text-5xl leading-relaxed'>Latest  items </h1>
                    <div className='flex items-center gap-2 md:py-2'>
                        <p className='text-3xl font-semibold'> SHOP NOW  </p>
                        <p className='w-8 md:w-14 h-[1px] bg-gray-800'></p>
                    </div>
                </div>

            </div>
            <img src={assets.hero_img} className='w-full sm:w-1/2' alt="" />
        </div>
    )
}

export default Hero