
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrip } from '../api/api';
import MapView from '../components/MapView';
import PaperLogSheet from '../components/LogSheet';
import { Loader2, ArrowLeft, Info, Calendar, Map as MapIcon, Route, Clock, ChevronDown, ListChecks } from 'lucide-react';

const Results = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDay, setActiveDay] = useState(1);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const data = await getTrip(id);
                setTrip(data);
            } catch (err) {
                setError(err.message || 'Failed to retrieve trip data');
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    if (loading) return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-50">
            <Loader2 className="animate-spin w-12 h-12 text-brand-600 mb-4" />
            <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">Generating Regulatory Logs</p>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-red-100 text-center">
            <div className="text-red-500 mb-4 inline-block p-4 bg-red-50 rounded-full">
                <Info size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <Link to="/" className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
            </Link>
        </div>
    );

    if (!trip) return null;

    const StatsCard = ({ icon: Icon, label, value, subValue, color }) => (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">{label}</p>
                <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-black text-slate-900">{value}</span>
                    {subValue && <span className="text-xs font-bold text-slate-500">{subValue}</span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-100 text-slate-900 animate-in fade-in duration-500">
            {/* Header Overlay */}
            <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-lg z-30 shrink-0">
                <div className="flex items-center space-x-6">
                    <Link to="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors group">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black tracking-tight leading-none uppercase">Logistics Dashboard</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">TRIP ID: #{id} | {trip.start_location} → {trip.dropoff_location}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                        <span className="text-xs font-bold text-green-400 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                            ELD COMPLIANT
                        </span>
                    </div>
                    <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md">
                        Export Report
                    </button>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden">
                {/* Left Col: Map & Stats (60%) */}
                <div className="hidden lg:flex flex-col w-[60%] border-r border-slate-200 bg-slate-50">
                    <div className="grid grid-cols-3 gap-4 p-6 shrink-0 z-10">
                        <StatsCard
                            icon={Route}
                            label="Trip Distance"
                            value={Math.round(trip.distance_miles)}
                            subValue="MILES"
                            color="bg-blue-50 text-blue-600"
                        />
                        <StatsCard
                            icon={Clock}
                            label="Total Duration"
                            value={Math.round(trip.duration_hours)}
                            subValue="HOURS"
                            color="bg-amber-50 text-amber-600"
                        />
                        <StatsCard
                            icon={Calendar}
                            label="Schedule"
                            value={trip.eld_logs?.length || 0}
                            subValue="DAYS"
                            color="bg-purple-50 text-purple-600"
                        />
                    </div>

                    <div className="flex-grow p-6 pt-0 relative">
                        <div className="h-full rounded-2xl border-4 border-white shadow-xl overflow-hidden relative z-0">
                            <MapView routeGeometry={trip.route_geometry} markers={trip.markers} />
                        </div>
                    </div>
                </div>

                {/* Right Col: ELD Logs (40%) */}
                <div className="flex-grow lg:w-[40%] bg-slate-200 overflow-y-auto custom-scrollbar relative">
                    {/* Day Sticky Selector */}
                    <div className="sticky top-0 bg-slate-200/90 backdrop-blur pb-4 pt-6 px-6 z-20 flex space-x-2 overflow-x-auto no-scrollbar mask-gradient-right">
                        {trip.eld_logs?.map((dayLog) => (
                            <button
                                key={dayLog.day}
                                onClick={() => setActiveDay(dayLog.day)}
                                className={`shrink-0 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeDay === dayLog.day
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'bg-white text-slate-500 hover:bg-slate-300 shadow-sm border border-slate-300/50'
                                    }`}
                            >
                                Day {dayLog.day}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {trip.eld_logs?.map((dayLog) => (
                            <div
                                key={dayLog.day}
                                className={`transition-all duration-500 ${activeDay === dayLog.day ? 'opacity-100' : 'hidden'}`}
                            >
                                <PaperLogSheet dayData={dayLog} trip={trip} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
