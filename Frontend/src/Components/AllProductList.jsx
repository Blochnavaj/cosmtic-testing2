import React from "react";
import { assets } from "../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";

function AllProductList() {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate("/collection");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const products = [
    { name: "Moisturizers", img: assets.cat1 },
    { name: "Toners", img: assets.cat2 },
    { name: "Masks", img: assets.cat3 },
    { name: "Kits", img: assets.cat4 },
    { name: "Serum", img: assets.cat5 },
    { name: "Oil Cleansers", img: assets.cat6 },
    { name: "Body Wash", img: assets.cat7 },
    { name: "Conditioner", img: assets.cat8 },
  ];

  return (
    <div className="relative py-12 mt-8">
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6 px-4">
        {products.map((product, index) => (
          <div
            key={index}
            onClick={handleProductClick}
            className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <h5 className="text-lg font-semibold text-gray-700 mt-2">
              {product.name}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProductList;
