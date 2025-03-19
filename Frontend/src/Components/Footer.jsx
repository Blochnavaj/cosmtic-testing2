import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className="container mx-auto px-6 py-10 sm:mt-36 mt-32">
      <div className="grid gap-14 sm:grid-cols-1 md:flex md:justify-around text-sm">
        
        {/* Logo & Description */}
        <div className="md:w-1/3">
          <img src={assets.logo} className="w-32 mb-3" alt="Company Logo" />
          <p className="font-semibold text-gray-700">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae ratione saepe expedita quibusdam ad sapiente perferendis, iure molestias pariatur quo neque nam vel officia esse asperiores aspernatur iste sed nihil!
          </p>
        </div>

        {/* Links Section */}
        <div className="flex   gap-6 md:flex-row flex-col md:gap-12">
          
          {/* Company Info */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">Company</p>
            <ul className="text-gray-600 space-y-2">
              <li><Link to='/about' >About Us</Link></li>
              <li><Link to='/'>Careers</Link></li>
              <li><Link to='/'>Blog</Link></li>
              <li><Link to='/'>Contact</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">Support</p>
            <ul className="text-gray-600 space-y-2">
              <li><Link to='/'>Help Center</Link></li>
              <li><Link to='/'>FAQ</Link></li>
              <li><Link to='/'>Privacy Policy</Link></li>
              <li><Link to='/'>Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">Contact</p>
            <ul className="text-gray-600 space-y-1">
              <li>Email: <a href="mailto:info@example.com" className="text-blue-500">info@example.com</a></li>
              <li>Phone: <a href="tel:+1234567890" className="text-blue-500">+1 234 567 890</a></li>
            </ul>
          </div>
        </div>
      </div>

     
    </div>
  )
}

export default Footer
