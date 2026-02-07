
workers = 2
bind = "0.0.0.0:8000"
timeout = 120
forwarded_allow_ips = '*'
secure_scheme_headers = {'X-Forwarded-Proto': 'https'}
