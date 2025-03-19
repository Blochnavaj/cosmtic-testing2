import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Tittle from './Tittle'
import ProductItems from './ProductItems'
import { useNavigate } from 'react-router-dom';

function RelatedProduct({ category, skinType }) {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();

            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => skinType === item.skinType);

            setRelated(productsCopy.slice(0, 5));
        }
    }, [products, category, skinType]);

    const handleClick = (id) => {
        navigate(`/product/${id}`); // Navigate to product page
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
    };

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Tittle text1={"Related"} text2={"Product"} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3'>
                {related.map((item) => (
                    <div key={item._id} onClick={() => handleClick(item._id)} className="cursor-pointer">
                        <ProductItems id={item._id} name={item.name} price={item.price} image={item.image} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RelatedProduct;
