from pymongo import MongoClient
from config import settings

client = MongoClient(settings.mongodb_url)
db = client[settings.database_name]

users_collection = db["users"]
watermarks_collection = db["watermarks"]

users_collection.create_index("email", unique=True)
