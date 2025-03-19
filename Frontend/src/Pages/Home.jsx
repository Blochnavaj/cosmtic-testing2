import React from 'react'
import Hero from '../Components/Hero'
import LatestCollection from '../Components/LatestCollection'
import BestSeller from '../Components/BestSeller'
import OurPolicy from '../Components/OurPolicy'
import NewsLetterBox from '../Components/NewsLetterBox'
import AllProductList from '../Components/AllProductList'
import MostCategory from '../Components/MostCategory'
 
function Home() {
  return (
    <div> 
       <Hero/>
       <AllProductList/>
        <LatestCollection/>
       <BestSeller/>
       <MostCategory/>
       <OurPolicy/>
       <NewsLetterBox/>
    </div>
  )
}

export default Home