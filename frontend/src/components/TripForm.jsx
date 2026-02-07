
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { planTrip } from '../api/api.js'; // fixed import path
import { Loader2 } from 'lucide-react';

const TripForm = () => {
    const [formData, setFormData] = useState({
        start_location: '',
        pickup_location: '',
        dropoff_location: '',
        current_cycle_used: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const trip = await planTrip(formData);
            navigate(`/results/${trip.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to plan trip. Check inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan New Trip</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Location</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="e.g. New York, NY"
                        value={formData.start_location}
                        onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="e.g. Philadelphia, PA"
                        value={formData.pickup_location}
                        onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="e.g. Washington, DC"
                        value={formData.dropoff_location}
                        onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Cycle Used (Hours)</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="70"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        value={formData.current_cycle_used}
                        onChange={(e) => setFormData({ ...formData, current_cycle_used: parseFloat(e.target.value) })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Generate Log & Route'}
                </button>
            </form>
        </div>
    );
};

export default TripForm;
