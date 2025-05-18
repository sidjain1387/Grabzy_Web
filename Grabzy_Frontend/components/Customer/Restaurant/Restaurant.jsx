import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navigation } from '../../Customer/Navigation/Navigation'
import API_with_auth from '../../../api/api_with_auth'

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])

  const fetchRestaurants = async () => {
    const response = await API_with_auth.get('/restaurant/all_with_no_id')
    const data = response.data.list
    setRestaurants(data)
    setFiltered(data)
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    const filteredResults = restaurants.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(filteredResults)
  }, [search, restaurants])

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <div className="p-4">

      <h1 className="text-2xl font-semibold mb-4 text-indigo-600">Restaurants</h1>

      <input
        type="text"
        placeholder="Search restaurants..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/customer-menu/${restaurant.restaurant_id}`}
              className="block" 
            >
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
                <h2 className="text-lg font-bold text-indigo-600">{restaurant.name}</h2>
                <p className="text-gray-600">{restaurant.address}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No restaurants found.</p>
        )}
      </div>
    </div>
    </div>
    
  )
}

export default RestaurantPage
