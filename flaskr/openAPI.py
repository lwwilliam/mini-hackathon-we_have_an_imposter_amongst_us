from flask import jsonify, request
from . import api_bp
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
from openai import OpenAI

load_dotenv()
client = OpenAI()

@api_bp.route('/ai', methods=['GET'])
def openAPI():
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello!"}
            ]
        )
        return jsonify(completion.choices[0].message)
    except Exception as e:
        return jsonify({"error": str(e)}), 500