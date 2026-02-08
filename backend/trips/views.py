import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Trip
from .serializers import TripSerializer, TripPlanSerializer
from .services.routing import get_route, interpolate_along_route
from .services.eld_engine import generate_eld_logs

class LocationSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
            
        api_key = settings.MAP_API_KEY
        if not api_key or "YOUR" in api_key:
            return Response({'error': 'MAP_API_KEY not configured on server'}, status=status.HTTP_400_BAD_REQUEST)

        url = "https://api.openrouteservice.org/geocode/autocomplete"
        params = {
            "api_key": api_key,
            "text": query,
            "size": 5
        }
        
        try:
            response = requests.get(url, params=params, timeout=5)
            if response.status_code != 200:
                # Return the actual error from ORS to help debug
                try:
                    error_detail = response.json()
                except:
                    error_detail = response.text
                return Response({'error': f'Routing API error: {error_detail}'}, status=response.status_code)
                
            data = response.json()
            suggestions = []
            for feature in data.get('features', []):
                suggestions.append({
                    'label': feature['properties'].get('label', ''),
                    'coords': feature['geometry'].get('coordinates', [])
                })
            return Response(suggestions)
        except Exception as e:
            return Response({'error': f'Geocoding request failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TripPlanView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        print(f"TRIP PLAN REQUEST: {request.data}")
        serializer = TripPlanSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            
            # 1. Routing Svc
            try:
                route_data = get_route(
                    data['start_location'], 
                    data['pickup_location'],
                    data['dropoff_location']
                )
            except Exception as e:
                print(f"TRIP PLAN FATAL ERROR: {e}")
                import traceback
                traceback.print_exc()
                return Response({'error': f"Internal Calculation Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

            # 2. ELD Logic
            eld_result = generate_eld_logs(
                route_data,
                data.get('current_cycle_used', 0.0)
            )
            logs = eld_result['logs']
            stops_meta = eld_result['stops']
            
            # 3. Process Markers
            markers = []
            
            # Add Start, Pickup, Dropoff
            markers.append({'type': 'START', 'lat': route_data['start_coords'][1], 'lon': route_data['start_coords'][0], 'label': 'Start'})
            pass_pickup_dist = route_data.get('segment1_miles', 0)
            markers.append({'type': 'PICKUP', 'lat': route_data['pickup_coords'][1], 'lon': route_data['pickup_coords'][0], 'label': 'Pickup'})
            markers.append({'type': 'DROPOFF', 'lat': route_data['dropoff_coords'][1], 'lon': route_data['dropoff_coords'][0], 'label': 'Dropoff'})
            
            # Interpolate stops
            geometry = route_data['geometry']
            for stop in stops_meta:
                coords = interpolate_along_route(geometry, stop['distance_miles'])
                markers.append({
                    'type': stop['type'],
                    'lat': coords[1],
                    'lon': coords[0],
                    'metadata': {'distance_miles': stop['distance_miles']}
                })

            # 4. Create Trip
            trip = Trip.objects.create(
                start_location=data['start_location'],
                pickup_location=data['pickup_location'],
                dropoff_location=data['dropoff_location'],
                current_cycle_used=data.get('current_cycle_used', 0.0),
                distance_miles=route_data['distance_miles'],
                duration_hours=route_data['duration_hours'],
                route_geometry=route_data['geometry'],
                eld_logs=logs,
                markers=markers
            )
            
            return Response(TripSerializer(trip).data, status=status.HTTP_201_CREATED)
<<<<<<< HEAD
        print(f"SERIALIZER ERRORS: {serializer.errors}")
=======
        
        print(f"SERIALIZER VALIDATION FAIL: {serializer.errors}")
>>>>>>> 36f6ab5707ebeb9a42869c160121836425122e34
        return Response({'error': 'Validation Failed', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class TripDetailView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def get(self, request, pk):
        trip = get_object_or_404(Trip, pk=pk)
        return Response(TripSerializer(trip).data)
