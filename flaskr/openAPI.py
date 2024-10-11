from flask import jsonify, request
from . import api_bp
import os
from dotenv import load_dotenv
# from pymongo import MongoClient
# from bson import ObjectId
# from openai import OpenAI
from groq import Groq
from pypdf import PdfReader

load_dotenv()
# client = OpenAI()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@api_bp.route('/ai', methods=['GET'])
def openAPI():
    extract_text = ""
    if 'File' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['File']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = file.filename
        reader = PdfReader(file)

        print("Pages: ", len(reader.pages))
        page = reader.pages[0]
        extract_text = page.extract_text()
        # print(page.extract_text())
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": extract_text + " extract the main point",
                    }
                ],
                model="llama3-8b-8192",
            )
            print(chat_completion.choices[0].message.content)
            return jsonify({"msg" : chat_completion.choices[0].message.content}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500