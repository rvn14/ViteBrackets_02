import os
# from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB settings
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DB_NAME = 'Spirit11'
COLLECTION_NAME = 'Players'

# API settings
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY_1')
CLASSIFIER_GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY_2')
MODEL_NAME = 'gemini-1.5-pro'

# CORS settings
CORS_ORIGINS = os.getenv('CORS_ORIGINS')
