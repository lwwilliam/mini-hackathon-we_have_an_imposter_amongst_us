from flask import jsonify, request
from . import api_bp
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")

mongo_client = MongoClient(f'mongodb+srv://{DB_USER}:{DB_PASSWORD}@data.rnsqw.mongodb.net/')
db = mongo_client['experian']
tags_collection = db['tags']

@api_bp.route('/createTags', methods=['POST'])
def createTags():
	tags = request.json.get('tags')

	if not tags:
		return jsonify({"error": "No tags provided"}), 400
	
	tags_find = tags_collection.find_one({"tags_name": tags})

	if tags_find:
		return jsonify({"error": "Tags already exist"}), 400
	
	tags_collection.insert_one({"tags_name": tags})
	return jsonify({"message": "Tags created successfully"}), 201

@api_bp.route('/getAllTags', methods=['GET'])
def getAllTags():
	tags = []

	for tag in tags_collection.find({}):
		tag['_id'] = str(tag['_id'])
		tags.append(tag)
	return jsonify(tags), 200