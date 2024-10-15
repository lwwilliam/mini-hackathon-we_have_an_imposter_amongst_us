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
jd_collection = db['jobDescription']

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

jd_json = '{"title": "job title (string)","mode": "work location (string)","type": "employment type (string)","position": "job position (string)","location": "location of job (string)","description": "description of job (string)","qualifications": {"pastExperience": [{"name": "name of experience (string)","priority": "mandatory",// Can be "mandatory", "bonus", or "normal""minYears": 3// Example: 3 years of experience}],"technical": [{"name": "name of technical skill (string)","priority": "bonus",// Can be "mandatory", "bonus", or "normal""minYears": 2// Example: 2 years of skill experience}],"soft": [{"name": "name of soft skill (string)","priority": "normal",// Can be "mandatory", "bonus", or "normal""minYears": 1// Example: 1 year of soft skill experience}]},"responsibilities": ["responsibilities of work (string)"]}'

# jd_json = '\
# {\
# "title": "job title (string)",\
# "mode": "work location (string)",\
# "type": "employment type (string)",\
# "position": "job position (string)",\
# "location": "location of job (string)",\
# "description": "description of job (string)",\
# "qualifications": {\
# "pastExperience": [\
# {\
#         "name": "name of experience (string)",\
#         "priority": "mandatory",  // Can be "mandatory", "bonus", or "normal"\
#         "minYears": 3  // Example: 3 years of experience\
#       }\
#     ],\
#     "technical": [\
#       {\
#         "name": "name of technical skill (string)",\
#         "priority": "bonus",  // Can be "mandatory", "bonus", or "normal"\
#         "minYears": 2  // Example: 2 years of skill experience\
#       }\
#     ],\
#     "soft": [\
#       {\
#         "name": "name of soft skill (string)",\
#         "priority": "normal",  // Can be "mandatory", "bonus", or "normal"\
#         "minYears": 1  // Example: 1 year of soft skill experience\
#       }\
#     ]\
#   },\
#   "responsibilities": [\
#     "responsibilities of work (string)"\
#   ]\
# }'

@api_bp.route('/parseJD', methods=['POST'])
def parseJD():
    # print(jd_json)
    extract_text = ""
    # if 'File' not in request.files:
    #     return jsonify({"error": "No file part in the request"}), 400

    # file = request.files['File']

    # if file.filename == '':
    #     return jsonify({"error": "No selected file"}), 400

    # if file:
        # print(Fore.RED, getAllTags()[0].get_json(), Style.RESET_ALL)
        # storePDF(file)
        # reader = PdfReader(file)
        # page = reader.pages[0]
        # extract_text = page.extract_text()
    # extract_text = open("/home/seal/experian/backend/pdfUploads/tmp.txt", "r").read()
    # print(extract_text)
    extract_text = request.get_json()['test']
    print(extract_text)
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a hr that takes in a job description as a string, extracts its information and outputs it in JSON.\n"
                    f" The JSON object must use the schema:\n{jd_json}\n"
                    "\n There can be multiple pastExperience, tehcnical and soft. If a field has no matching value to the job desciption passed in, the field itself can be empty",
                    # "response_format": {"type": "json_object"}
                },
                {
                    "role": "user",
                    "content": extract_text + "extract the job description",
                    # "response_format": {"type": "json_object"}
                }
            ],
            model="llama3-8b-8192",
            response_format={"type": "json_object"},
        )
        jd_collection.insert_one(chat_completion.choices[0].message.content)
        # print(Fore.GREEN + chat_completion.choices[0].message.content, Style.RESET_ALL)
        return jsonify({"msg" : chat_completion.choices[0].message.content}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500