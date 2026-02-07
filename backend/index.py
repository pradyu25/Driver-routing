
import os
import sys

# Add the current directory to sys.path so that 'config' schema is found
# This file is in /backend/index.py
# We need to ensure imports work relative to /backend/

current_dir = os.path.dirname(__file__)
sys.path.append(current_dir)

from config.wsgi import application

# Vercel looks for 'app'
app = application
