
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { planTrip } from '../api/api.js';
import LocationAutocomplete from './LocationAutocomplete';
import { Loader2, Navigation, Truck, ClipboardList, TrendingUp } from 'lucide-react';

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

    return (
        <div className="max-w-4xl mx-auto relative group">
            {/* Glow Decorative Elements */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center space-x-5">
                        <div className="p-4 bg-brand-600 rounded-2xl shadow-lg shadow-brand-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <Truck className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                                Intelligence <span className="text-brand-600">Scheduler</span>
                            </h2>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 border-l-2 border-brand-200 pl-3">
                                Autonomous Logistics Framework
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50/50 backdrop-blur border-l-4 border-red-500 text-red-900 p-5 rounded-r-3xl mb-8 animate-in slide-in-from-left-2 duration-300">
                        <p className="text-xs font-black uppercase tracking-wider mb-1">Configuration Error</p>
                        <p className="font-semibold text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Autocomplete Fields */}
                        <div className="md:col-span-2">
                            <LocationAutocomplete
                                label="Fleet Origin"
                                placeholder="Starting terminal location..."
                                value={formData.start_location}
                                onChange={(val) => setFormData({ ...formData, start_location: val })}
                                icon={Navigation}
                            />
                        </div>

                        <LocationAutocomplete
                            label="Pickup Point"
                            placeholder="Facility or city..."
                            value={formData.pickup_location}
                            onChange={(val) => setFormData({ ...formData, pickup_location: val })}
                        />

                        <LocationAutocomplete
                            label="Final Distribution"
                            placeholder="Delivery destination..."
                            value={formData.dropoff_location}
                            onChange={(val) => setFormData({ ...formData, dropoff_location: val })}
                        />

                        {/* Numeric Field with Styled Input */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center text-sm font-semibold text-slate-700 ml-1">
                                <ClipboardList className="w-4 h-4 mr-2 text-slate-400" />
                                Current Cycle Consumption
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="70"
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 backdrop-blur-sm text-lg font-black text-slate-900 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all duration-300"
                                    value={formData.current_cycle_used}
                                    onChange={(e) => setFormData({ ...formData, current_cycle_used: parseFloat(e.target.value) || 0 })}
                                />
                                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-brand-500 transition-colors" />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-200 rounded-lg text-[10px] font-black text-slate-500 tracking-tighter">
                                    / 70 HOURS USED
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Primary Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full h-20 overflow-hidden rounded-3xl group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {/* Animated Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 bg-[length:200%_100%] animate-gradient group-hover/btn:animate-none transition-all duration-500"></div>

                            <div className="relative flex items-center justify-center h-full px-8 text-white">
                                {loading ? (
                                    <div className="flex items-center space-x-4">
                                        <Loader2 className="animate-spin h-8 w-8" />
                                        <span className="text-xl font-black uppercase tracking-widest">Compiling Simulation...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-2xl font-black uppercase tracking-wider">Initialize Routing</span>
                                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur group-hover/btn:bg-white/30 transition-colors">
                                            <Navigation className="w-6 h-6 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripForm;
