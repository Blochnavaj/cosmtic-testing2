import React, { useState } from "react";
import axios from 'axios'
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({setToken}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading , setLoading ] = useState(false);
 
  const onSumbitHandler = async (e) => {
    setLoading(true);
    try {
       e.preventDefault();
       const response = await axios.post(backendUrl + '/api/user/admin' ,{email,password})
        if(response.data.success) {
          setToken(response.data.token)
        } else {
           toast.error(response.data.message);
        }
       
    } catch (error) {
       console.log(error)
       toast.error(error.message);

    } finally{
      setLoading (false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
        <form onSubmit={onSumbitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" 
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg transition duration-300 flex justify-center items-center ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
       
      </div>
    </div>
  );
};

export default Login;