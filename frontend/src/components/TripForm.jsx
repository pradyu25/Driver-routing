
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { planTrip } from '../api/api.js';
import { Loader2, MapPin, Navigation, Truck, ClipboardList } from 'lucide-react';

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
            setError(err.response?.data?.error || 'Failed to plan trip. Verify address details.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 border transition-all duration-200 hover:border-slate-300";
    const labelClasses = "flex items-center text-sm font-semibold text-slate-700 mb-1";

    return (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-brand-50 rounded-xl">
                    <Truck className="w-8 h-8 text-brand-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trip Planner</h2>
                    <p className="text-slate-500 font-medium">Generate FMCSA compliant route and logs</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 text-sm flex items-start">
                    <span className="font-bold mr-2">Error:</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClasses}>
                            <Navigation className="w-4 h-4 mr-2 text-slate-400" /> Current Location
                        </label>
                        <input
                            type="text"
                            required
                            className={inputClasses}
                            placeholder="Address or City, State"
                            value={formData.start_location}
                            onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <MapPin className="w-4 h-4 mr-2 text-brand-500" /> Pickup Point
                        </label>
                        <input
                            type="text"
                            required
                            className={inputClasses}
                            placeholder="Company Name, Address"
                            value={formData.pickup_location}
                            onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <MapPin className="w-4 h-4 mr-2 text-red-500" /> Drop-off Point
                        </label>
                        <input
                            type="text"
                            required
                            className={inputClasses}
                            placeholder="Destination Address"
                            value={formData.dropoff_location}
                            onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClasses}>
                            <ClipboardList className="w-4 h-4 mr-2 text-slate-400" /> Current Cycle Used (Hours)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="70"
                                className={inputClasses}
                                value={formData.current_cycle_used}
                                onChange={(e) => setFormData({ ...formData, current_cycle_used: parseFloat(e.target.value) })}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">/ 70 HRS</div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 mt-4 flex items-center justify-center rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-lg font-bold shadow-lg shadow-brand-500/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <Loader2 className="animate-spin h-6 w-6 mr-3" />
                            <span>Calculating Route & Logs...</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <span>Plan Compliant Trip</span>
                            <Navigation className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TripForm;
