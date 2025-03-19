import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { Link } from 'react-router-dom';

function ProductItems({id,image,price,name}) {
    const {currency } = useContext(ShopContext);
  return (
    <>
     <Link to={`/product/:${id}`} className='text-gray-600  cursor-pointer '>
     <div className='overflow-hidden '>
        <img src={image[0]}  className='hover:scale-125 transition-all ' alt="" />
       
     </div>
     <p className='font-bold text-lg pt-3 pb-1 px-2 '>{name}</p>
     <p className='text-sm font-semibold'>{currency} {price}</p>

     </Link>
    </>
  )
}

export default ProductItems