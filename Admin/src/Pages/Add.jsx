 
 import React, { useState } from "react";
 import assets from "../assets/admin_assets/assets";
 import axios from "axios";
 import { backendUrl } from "../App";
 import { toast } from "react-toastify";
 
 function Add({ token }) {
   const [image1, setImage1] = useState(null);
   const [image2, setImage2] = useState(null);
   const [image3, setImage3] = useState(null);
   const [image4, setImage4] = useState(null);
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("Face");
   const [subCategory, setSubCategory] = useState("Oily");
   const [bestSeller, setBestSeller] = useState(false);
   const [loading, setLoading] = useState(false); // Loader state
 
   const onSubmitHandler = async (e) => {
     e.preventDefault();
     setLoading(true); // Start loader
 
     try {
       const formData = new FormData();
       formData.append("name", name);
       formData.append("description", description);
       formData.append("price", price);
       formData.append("category", category);
       formData.append("subCategory", subCategory);
       formData.append("bestSeller", bestSeller ? "true" : "false");
       image1 && formData.append("image1", image1);
       image2 && formData.append("image2", image2);
       image3 && formData.append("image3", image3);
       image4 && formData.append("image4", image4);
 
       const response = await axios.post(`${backendUrl}/api/v1/add`, formData, {
         headers: { Authorization: `Bearer ${token}` },
       });
 
       if (response.data.success) {
         toast.success(response.data.message);
         setName("");
         setDescription("");
         setPrice("");
         setImage1(null);
         setImage2(null);
         setImage3(null);
         setImage4(null);
         setBestSeller(false);
       } else {
         toast.error(response.data.message);
       }
     } catch (error) {
       toast.error(error.message);
     } finally {
       setLoading(false); // Stop loader
     }
   };
 
   return (
     <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
       {/* Image Upload Section */}
       <div>
         <p className="mb-3">Upload image</p>
         <div className="flex gap-2">
           {[image1, image2, image3, image4].map((img, index) => (
             <label key={index} htmlFor={`image${index + 1}`}>
               <img
                 className="w-20"
                 src={img ? URL.createObjectURL(img) : assets.upload_area}
                 alt="Upload"
               />
               <input
                 onChange={(e) => [setImage1, setImage2, setImage3, setImage4][index](e.target.files[0])}
                 type="file"
                 id={`image${index + 1}`}
                 hidden
               />
             </label>
           ))}
         </div>
       </div>
 
       {/* Product Details Section */}
       <div className="w-full">
         <p className="mb-2">Product Name</p>
         <input
           className="w-full max-w-[500px] px-3 py-2"
           type="text"
           placeholder="Enter a Product Name"
           required
           value={name}
           onChange={(e) => setName(e.target.value)}
         />
       </div>
 
       <div className="w-full">
         <p className="mb-2">Product Description</p>
         <textarea
           className="w-full max-w-[500px] px-3 py-2"
           placeholder="Enter a Product Description"
           required
           value={description}
           onChange={(e) => setDescription(e.target.value)}
         />
       </div>
 
       {/* Dropdowns & Price */}
       <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
         <div>
           <p className="mb-2">Product Category</p>
           <select className="w-full px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
             <option value="Face">Face</option>
             <option value="Hair">Hair</option>
             <option value="Lips">Lips</option>
           </select>
         </div>
 
         <div>
           <p className="mb-2">Sub-Category</p>
           <select className="w-full px-3 py-2" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
             <option value="Oily">Oily</option>
             <option value="Dry">Dry</option>
             <option value="Sensitive">Sensitive</option>
           </select>
         </div>
 
         <div>
           <p className="mb-2">Product Price</p>
           <input
             className="w-full px-3 py-2 sm:w-[120px]"
             type="number"
             placeholder="78"
             value={price}
             onChange={(e) => setPrice(e.target.value)}
           />
         </div>
       </div>
 
       <div className="flex gap-2 mt-2">
         <input
           type="checkbox"
           id="bestSeller"
           checked={bestSeller}
           onChange={() => setBestSeller((prev) => !prev)}
         />
         <label className="cursor-pointer" htmlFor="bestSeller">
           Add to BestSeller
         </label>
       </div>
 
       {/* Button with Loader */}
       <button
         type="submit"
         className="w-28 px-3 py-4 text-white bg-black flex items-center justify-center"
         disabled={loading} // Disable button while loading
       >
         {loading ? (
           <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
         ) : (
           "Add"
         )}
       </button>
     </form>
   );
 }
 
 export default Add;
 