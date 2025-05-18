import React, { useEffect, useState, useContext } from 'react';
import API_with_auth from '../../../api/api_with_auth';
import { useParams } from 'react-router-dom';
import { Navigation } from '../Navigation/Navigation';
import { useApp } from '../../../context/AppContext';  // example path

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState({});
    const { restaurantId } = useParams();
    const { cartId } = useApp();  // get cartId from context

    useEffect(() => {
        if (restaurantId) {
            fetchMenu();
            if(cartId) fetchCartItems();  // fetch cart items if cartId available
        }
    }, [restaurantId, cartId]);


    const fetchMenu = async () => {
        try {
            const res = await API_with_auth.get(`/menu/all/${restaurantId}`);
            setMenuItems(res.data.list);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
        }
    };

    const fetchCartItems = async () => {
        try {
            const res = await API_with_auth.get(`/cart_items/all/${cartId}`);
            // Assuming backend sends { items: [{itemId, quantity}, ...]}
            const items = res.data.items.reduce((acc, item) => {
                acc[item.itemId] = item.quantity;
                return acc;
            }, {});
            setCart(items);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        }
    };

    const handleAddToCart = async (itemId) => {
        console.log("cartId 11111:", cartId);

        if (!cartId) {
            alert("Cart not initialized!");
            return;
        }
        try {
            await API_with_auth.post(`/cart_items/add-item/`, { itemId, quantity: 1, cartId });
            setCart((prevCart) => ({
                ...prevCart,
                [itemId]: 1
            }));
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        }
    };

    const handleIncreaseQty = async (itemId) => {
        if (!cartId) return;
        try {
            await API_with_auth.put(`/cart_items/increase-qty/`, { itemId, cartId }); // increase by 1
            setCart((prevCart) => ({
                ...prevCart,
                [itemId]: prevCart[itemId] + 1
            }));
        } catch (error) {
            console.error("Failed to increase quantity:", error);
        }
    };

    const handleDecreaseQty = async (itemId) => {
        console.log("cartId 22222:", cartId);
        if (!cartId) return;
        try {
            if (cart[itemId] === 1) {
                // remove item from cart
                await API_with_auth.delete(`/cart_items/remove-item/`, {
                    data: { itemId, cartId }
                });
                setCart((prevCart) => {
                    const { [itemId]: _, ...rest } = prevCart;
                    return rest;
                });
            } else {
                // decrease quantity by 1
                await API_with_auth.put(`/cart_items/decrease-qty/`, { itemId, cartId }); // increase by 1
                setCart((prevCart) => ({
                    ...prevCart,
                    [itemId]: prevCart[itemId] - 1
                }));
            }
        } catch (error) {
            console.error("Failed to decrease quantity:", error);
        }
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
