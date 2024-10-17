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
jd_collection = db['jobDescription']

@api_bp.route('/createJobDescription', methods=['POST'])
def createJobDescription():
    data = request.json

    required_fields = ['title', 'mode', 'type', 'position', 'location', 'description', 'qualifications', 'responsibilities']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    title = data.get('title')
    mode = data.get('mode')
    job_type = data.get('type')
    position = data.get('position')
    location = data.get('location')
    description = data.get('description')
    
    qualifications = data.get('qualifications', {})
    pastExperience = qualifications.get('pastExperience', [])
    technical = qualifications.get('technical', [])
    soft = qualifications.get('soft', [])

    responsibilities = data.get('responsibilities', [])

    jd_collection.insert_one({
        'title': title,
        'mode': mode,
        'type': job_type,
        'position': position,
        'location': location,
        'description': description,
        'qualifications': {
            'pastExperience': pastExperience,
            'technical': technical,
            'soft': soft
        },
        'responsibilities': responsibilities
    })

    return jsonify({'message': 'Job description created successfully'}), 201

@api_bp.route('/getAllJobDescriptions', methods=['GET'])
def getAllJobDescriptions():
    jobDescriptions = []

    for jd in jd_collection.find({}):
        jd['_id'] = str(jd['_id'])
        jobDescriptions.append(jd)

    return jsonify(jobDescriptions), 200

@api_bp.route('/getJobDescription', methods=['GET'])
def getJobDescription():
    jd_id = request.args.get('id')

    if not jd_id:
        return jsonify({'error': 'No job description id provided'}), 400

    if not ObjectId.is_valid(jd_id):
        return jsonify({'error': 'Invalid job description id'}), 400

    jd = jd_collection.find_one({'_id': ObjectId(jd_id)})

    if not jd:
        return jsonify({'error': 'Job description not found'}), 404

    jd['_id'] = str(jd['_id'])

    return jsonify(jd), 200

@api_bp.route('/updateJobDescription', methods=['PUT'])
def updateJobDescription():
    data = request.json

    required_fields = ['_id', 'title', 'mode', 'type', 'position', 'location', 'description', 'qualifications', 'responsibilities']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    jd_id = data.get('_id')

    if not ObjectId.is_valid(jd_id):
        return jsonify({'error': 'Invalid job description id'}), 400

    title = data.get('title')
    mode = data.get('mode')
    job_type = data.get('type')
    position = data.get('position')
    location = data.get('location')
    description = data.get('description')
    
    qualifications = data.get('qualifications', {})
    pastExperience = qualifications.get('pastExperience', [])
    technical = qualifications.get('technical', [])
    soft = qualifications.get('soft', [])

    responsibilities = data.get('responsibilities', [])

    jd_collection.update_one(
        {'_id': ObjectId(jd_id)},
        {
            '$set': {
                'title': title,
                'mode': mode,
                'type': job_type,
                'position': position,
                'location': location,
                'description': description,
                'qualifications': {
                    'pastExperience': pastExperience,
                    'technical': technical,
                    'soft': soft
                },
                'responsibilities': responsibilities
            }
        }
    )

    return jsonify({'message': 'Job description updated successfully'}), 200

@api_bp.route('/deleteJobDescription', methods=['DELETE'])
def deleteJobDescription():
    jd_id = request.args.get('id')

    if not jd_id:
        return jsonify({'error': 'No job description id provided'}), 400

    if not ObjectId.is_valid(jd_id):
        return jsonify({'error': 'Invalid job description id'}), 400

    jd = jd_collection.find_one({'_id': ObjectId(jd_id)})

    if not jd:
        return jsonify({'error': 'Job description not found'}), 404

    jd_collection.delete_one({'_id': ObjectId(jd_id)})

    return jsonify({'message': 'Job description deleted successfully'}), 200

@api_bp.route('/getJDWithTags', methods=['GET'])
def getJDWithTags():
    tags_array = request.args.get('tags')
    
    if not tags_array:
        return jsonify({'error': 'No tags provided'}), 400

    tags_list = [tag.strip() for tag in tags_array.split(',')]

    jd_list = list(jd_collection.find({"tags": {"$in": tags_list}}))


    for jd in jd_list:
        jd['_id'] = str(jd['_id'])

    return jsonify(jd_list), 200