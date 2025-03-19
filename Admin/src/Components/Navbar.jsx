import React from 'react'
import assets from '../assets/admin_assets/assets'

function Navbar({setToken}) {
  return (
    <div className='flex  justify-between items-center py-2 px-[4%]  '> 
        <img className='w-[max(10%,80px)] ' src={assets.logo} alt="" />
        <button className='bg-gray-400 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-sky-500' onClick={() => setToken('')}>Log-Out</button>
    </div>
  )
}

export default Navbar