import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation } from '../../Owner/Navigation/Navigation';
import API_with_auth from '../../../api/api_with_auth'; 

const AddRestaurant = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [hasBranches, setHasBranches] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API_with_auth.post('/restaurant/add', { 
                name,
                address,
                description,
                have_branches: hasBranches === 'yes' ? true : false
            });

            navigate('/owner-restaurant');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="p-4 max-w-xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Add Restaurant</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Restaurant Name"
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Restaurant Address"
                        className="w-full border p-2 rounded"
                        required
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="w-full border p-2 rounded"
                        required
                    ></textarea>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Has Branches:</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    value="yes"
                                    checked={hasBranches === 'yes'}
                                    onChange={() => setHasBranches('yes')}
                                />
                                <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    value="no"
                                    checked={hasBranches === 'no'}
                                    onChange={() => setHasBranches('no')}
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRestaurant;
