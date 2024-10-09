from flask import jsonify
from . import api_bp
import os
from dotenv import load_dotenv
# from pymongo import MongoClient
# from bson import ObjectId
# from openai import OpenAI
from groq import Groq


load_dotenv()
# client = OpenAI()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@api_bp.route('/ai', methods=['GET'])
def openAPI():
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Explain the importance of fast language models",
                }
            ],
            model="llama3-8b-8192",
        )
        return jsonify({"msg" : chat_completion.choices[0].message.content}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500