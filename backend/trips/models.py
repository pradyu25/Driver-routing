
from django.db import models

class Trip(models.Model):
    start_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField(default=0.0)
    
    distance_miles = models.FloatField(null=True, blank=True)
    duration_hours = models.FloatField(null=True, blank=True)
    
    route_geometry = models.JSONField(null=True, blank=True)  # GeoJSON or encoded polyline
    eld_logs = models.JSONField(null=True, blank=True)  # The generated logs
    markers = models.JSONField(null=True, blank=True)  # Fuel stops, rest stops, etc.
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Trip {self.id}: {self.start_location} -> {self.dropoff_location}"
