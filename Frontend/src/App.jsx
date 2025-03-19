import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Orders from "./Pages/Orders";
import PlaceOrder from "./Pages/PlaceOrder";
import About from "./Pages/About";
import Collection from "./Pages/Collection";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import SearchBar from "./Components/SearchBar";
import ScrollToTop from "./Components/ScrollToTop"; 
import { ToastContainer  } from 'react-toastify';
import Verify from "./Pages/Verify";


function App() {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <BrowserRouter  >
      <ToastContainer />

        <ScrollToTop />  {/* 👈 Add this line for scrolling to top on route change */}
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
