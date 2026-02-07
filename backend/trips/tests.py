
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from .models import Trip

class TripPlanTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('trip-plan')
        self.mock_route_data = {
            'distance_miles': 1200.0, # Enough for 1 fuel stop
            'duration_hours': 20.0,
            'geometry': {
                "type": "LineString",
                "coordinates": [[0,0], [10,10], [20,20]] # Simplified
            },
            'segment1_miles': 600.0,
            'segment2_miles': 600.0,
            'start_coords': [0,0],
            'pickup_coords': [10,10],
            'dropoff_coords': [20,20]
        }

    @patch('trips.views.get_route')
    def test_plan_trip_success(self, mock_get_route):
        mock_get_route.return_value = self.mock_route_data
        
        data = {
            "start_location": "A",
            "pickup_location": "B", 
            "dropoff_location": "C",
            "current_cycle_used": 10.0
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Trip.objects.count(), 1)
        trip = Trip.objects.first()
        
        # Check logs structure
        self.assertIsNotNone(trip.eld_logs)
        self.assertTrue(len(trip.eld_logs) > 0)
        
        # Check markers
        # Distance 1200 miles -> Fuel stop at 1000.
        # Plus Start, Pickup, Dropoff.
        # Should have at least 4 markers (Start, Pickup, Dropoff, Fuel)
        # Plus rest stops maybe?
        self.assertIsNotNone(trip.markers)
        types = [m['type'] for m in trip.markers]
        self.assertIn('START', types)
        self.assertIn('PICKUP', types)
        self.assertIn('DROPOFF', types)
        self.assertIn('FUEL', types)

    @patch('trips.views.get_route')
    def test_plan_trip_api_fail(self, mock_get_route):
        mock_get_route.side_effect = Exception("API Error")
        
        data = {
            "start_location": "A",
            "pickup_location": "B", 
            "dropoff_location": "C"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
