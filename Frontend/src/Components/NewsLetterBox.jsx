import React from 'react'

function NewsLetterBox() {

     const onSumbitHandler = (event) => {
      event.preventDefault();
     }   
  return (
    <div className='md:mt-16 mt-11'> 
        <div className='text-center m-auto'>
            <p className='font-bold text-2xl text-gray-500 '>Subscribe Now & Get 40% Offers!</p>
            <p className='font-light text-sm text-black mt-2'>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
        </div>
        <form onSubmit={onSumbitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' >
            <input className=' w-full outline-none ' type="email" placeholder='Enter Your Email...'  />
            <button className='bg-black text-white text-xs py-4 px-10 '>Subscribe</button>
        </form>
    </div>
  )
}

export default NewsLetterBox