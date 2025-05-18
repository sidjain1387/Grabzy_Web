import React, { useEffect, useState } from 'react';
import { useNavigate ,  } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { Navigation } from '../Navigation/Navigation';
import API_with_auth from '../../../api/api_with_auth';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await API_with_auth.get('/restaurant/all');
      console.log(res.data.list);
      setRestaurants(res.data.list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
  try {
    await API_with_auth.delete(`/restaurant/delete/${id}`);
    setRestaurants((prevRestaurants) =>
      prevRestaurants.filter((rest) => rest.restaurant_id !== id)
    );
  } catch (err) {
    console.error(err);
  }
};


  return (
        <div className="min-h-screen bg-gray-100">
            <Navigation/>

    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Restaurants</h2>
        <button
          onClick={() => navigate('/owner-add-restaurant')}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" /> Add Restaurant
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((rest) => (
          <div key={rest.restaurant_id} className="bg-white p-4 rounded shadow relative">
            <h3 className="text-lg font-bold mb-2">{rest.name}</h3>
            <p>{rest.description}</p>
            <div className="absolute top-2 right-2 flex space-x-2">
              <FiEdit
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate(`/edit-restaurant/${rest.restaurant_id}`)}
              />
              <FiTrash2
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(rest.restaurant_id)}
              />
            </div>
            <button
              className="mt-4 text-indigo-600 underline"
              onClick={() => navigate(`/owner-menu-items/${rest.restaurant_id}`)}
            >
              View Menu
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default RestaurantList;
