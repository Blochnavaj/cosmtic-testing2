import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Add from "./Pages/Add";
import LIst from "./Pages/LIst";
import Orders from "./Pages/Orders";
import Navbar from "./Components/Navbar";
import SlideBar from "./Components/SlideBar";
import Login from "./Components/Login";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token])

  return (
    <BrowserRouter  >
      <div className="bg-gray-100 min-h-screen">
        <ToastContainer />
        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Navbar setToken={setToken} />
            <div className="flex">
              <SlideBar />
              <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-500 text-base">
                <Routes>
                  <Route path="/" element={<Orders token={token} />} /> {/* ✅ Default Route */}
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<LIst token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route path="*" element={<div>Page Not Found</div>} /> {/* ✅ Fallback Route */}
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
