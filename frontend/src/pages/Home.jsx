
import React from 'react';
import TripForm from '../components/TripForm';

const Home = () => {
    return (
        <div className="space-y-4">
            <div className="text-center max-w-2xl mx-auto mb-8">
                <p className="text-xl text-gray-600">
                    Plan your next commercial trip with automated HOS compliance.
                    Enter your route details below to generate a legal driving schedule and map.
                </p>
            </div>
            <TripForm />

            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-2 text-blue-600">Intelligent Routing</h3>
                    <p className="text-sm text-gray-500">Optimized heavy-duty truck routes using OpenRouteService.</p>
                </div>
                <div className="p-4 bg-white rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-2 text-green-600">ELD Compliance</h3>
                    <p className="text-sm text-gray-500">Auto-generated duty logs adhering to 11h/14h/70h rules.</p>
                </div>
                <div className="p-4 bg-white rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-2 text-purple-600">Visualization</h3>
                    <p className="text-sm text-gray-500">Interactive maps with mandatory fuel & rest stop markers.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
