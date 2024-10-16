from flask import jsonify, request
from . import api_bp
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

load_dotenv()
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")

mongo_client = MongoClient(f'mongodb+srv://{DB_USER}:{DB_PASSWORD}@data.rnsqw.mongodb.net/')
db = mongo_client['experian']
tags_collection = db['tags']
pdf_collection = db['pdf']

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

@api_bp.route('/getPdfWithTags', methods=['GET'])
def getPdfWithTags():
    tags_id = request.json.get('tags')

    if not tags_id:
        return jsonify({"error": "No tags provided"}), 400
    for tag_id in tags_id:
        if not ObjectId.is_valid(tag_id):
            return jsonify({"error": "Invalid tag id"}), 400
        else:
            ObjectId(tag_id)
    
    res = pdf_collection.find({"tags_id": {"$all": tags_id}})
    res = list(res)

    pdfs = []
    for pdf in res:
        pdf['_id'] = str(pdf['_id'])
        pdfs.append(pdf)

    if not pdfs:
        return jsonify({"error": "No pdfs found with the tags"}), 404
    return jsonify(pdfs), 200

@api_bp.route('/getTags', methods=['GET'])
def getTags():
    tags_array = request.args.get('tags')
    arr = tags_array.split(',')
    tagname_arr = []
    for tag in arr:
        tag = tag.strip()
        tags_find = tags_collection.find_one({"_id": ObjectId(tag)})
        if tags_find:
            tagname_arr.append(tags_find['tag_name'])
        else:
            return jsonify({"error": "Tags not found"}), 404
    return jsonify(tagname_arr), 209