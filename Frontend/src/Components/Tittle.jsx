import React from 'react'

function Tittle({text1,text2}) {
  return (
    <div className='inline-flex   items-center mt-4 gap-3 mb-3'>
        <p className='text-gray-400 font-semibold text-3xl'>{text1} <span className='font-bold text-gray-700 '>{text2}</span></p>
        <p className='w-14 h-[1px] bg-gray-500 border-none sm:h-[2px] '></p>
        </div>
  )
}

export default Tittle