import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { Slider, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import Tittle from '../Components/Tittle';
import ProductItems from '../Components/ProductItems';
import { IoClose } from "react-icons/io5";

const brands = ['Brand A', 'Brand B', 'Brand C'];
const skinTypes = ['Oily', 'Dry', 'Sensitive'];
const categories = ['Face', 'Eyes', 'Lips', 'Nails', 'Hair', 'Body'];

function Collection() {
  const { products, search , setSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
 

  const [selectedCategory, setSelectedCategory] = useState([]);
const [selectedBrands, setSelectedBrands] = useState([]);
const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
const [sortOption, setSortOption] = useState('relevant'); // Sorting state


useEffect(() => {
  let filtered = products;

    // Apply search filter
    if (search.trim() !== '') {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
 

  if (selectedCategory.length > 0) {
    filtered = filtered.filter((product) => selectedCategory.includes(product.category));
  }

  if (selectedBrands.length > 0) {
    filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
  }

  if (selectedSkinTypes.length > 0) {
    filtered = filtered.filter((product) => selectedSkinTypes.includes(product.subCategory));
  }

  setFilterProducts(filtered);
}, [selectedCategory, selectedBrands, selectedSkinTypes, products,search]);


  useEffect(() => {
    setFilterProducts(products);
  }, [products]);
 
    // Sorting logic
    useEffect(() => {
      let sortedProducts = [...filterProducts];
    
      if (sortOption === 'low-high') {
        sortedProducts.sort((a, b) => a.price - b.price); // Sort by price (ascending)
      } else if (sortOption === 'high-low') {
        sortedProducts.sort((a, b) => b.price - a.price); // Sort by price (descending)
      }
    
      // Only update state if sorting is applied
      if (sortOption !== 'relevant') {
        setFilterProducts(sortedProducts);
      }
    }, [sortOption, filterProducts]);

  return (
    <div className="flex gap-4 relative pt-20">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowFilter(true)}
        className="md:hidden px-4 py-2 bg-gray-800 text-white rounded-md  absolute top-28 left-4  "
      >
        Filters
      </button>

      {/* Sidebar Filters */}
      <div
        className={`fixed mt-28 inset-y-0 left-0 w-64 h-[35rem] bg-white   p-4 shadow-lg z-50 md:z-0 transform transition-transform duration-300 ${showFilter ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0`}
      >
        {/* Close Button for Mobile */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <p className="text-xl font-semibold">Filters</p>
          <button onClick={() => setShowFilter(false)}>
            <IoClose size={24} />
          </button>
        </div>

        <div className='font-bold text-2xl mb-4  hidden md:flex'>
        <p className="text-xl font-semibold ">Filters</p>
        </div>

        <FormControl className='w-full mb-4'>
  <InputLabel>Category</InputLabel>
  <Select
    multiple
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    input={<OutlinedInput label='Category' />}
    renderValue={(selected) => selected.join(', ')}
  >
    {categories.map((category) => (
      <MenuItem key={category} value={category}>
        <Checkbox checked={selectedCategory.includes(category)} />
        <ListItemText primary={category} />
      </MenuItem>
    ))}
  </Select>
</FormControl>


          {/* Filters */}
          <FormControl className='w-full mb-4'>
  <InputLabel>Skin Type</InputLabel>
  <Select
    multiple
    value={selectedSkinTypes}
    onChange={(e) => setSelectedSkinTypes(e.target.value)}
    input={<OutlinedInput label='Skin Type' />}
    renderValue={(selected) => selected.join(', ')}
  >
    {skinTypes.map((type) => (
      <MenuItem key={type} value={type}>
        <Checkbox checked={selectedSkinTypes.includes(type)} />
        <ListItemText primary={type} />
      </MenuItem>
    ))}
  </Select>
</FormControl>


 

      </div>

      {/* Product Listing */}
      <div className='flex-1 p-4 mt-12'>
      <div className='flex justify-between items-center mb-4 whitespace-nowrap'>
          <Tittle text1={'All'} text2={'Collection'} />
          <select
            className='border px-2 py-1 rounded-md'
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value='relevant'>Sort by: Relevant</option>
            <option value='low-high'>Sort by: Price Low to High</option>
            <option value='high-low'>Sort by: Price High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filterProducts.map((item, index) => (
            <ProductItems key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collection;
