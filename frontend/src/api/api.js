
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const planTrip = async (tripData) => {
    // tripData: start_location, pickup_location, dropoff_location, current_cycle_used
    const response = await api.post('/trips/plan/', tripData);
    return response.data;
};

export const getTrip = async (id) => {
    const response = await api.get(`/trips/${id}/`);
    return response.data;
};

export default api;
