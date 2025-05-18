import React, { useEffect, useState } from 'react';
import API_with_auth from '../../../api/api_with_auth';
import { Navigation } from '../Navigation/Navigation';
import { useApp } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cartId } = useApp();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (cartId) {
            fetchCartItems();
        }
    }, [cartId]);

    const fetchCartItems = async () => {
        try {
            const res = await API_with_auth.get(`/cart_items/all_items_with_restaurant/${cartId}`);
            // Assuming backend sends: [{ itemId, name, description, price, quantity }]
            setCartItems(res.data.items);
            calculateTotal(res.data.items);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
        }
    };

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(sum);
    };

    const updateItemQuantity = async (itemId, action) => {
        try {
            if (action === 'increase') {
                await API_with_auth.put('/cart_items/increase-qty/', { itemId, cartId });
            } else if (action === 'decrease') {
                const currentItem = cartItems.find(item => item.itemId === itemId);
                if (currentItem.quantity === 1) {
                    await API_with_auth.delete('/cart_items/remove-item/', {
                        data: { itemId, cartId }
                    });
                } else {
                    await API_with_auth.put('/cart_items/decrease-qty/', { itemId, cartId });
                }
            }
            fetchCartItems(); // refresh after update
        } catch (error) {
            console.error(`Failed to ${action} quantity:`, error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="flex flex-col md:flex-row p-4 gap-6">

                {/* Left: Cart Items */}
                <div className="flex-1 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div
                                key={item.itemId}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <div>
                                    <h4 className="font-bold">{item.name}</h4>
                                    <p className="text-sm text-gray-500">₹{item.price} each</p>
                                    <p className="text-xs text-gray-400">From: {item.restaurant_name}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <button
                                            className="bg-gray-300 px-1 py-0.5 rounded text-xs"
                                            onClick={() => updateItemQuantity(item.itemid, 'decrease')}
                                        >
                                            −
                                        </button>
                                        <span className="text-sm">{item.quantity}</span>
                                        <button
                                            className="bg-gray-300 px-1 py-0.5 rounded text-xs"
                                            onClick={() => updateItemQuantity(item.itemid, 'increase')}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))


                    )}
                </div>

                {/* Right: Bill Summary */}
                <div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
                    <div className="space-y-2">
                        {cartItems.map(item => (
                            <div key={item.itemId} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <hr />
                        <div className="flex justify-between font-bold text-base mt-2">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                    <button
                        className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        onClick ={()=>navigate('/customer-checkout')}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
