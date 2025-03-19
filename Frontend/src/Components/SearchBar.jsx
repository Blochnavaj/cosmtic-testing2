import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

function SearchBar() {

    const {search , setSearch,showSearch , setShowSearch} = useContext(ShopContext);
     const[visible , setVisible] = useState(false);
    const location = useLocation(); 

    useEffect(() =>{
          if(location.pathname.includes('collection') ){
             setVisible(true);
          }
          else {
            setVisible(false);
          }
    },[location])

  return showSearch && visible ?  ( 
    <div className='border-t border-b border-gray-400 text-center mt-[5.8rem] bg-gray-300    '> 
         <div className='inline-flex items-center justify-center border border-black px-5 mx-3 my-5 py-2 w-3/4 sm:w-1/2 rounded-full '>
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="text"  placeholder='search now...' className='flex-1 outline-none text-black bg-inherit text-sm'/>
           <img className='w-4' src={assets.search_icon}  alt="" />
         </div>
         <img  onClick={() => setShowSearch(false)} className='w-3 inline cursor-pointer text-black' src={assets.cross_icon} alt="" />
    </div>
  ) : null
}

export default SearchBar