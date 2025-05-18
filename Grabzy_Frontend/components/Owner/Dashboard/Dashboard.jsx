import React, { useState } from 'react'
import { FiShoppingCart, FiUser } from 'react-icons/fi'
import { useNavigate,Link } from 'react-router-dom'
import { Navigation } from '../../Owner/Navigation/Navigation'

const DashBoard = () => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    navigate('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Content */}
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Hi Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/owner-restaurant" className="block">
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl cursor-pointer transition">
            <h2 className="text-lg font-semibold text-indigo-600">Your Restaurant</h2>
            <p className="text-gray-600 mt-2">Manage your restaurant operations and orders.</p>
          </div>
          </Link>

          {/* <Link to="/customer-canteen" className="block">
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl cursor-pointer transition">
            <h2 className="text-lg font-semibold text-indigo-600">Canteen</h2>
            <p className="text-gray-600 mt-2">Oversee your canteen services and menu items.</p>
          </div>
          </Link> */}
        </div>
      </div>
    </div>
  )
}

export default DashBoard
