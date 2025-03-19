import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProduct from "../Components/RelatedProduct";

function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!productId) return;
    const cleanProductId = decodeURIComponent(productId).replace(/[:]/g, "").trim();
    const foundProduct = products.find((item) => String(item._id).trim() === cleanProductId);

    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
    }
  }, [productId, products]);

  if (!productData) {
    return <div className="text-center text-red-500 font-bold">🚫 Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10 mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Product Images */}
        <div className="flex flex-col items-center w-full">
          <img src={image} className="w-full max-w-md rounded-lg shadow-md" alt="Product" />
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {productData.image.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Thumbnail ${index}`} 
                className="w-20 h-20 object-cover cursor-pointer rounded-md border hover:border-black transition"
                onClick={() => setImage(img)}
              />
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{productData.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} className="w-4" alt="Star" />
            ))}
            <img src={assets.star_dull_icon} className="w-4" alt="Star" />
            <p className="text-gray-500 ml-2">(122 Reviews)</p>
          </div>
          <p className="text-2xl font-semibold text-gray-800 mt-3">{currency} {productData.price}</p>
          <p className="text-gray-600 mt-3 leading-relaxed">{productData.description}</p>
          <button onClick={() => addToCart(productData._id)} className="mt-5 px-6 py-3 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition">
  ADD TO CART
</button>          
          <div className="mt-5 border-t pt-4 text-sm text-gray-500 space-y-2">
            <p>✔ Fast Delivery Available</p>
            <p>✔ 100% Secure Payments</p>
            <p>✔ 7-Day Return Policy</p>
          </div>
        </div>
      </div>

      {/* description and review section */}

      <div className="mt-20">
        <div className="flex ">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Review</p>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 border-gray-400 text-sm text-black text-wrap">
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum cum neque, dolor modi voluptatem quaerat ratione perspiciatis possimus nobis? Illum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus aspernatur illo sed nihil quam corporis vitae pariatur unde commodi quasi!</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum eligendi alias quae ab, voluptatibus quisquam omnis vero eos distinctio fugiat. Lorem ipsum dolor sit amet consectetur, adipisicing elit. In modi eos nostrum dignissimos hic quis et adipisci sequi fugiat est!</p>
        </div>
           
      </div>

      {/* display related product  */}
      <RelatedProduct category={productData.category} skinType={productData.skinType}/>
    </div>
  );
}

export default Product;
