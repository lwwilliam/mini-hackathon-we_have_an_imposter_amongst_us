
from . import api_bp
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from flask import Flask, request, jsonify
from openai import AzureOpenAI

load_dotenv()

API_KEY = os.environ.get("AZURE_OPENAI_API_KEY")
API_ENDPOINT = os.environ.get("API_ENDPOINT") # e.g https://YOUR_RESOURCE_NAME.openai.azure.com
API_VERSION = "api_version" # e,g 2024-06-01
MODEL_NAME = "model_name" # e.g gpt-3.5-turbo

client = AzureOpenAI(
    azure_endpoint=API_ENDPOINT,
    api_version=API_VERSION,
    api_key=API_KEY
)

@api_bp.route('/ai', methods=['POST'])
def openAPI():
    try:
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Explain the importance of fast language models",
                }
            ],
            model=MODEL_NAME,
        )
        return jsonify({"msg" : completion.to_json()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/switching-endpoints