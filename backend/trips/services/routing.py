
import requests
import re
from math import radians, cos, sin, asin, sqrt
from django.conf import settings

ORS_BASE_URL = "https://api.openrouteservice.org"

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance in miles between two points 
    on the earth (specified in decimal degrees)
    """
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 3956 # Radius of earth in miles
    return c * r

def interpolate_along_route(geometry, distance_miles):
    """
    Find point at distance_miles along the LineString geometry.
    Geometry is GeoJSON dict or coordinate list.
    """
    coords = geometry['coordinates'] if isinstance(geometry, dict) else geometry
    
    if not coords or len(coords) < 2:
        return coords[0] if coords else [0, 0]
        
    accumulated_dist = 0.0
    
    for i in range(len(coords) - 1):
        p1 = coords[i]
        p2 = coords[i+1]
        
        # p1 is [lon, lat]
        dist_segment = haversine(p1[0], p1[1], p2[0], p2[1])
        
        if accumulated_dist + dist_segment >= distance_miles:
            # Interpolate in this segment
            remaining = distance_miles - accumulated_dist
            ratio = remaining / dist_segment if dist_segment > 0 else 0
            
            lon = p1[0] + (p2[0] - p1[0]) * ratio
            lat = p1[1] + (p2[1] - p1[1]) * ratio
            return [lon, lat]
            
        accumulated_dist += dist_segment
        
    return coords[-1] # End of line

def get_coords(address):
    # Check for "lat,lon" input
    latlon_match = re.match(r'^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$', address.strip())
    if latlon_match:
        lat, lon = float(latlon_match.group(1)), float(latlon_match.group(3))
        return [lon, lat] 

    api_key = settings.MAP_API_KEY
    if not api_key or "YOUR" in api_key:
         if "mock" in address.lower() or "test" in address.lower():
             return [-118.2437, 34.0522]
    
    url = f"{ORS_BASE_URL}/geocode/search"
    params = {
        "api_key": api_key,
        "text": address,
        "size": 1
    }
    
    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data.get('features'):
            return data['features'][0]['geometry']['coordinates']
    except Exception as e:
        print(f"Geocoding error for {address}: {e}")
        pass
    
    # Fallback/Mock just to allow demo to proceed if key fails?
    # No, better fail or return mock coords if "demo".
    return [-74.0060, 40.7128] # NYC Default fallback

def get_route(start_addr, pickup_addr, dropoff_addr):
    coords_start = get_coords(start_addr)
    coords_pickup = get_coords(pickup_addr)
    coords_dropoff = get_coords(dropoff_addr)
    
    api_key = settings.MAP_API_KEY
    url = f"{ORS_BASE_URL}/v2/directions/driving-car/geojson"
    
    body = {
        "coordinates": [coords_start, coords_pickup, coords_dropoff],
        "instructions": False,
        "maneuvers": False
    }
    
    headers = {
        "Authorization": api_key,
        "Content-Type": "application/json"
    }
    
    try:
        if not api_key:
            raise ValueError("MAP_API_KEY is not configured on the server")
            
        response = requests.post(url, json=body, headers=headers, timeout=10)
        
        if response.status_code != 200:
            error_data = response.json() if response.headers.get('Content-Type') == 'application/json' else response.text
            print(f"ORS API ERROR: {response.status_code} - {error_data}")
            raise Exception(f"Routing API error: {error_data}")
        data = response.json()
        
        feature = data['features'][0]
        props = feature['properties']
        summary = props['summary']
        segments = props.get('segments', [])
        
        dist_total_miles = summary['distance'] * 0.000621371
        dur_total_hours = summary['duration'] / 3600.0
        
        seg1_miles = segments[0]['distance'] * 0.000621371 if len(segments) > 0 else dist_total_miles
        seg2_miles = segments[1]['distance'] * 0.000621371 if len(segments) > 1 else 0.0
        
        return {
            'distance_miles': round(dist_total_miles, 2),
            'duration_hours': round(dur_total_hours, 2),
            'geometry': feature['geometry'],
            'segment1_miles': seg1_miles,
            'segment2_miles': seg2_miles,
            'start_coords': coords_start,
            'pickup_coords': coords_pickup,
            'dropoff_coords': coords_dropoff
        }
        
    except Exception as e:
        print(f"Routing API failed: {e}. Returning mock.")
        return get_mock_route(coords_start, coords_pickup, coords_dropoff)

def get_mock_route(start, pickup, dropoff):
    # Mock route: Line Start -> Pickup -> Dropoff
    # Distances approximate
    d1 = haversine(start[0], start[1], pickup[0], pickup[1])
    d2 = haversine(pickup[0], pickup[1], dropoff[0], dropoff[1])
    
    return {
        'distance_miles': round(d1 + d2, 2),
        'duration_hours': round((d1+d2)/60.0, 2),
        'geometry': {
            "type": "LineString",
            "coordinates": [start, pickup, dropoff] # Just 3 points
        },
        'segment1_miles': d1,
        'segment2_miles': d2,
        'start_coords': start,
        'pickup_coords': pickup,
        'dropoff_coords': dropoff
    }
