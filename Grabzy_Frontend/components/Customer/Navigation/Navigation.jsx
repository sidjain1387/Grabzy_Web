import React, { useState } from 'react'
import { FiShoppingCart, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export const Navigation = () => {
    const [showDropdown, setShowDropdown] = useState(false)
    const navigate = useNavigate()

    const handleSignOut = () => {
        localStorage.removeItem('token')
        navigate('/signin')
    }
    return (
        <>

            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-indigo-600">GRABZY</div>

                <div className="flex items-center space-x-4 relative">
                    <FiShoppingCart className="text-2xl cursor-pointer" />

                    <div className="relative">
                        <FiUser
                            className="text-2xl cursor-pointer"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                                <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</li>
                                    <li
                                        className="px-4 py-2 hover:bg-red-100 text-red-500 font-semibold cursor-pointer"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>

    )
}
