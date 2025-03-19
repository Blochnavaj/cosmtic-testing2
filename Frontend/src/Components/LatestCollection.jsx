import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Tittle from './Tittle'
import ProductItems from './ProductItems';

function LatestCollection() {
 
    const {products} = useContext(ShopContext)
   const [latestproducts, setLatestProducts] = useState([]);
    
   useEffect(() =>{
      setLatestProducts(products.slice(0,10));
    },[products])

    

  return (
    <div className='mt-7'> 

        <div className='text-center '>
            <Tittle text1='Latest' text2='Collection'/>
            <p className='w-3/4 font-light text-sm m-auto md:text-base sm:text-xs'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae porro architecto deleniti fuga sint repellendus! Beatae quos molestias unde voluptas.</p>
        </div>

        {/* rendring Product  */}

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-3'>
          {
            latestproducts.map((item,index) =>(
                <ProductItems key={index} id={item._id} name={item.name} price={item.price} image={item.image}/>
            ))
          }
        </div>
    </div>
  )
}

export default LatestCollection