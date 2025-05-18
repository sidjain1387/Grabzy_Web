import { useEffect, useState } from 'react';
import API_with_auth from '../../../api/api_with_auth';
import { Navigation } from '../Navigation/Navigation';
import { Pencil, Save, X } from 'lucide-react'; // Install lucide-react for icons

export default function Profile() {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone_number: '', address: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API_with_auth.get('/profile');
                setUser(res.data);
                setForm(res.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
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
            console.error("Save failed:", err);
        }
    };

    if (!user) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Navigation />
            <div className="max-w-3xl mx-auto mt-12 px-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-gray-800">My Profile</h2>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditing(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {['name', 'email', 'phone_number', 'address'].map((field) => (
                            <div key={field}>
                                <label className="block mb-1 text-sm font-medium text-gray-600 capitalize">
                                    {field.replace('_', ' ')}
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        name={field}
                                        value={form[field]}
                                        disabled={field === 'email'}
                                        onChange={handleChange}
                                        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition ${field === 'email'
                                                ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'border-gray-800 bg-white'
                                            }`}
                                    />
                                ) : (
                                    <p className="text-gray-700 text-base bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                        {user[field]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
