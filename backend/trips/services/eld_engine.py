
import math

class ELDSimulator:
    def __init__(self, cycle_used=0.0):
        self.logs = [] # List of {day, logs: []}
        self.stops = [] # List of {type, distance_miles}
        
        self.current_time = 8.0 # Start 8 AM
        self.day = 1
        
        self.driving_today = 0.0
        self.duty_window_start = 8.0
        
        # We track cumulative distance on the TRIP route (not total lifetime)
        self.trip_dist = 0.0
        
        self.miles_since_fuel = 0.0
        
        # Initial OFF duty 0-8
        self.get_day_logs(1).append({"status": "OFF", "start": 0.0, "end": 8.0})

    def get_day_logs(self, day):
        # Check existing
        for d in self.logs:
            if d['day'] == day:
                return d['logs']
        # Create new
        entry = {"day": day, "date": f"Day {day}", "logs": []}
        self.logs.append(entry)
        return entry['logs']

    def add_log(self, status, duration):
        remaining = duration
        while remaining > 0.001: # Float epsilon
            day_idx = self.day
            logs = self.get_day_logs(day_idx)
            
            # Local time of day (0-24)
            # current_time is absolute hours from Day 1 00:00
            # E.g. 26.5 = Day 2, 02:30
            
            current_absolute_day = int(self.current_time / 24) + 1
            if current_absolute_day > self.day:
                self.day = current_absolute_day
                logs = self.get_day_logs(self.day)
            
            local_time = self.current_time % 24
            space_in_day = 24.0 - local_time
            
            chunk = min(remaining, space_in_day)
            
            logs.append({
                "status": status,
                "start": float(f"{local_time:.2f}"),
                "end": float(f"{local_time + chunk:.2f}")
            })
            
            self.current_time += chunk
            if status == 'DRIVING':
                 self.driving_today += chunk
                 
            remaining -= chunk

    def take_rest(self):
        # 10h SB (Sleeper Berth is more realistic for over-the-road logs)
        # Record Stop Location (Current distance)
        self.stops.append({'type': 'REST', 'distance_miles': self.trip_dist})
        
        self.add_log("SB", 10.0)
        self.driving_today = 0.0
        # New window starts when we come ON duty (which happens after rest)
        # Assuming we start immediately after rest
        self.duty_window_start = self.current_time

    def drive(self, miles_to_go):
        while miles_to_go > 0.001:
            dist_to_fuel = 1000.0 - self.miles_since_fuel
            
            # Time Limits
            hours_drive_left = 11.0 - self.driving_today
            
            # 14h window limit
            # Window expiry time = duty_window_start + 14
            # Hours left = Expiry - current_time
            hours_window_left = (self.duty_window_start + 14.0) - self.current_time
            
            if hours_drive_left <= 0.001 or hours_window_left <= 0.001:
                self.take_rest()
                # Recalculate limits (refreshed)
                continue

            max_drive_miles = min(hours_drive_left, hours_window_left) * 60.0
            
            # The chunk we can drive now
            chunk_dist = min(miles_to_go, dist_to_fuel, max_drive_miles)
            
            # Execute chunk
            chunk_time = chunk_dist / 60.0
            self.add_log("DRIVING", chunk_time)
            
            self.trip_dist += chunk_dist
            self.miles_since_fuel += chunk_dist
            miles_to_go -= chunk_dist
            
            # Events
            if self.miles_since_fuel >= 1000.0 - 0.001:
                # Fuel Stop
                self.stops.append({'type': 'FUEL', 'distance_miles': self.trip_dist})
                self.add_log("ON", 0.5) # 30 min
                self.miles_since_fuel = 0.0
                
                # Check 14h window again? 
                # Yes, but loop continues and checks at start
                
            # If we drove to limit, loop continues and takes rest next iter
            
    def simulate(self, seg1, seg2):
        # 1. Drive Segment 1
        self.drive(seg1)
        
        # 2. Pickup
        # Check window using simple check. If close to 14h, take rest first.
        if (self.current_time - self.duty_window_start + 1.0) > 14.0:
            self.take_rest()
        # Pickup is 1h ON. The start of this 1h is Start of Duty if previously OFF?
        # But we were driving, so clock is running.
        self.add_log("ON", 1.0)
        
        # 3. Drive Segment 2
        self.drive(seg2)
        
        # 4. Dropoff
        if (self.current_time - self.duty_window_start + 1.0) > 14.0:
            self.take_rest()
        self.add_log("ON", 1.0)
        
        # End OFf
        self.add_log("OFF", 24.0 - (self.current_time % 24))
        
        return self.logs, self.stops

def generate_eld_logs(route_data, cycle_used):
    sim = ELDSimulator(cycle_used)
    
    seg1 = route_data.get('segment1_miles', 0)
    seg2 = route_data.get('segment2_miles', 0)
    
    if seg1 == 0 and seg2 == 0:
        total = route_data.get('distance_miles', 0)
        seg1 = total * 0.5
        seg2 = total * 0.5
        
    logs, stops = sim.simulate(seg1, seg2)
    return {'logs': logs, 'stops': stops}
