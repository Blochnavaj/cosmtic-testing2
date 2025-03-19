import React, { useContext, useEffect, useState } from "react";
import Tittle from "./Tittle";
import { ShopContext } from "../Context/ShopContext";
import ProductItems from "./ProductItems";

function BestSeller() {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
     

    // Log products to debug
    products.forEach((product) => {
    
    });

    // ✅ Properly filter best seller products
    const bestSellerProducts = products.filter(
      (product) => Boolean(product.bestSeller) === true
    );

     

    // ✅ Show only top 5 products
    setBestSeller(bestSellerProducts.slice(0, 5));
  }, [products]);

  return (
    <>
      <div className="text-center m-auto mt-4">
        <Tittle text1="Best" text2="Seller" />
        <p className="w-3/4 font-light text-sm m-auto md:text-base sm:text-xs">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae porro architecto deleniti fuga sint repellendus! Beatae quos molestias unde voluptas.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
        {bestSeller.length > 0 ? (
          bestSeller.map((item, index) => (
            <ProductItems key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
          ))
        ) : (
          <p className="text-center col-span-5">No Best Sellers Available</p>
        )}
      </div>
    </>
  );
}

export default BestSeller;
