
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrip } from '../api/api';
import MapView from '../components/MapView';
import LogSheet from '../components/LogSheet';
import { Loader2, ArrowLeft, Clock, Map as MapIcon, Calendar } from 'lucide-react';

const Results = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const data = await getTrip(id);
                setTrip(data);
            } catch (err) {
                setError(err.message || 'Failed to load trip');
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
    if (error) return <div className="text-red-500 text-center p-10">{error}</div>;
    if (!trip) return null;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center text-blue-600 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> New Trip
                </Link>
                <h2 className="text-2xl font-bold text-gray-800">Trip Results #{id}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Details & Map */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                            <MapIcon className="w-5 h-5 mr-2" /> Route Summary
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Origin:</span> <span className="font-medium text-right">{trip.start_location}</span></div>
                            <div className="flex justify-between"><span>Pickup:</span> <span className="font-medium text-right">{trip.pickup_location}</span></div>
                            <div className="flex justify-between"><span>Destination:</span> <span className="font-medium text-right">{trip.dropoff_location}</span></div>
                            <hr />
                            <div className="flex justify-between text-blue-600">
                                <span>Total Distance:</span>
                                <span className="font-bold">{Math.round(trip.distance_miles)} mi</span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                                <span>Est. Duration:</span>
                                <span className="font-bold">{Math.round(trip.duration_hours)} hrs</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Map */}
                <div className="lg:col-span-2">
                    <MapView routeGeometry={trip.route_geometry} markers={trip.markers} />
                </div>
            </div>

            {/* Logs Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-6 flex items-center border-b pb-2">
                    <Calendar className="w-5 h-5 mr-2" /> Daily HOS Logs (Simulated)
                </h3>
                <LogSheet eldLogs={trip.eld_logs} />
            </div>
        </div>
    );
};

export default Results;
