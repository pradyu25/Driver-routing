
from rest_framework import serializers
from .models import Trip

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('distance_miles', 'duration_hours', 'route_geometry', 'eld_logs', 'created_at')

class TripPlanSerializer(serializers.Serializer):
    start_location = serializers.CharField(max_length=255)
    pickup_location = serializers.CharField(max_length=255)
    dropoff_location = serializers.CharField(max_length=255)
    current_cycle_used = serializers.FloatField(required=False, default=0.0)
