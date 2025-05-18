import React, { useEffect, useState } from 'react';
import API_with_auth from '../../../api/api_with_auth';
import { useParams } from 'react-router-dom';
import { Navigation } from '../Navigation/Navigation';


const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        pieces_left: '',
        available: true
    });
    const [editItemId, setEditItemId] = useState(null);

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewItem((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editItemId) {
                // Edit existing item
                await API_with_auth.put(`/menu/update/${editItemId}`, {
                    ...newItem,
                    price: parseFloat(newItem.price),
                    restaurant_id: restaurantId,
                });
            } else {
                // Add new item
                await API_with_auth.post('/menu/add', {
                    ...newItem,
                    price: parseFloat(newItem.price),
                    restaurant_id: restaurantId,
                });
            }

            setShowForm(false);
            setEditItemId(null);
            setNewItem({ name: '', description: '', price: '', pieces_left: '', available: true });
            fetchMenu();
        } catch (error) {
            console.error('Error submitting item:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await API_with_auth.delete(`/menu/delete/${id}`);
            fetchMenu();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };



    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Menu Items</h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Add Menu Item
                    </button>
                </div>

                {/* Add Item Form */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative  border border-gray-500">
                            <h3 className="text-xl font-semibold mb-4">
                                {editItemId ? 'Edit Menu Item' : 'Add Menu Item'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={newItem.name}
                                        onChange={handleChange}
                                        placeholder="Item Name"
                                        className="p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="price"
                                        value={newItem.price}
                                        onChange={handleChange}
                                        placeholder="Price"
                                        className="p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        value={newItem.description}
                                        onChange={handleChange}
                                        placeholder="Description"
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        name="pieces_left"
                                        value={newItem.pieces_left}
                                        onChange={handleChange}
                                        placeholder="Pieces Left"
                                        className="p-2 border rounded"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor="available">Available</label>
                                        <input
                                            type="checkbox"
                                            name="available"
                                            checked={newItem.available}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Save Item
                                    </button>
                                </div>
                            </form>
                            {/* Close Button (optional top-right corner) */}
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                                onClick={() => setShowForm(false)}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}


                {/* Menu Items Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <div key={item.item_id} className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            <p className="text-gray-600">{item.description}</p>
                            <p className="text-indigo-600 font-semibold">₹{item.price}</p>
                            <p>Pieces Left: {item.pieces_left}</p>
                            <p
                                className={`font-semibold ${item.available ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {item.available ? 'Available' : 'Unavailable'}
                            </p>
                            <p className="text-sm text-gray-500">
                                Added on: {new Date(item.created_at).toLocaleString()}
                            </p>
                            <div className="flex justify-end space-x-2 mt-2">
                                <button
                                    onClick={() => {
                                        setEditItemId(item.item_id);
                                        setNewItem({
                                            name: item.name,
                                            description: item.description,
                                            price: item.price,
                                            pieces_left: item.pieces_left,
                                            available: item.available,
                                        });
                                        setShowForm(true);
                                    }}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.item_id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuList;
