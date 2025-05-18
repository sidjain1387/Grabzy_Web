import React, { useEffect, useState } from 'react';
import API_with_auth from '../../../api/api_with_auth';
import { useParams } from 'react-router-dom';
import { Navigation } from '../Navigation/Navigation';

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState({});
    const { restaurantId } = useParams();

    useEffect(() => {
        if (restaurantId) {
            fetchMenu();
        }
    }, [restaurantId]);

    const fetchMenu = async () => {
        try {
            const res = await API_with_auth.get(`/menu/all/${restaurantId}`);
            setMenuItems(res.data.list);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
        }
    };

    const handleAddToCart = (itemId) => {
        setCart((prevCart) => ({
            ...prevCart,
            [itemId]: 1
        }));
    };

    const handleIncreaseQty = (itemId) => {
        setCart((prevCart) => ({
            ...prevCart,
            [itemId]: prevCart[itemId] + 1
        }));
    };

    const handleDecreaseQty = (itemId) => {
        setCart((prevCart) => {
            const newQty = prevCart[itemId] - 1;
            if (newQty <= 0) {
                const { [itemId]: _, ...rest } = prevCart;
                return rest;
            }
            return {
                ...prevCart,
                [itemId]: newQty
            };
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Menu Items</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <div key={item.item_id} className="bg-white p-4 rounded shadow flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold">{item.name}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-indigo-600 font-semibold text-lg">₹{item.price}</p>
                                </div>
                            </div>

                            {/* <p
                                className={`font-semibold mt-2 ${item.available ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {item.available ? 'Available' : 'Unavailable'}
                            </p> */}

                            {item.available && (
                                <div className="mt-4">
                                    {!cart[item.item_id] ? (
                                        <button
                                            onClick={() => handleAddToCart(item.item_id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleDecreaseQty(item.item_id)}
                                                className="bg-gray-300 px-3 py-1 rounded"
                                            >
                                                −
                                            </button>
                                            <span className="font-semibold">{cart[item.item_id]}</span>
                                            <button
                                                onClick={() => handleIncreaseQty(item.item_id)}
                                                className="bg-gray-300 px-3 py-1 rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuList;
