import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import Tittle from './Tittle'

function OurPolicy() {
    return (
        <>

            <div className='text-center m-auto mt-4'>
                <Tittle text1='Your' text2='Policy' />
            </div>
            <div className='flex flex-col mt-2 justify-around  text-center sm:gap-5 sm:flex-row '>




                <div className='flex flex-col justify-center items-center text-gray-700 sm:mt-2'>
                    <img src={assets.exchange_icon} className='w-12 m-auto pb-2' alt="" />
                    <p className='font-semibold'>Easy exchage policy</p>
                    <p className='text-sm '>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                </div>

                <div className='flex flex-col justify-center items-center text-gray-700 mt-6'>
                    <img src={assets.quality_icon} className='w-12 m-auto pb-2' alt="" />
                    <p className='font-semibold'>Easy exchage policy</p>
                    <p className='text-sm '>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                </div>

                <div className='flex flex-col justify-center items-center text-gray-700 mt-6'>
                    <img src={assets.support_img} className='w-12 m-auto pb-2' alt="" />
                    <p className='font-semibold'>Easy exchage policy</p>
                    <p className='text-sm '>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                </div>
            </div>
        </>
    )
}

export default OurPolicy