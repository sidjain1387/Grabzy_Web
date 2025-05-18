import { useEffect, useState } from 'react';
import API_with_auth from '../../../api/api_with_auth';
import { Navigation } from '../Navigation/Navigation';

export default function Checkout() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone_number: '', address: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API_with_auth.get('/profile');
                setUser(res.data);
                setForm(res.data);
            } catch (err) {
                console.error("Profile fetch failed:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await API_with_auth.put('/profile/edit', form);
            setUser(res.data);
            setEditing(false);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleContinue = () => {
        if (!form.name || !form.email || !form.phone_number || !form.address) {
            alert("Please fill all fields.");
            return;
        }

        console.log("Proceeding with data:", form);
        // navigate('/payment') or call payment API
    };

    if (!user) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Navigation />
            <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Confirm Profile Info</h2>
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Edit Info
                        </button>
                    ) : (
                        <div className="space-x-2">
                            <button
                                onClick={() => setEditing(false)}
                                className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {['name', 'email', 'phone_number', 'address'].map(field => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-600 capitalize">
                                {field.replace('_', ' ')}
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    name={field}
                                    value={form[field]}
                                    disabled={field === 'email'}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 mt-1 border rounded ${field === 'email'
                                            ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'border-gray-300 bg-white'
                                        }`}
                                />
                            ) : (
                                <p className="text-gray-800 bg-gray-50 px-3 py-2 border rounded">{user[field]}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleContinue}
                        className="w-full py-3 bg-green-600 text-white rounded text-lg hover:bg-green-700 transition"
                    >
                        Continue to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
