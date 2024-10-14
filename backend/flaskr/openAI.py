from flask import jsonify, request
from . import api_bp
import os
from dotenv import load_dotenv
from pymongo import MongoClient
# from bson import ObjectId
# from openai import OpenAI
from groq import Groq
from pypdf import PdfReader
from colorama import Fore, Style
from .tagsAPI import getAllTags

DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
UPLOAD_FOLDER = 'pdfUploads'

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
mongo_client = MongoClient(f'mongodb+srv://{DB_USER}:{DB_PASSWORD}@data.rnsqw.mongodb.net/')
db = mongo_client['experian']
pdf_collection = db['pdf']

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def storePDF(file):
    original_filename = file.filename
    pdf_entry = {
        "original_filename": original_filename
    }

    inserted_id = pdf_collection.insert_one(pdf_entry).inserted_id

    new_filename = f"{inserted_id}.pdf"
    file_path = os.path.join(UPLOAD_FOLDER, new_filename)
    file.save(file_path)

    pdf_collection.update_one(
        {"_id": inserted_id},
        {"$set": {"stored_filename": new_filename}}
    )

@api_bp.route('/ai', methods=['POST'])
def openAI():
    extract_text = ""
    if 'File' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['File']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        print(Fore.RED, getAllTags()[0].get_json(), Style.RESET_ALL)
        storePDF(file)
        reader = PdfReader(file)
        page = reader.pages[0]
        extract_text = page.extract_text()
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
            # print(Fore.GREEN + chat_completion.choices[0].message.content, Style.RESET_ALL)
            return jsonify({"msg" : chat_completion.choices[0].message.content}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500