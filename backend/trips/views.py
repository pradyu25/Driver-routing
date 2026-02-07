
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Trip
from .serializers import TripSerializer, TripPlanSerializer
from .services.routing import get_route, interpolate_along_route
from .services.eld_engine import generate_eld_logs

class TripPlanView(APIView):
    def post(self, request):
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
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TripDetailView(APIView):
    def get(self, request, pk):
        trip = get_object_or_404(Trip, pk=pk)
        return Response(TripSerializer(trip).data)
