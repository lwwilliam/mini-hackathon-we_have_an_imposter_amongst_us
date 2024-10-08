from flask import jsonify, request
from . import api_bp
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

@api_bp.route('/ai', methods=['GET'])
def openAPI():
    return 'Welcome AI'