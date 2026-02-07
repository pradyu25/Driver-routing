
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { planTrip } from '../api/api.js';
import { Loader2, Navigation, Truck, ClipboardList, TrendingUp, MapPin } from 'lucide-react';

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", subLabel }) => (
    <div className="space-y-2">
        <label className="flex items-center text-sm font-semibold text-slate-700 ml-1">
            {Icon && <Icon className="w-4 h-4 mr-2 text-slate-400" />}
            {label}
        </label>
        <div className="relative group/input">
            <input
                type={type}
                step={type === "number" ? "0.1" : undefined}
                min={type === "number" ? "0" : undefined}
                max={type === "number" ? "70" : undefined}
                className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 backdrop-blur-sm text-lg font-black text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 shadow-sm"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
            />
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-brand-500 transition-colors" />}
            {subLabel && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-200 rounded-lg text-[10px] font-black text-slate-500 tracking-tighter">
                    {subLabel}
                </div>
            )}
        </div>
    </div>
);

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
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

            <div className="relative bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/50">
                <div className="flex items-center space-x-5 mb-12">
                    <div className="p-4 bg-brand-600 rounded-2xl shadow-lg shadow-brand-500/40 transform -rotate-3">
                        <Truck className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                            Intelligence <span className="text-brand-600">Scheduler</span>
                        </h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 border-l-2 border-brand-200 pl-3">
                            Discrete Location Entry Framework
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50/50 backdrop-blur border-l-4 border-red-500 text-red-900 p-5 rounded-r-3xl mb-8 animate-in slide-in-from-left-2 duration-300">
                        <p className="text-xs font-black uppercase tracking-wider mb-1 text-red-600">Configuration Error</p>
                        <p className="font-semibold text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="md:col-span-2">
                            <InputField
                                label="Fleet Origin"
                                icon={Navigation}
                                placeholder="Starting City, State or Address"
                                value={formData.start_location}
                                onChange={(val) => setFormData({ ...formData, start_location: val })}
                            />
                        </div>

                        <InputField
                            label="Pickup Point"
                            icon={MapPin}
                            placeholder="Facility City, State"
                            value={formData.pickup_location}
                            onChange={(val) => setFormData({ ...formData, pickup_location: val })}
                        />

                        <InputField
                            label="Final Distribution"
                            icon={MapPin}
                            placeholder="Destination City, State"
                            value={formData.dropoff_location}
                            onChange={(val) => setFormData({ ...formData, dropoff_location: val })}
                        />

                        <div className="md:col-span-2">
                            <InputField
                                label="Current Cycle Consumption"
                                icon={TrendingUp}
                                type="number"
                                subLabel="/ 70 HOURS USED"
                                placeholder="0.0"
                                value={formData.current_cycle_used}
                                onChange={(val) => setFormData({ ...formData, current_cycle_used: parseFloat(val) || 0 })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full h-20 overflow-hidden rounded-3xl group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 bg-[length:200%_100%] animate-gradient"></div>
                        <div className="relative flex items-center justify-center h-full text-white">
                            {loading ? (
                                <div className="flex items-center space-x-4">
                                    <Loader2 className="animate-spin h-8 w-8" />
                                    <span className="text-xl font-black uppercase tracking-widest">Compiling Simulation...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl font-black uppercase tracking-wider">Initialize Routing</span>
                                    <Navigation className="w-6 h-6 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </div>
                            )}
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TripForm;
