from flask import jsonify, request, make_response, send_file
import requests
import json
from . import api_bp
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from openai import AzureOpenAI
from pypdf import PdfReader
from colorama import Fore, Style
from .tagsAPI import getAllTags
from collections import namedtuple
from bson import ObjectId
from io import BytesIO

load_dotenv()
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
UPLOAD_FOLDER = 'pdfUploads'

API_KEY = os.environ.get("AZURE_OPENAI_API_KEY")
API_ENDPOINT = os.environ.get("API_ENDPOINT") # e.g https://YOUR_RESOURCE_NAME.openai.azure.com
API_VERSION = "2024-08-01-preview" # e,g 2024-06-01
MODEL_NAME = "gpt-4o" # e.g gpt-3.5-turbo

mongo_client = MongoClient(f'mongodb+srv://{DB_USER}:{DB_PASSWORD}@data.rnsqw.mongodb.net/')
db = mongo_client['experian']
pdf_collection = db['pdf']
jd_collection = db['jobDescription']

client = AzureOpenAI(
    azure_endpoint=API_ENDPOINT,
    api_version=API_VERSION,
    api_key=API_KEY
)

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
    return inserted_id

def tagsToPDF(data, inserted_id):
    print(inserted_id)
    print(data)
    pdf_entry = {
        **data
    }

    pdf_collection.update_one(
        {"_id": inserted_id},
        {"$set": pdf_entry}
    )


def fetch_tags():
    try:
        response = requests.get('http://localhost:5000/api/getAllTags')  # URL of your Flask route
        if response.status_code == 200:
            tags = response.json()  # Assuming it returns JSON
            return tags
        else:
            print(f"Error: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

tags_json = '{"name": "candidate name", "tag_ids": ["tagid1", "tagid2", "tagid3"]}'

@api_bp.route('/ai', methods=['POST'])
def openAI():
    extract_text = ""
    if 'File' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['File']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        id = storePDF(file)
        reader = PdfReader(file)
        extract_text = ""
        for page in reader.pages:
            extract_text += page.extract_text()
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a HR that takes in a resume as text, your job is to match which tags best suits the resume. The tags will be passed to you in json form\n"
                        f"The JSON object you return will be in this format:\n{tags_json}\n"
                        "the return JSON object must have between 1 to 3 _id in an array form and only the id, and also the candidate name from the resume\n"
                        f"Here are the tag name, _id and description:\n{fetch_tags()}\n",
                        # "response_format": {"type": "json_object"}
                    },
                    {
                        "role": "user",
                        "content": "match the tags that fit this resume:\n" + extract_text,
                        # "response_format": {"type": "json_object"}
                    }
                ],
                model=MODEL_NAME,
                response_format={"type": "json_object"},
            )
            tagsToPDF(json.loads(chat_completion.choices[0].message.content), id)
            # storePDF(file, json.loads(chat_completion.choices[0].message.content))
            return jsonify({"msg" : json.loads(chat_completion.choices[0].message.content)}), 200
        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 500

jd_json = '{"title": "job title (string)","mode": "work location (string)","type": "employment type (string)","position": "job position (string)","location": "location of job (string)","description": "description of job (string)","qualifications": {"pastExperience": [{"name": "name of experience (string)","priority": "mandatory",// Can be "mandatory", "bonus", or "normal""minYears": 3// Example: 3 years of experience}],"technical": [{"name": "name of technical skill (string)","priority": "bonus",// Can be "mandatory", "bonus", or "normal""minYears": 2// Example: 2 years of skill experience}],"soft": [{"name": "name of soft skill (string)","priority": "normal",// Can be "mandatory", "bonus", or "normal""minYears": 1// Example: 1 year of soft skill experience}]},"responsibilities": ["responsibilities of work (string)"]}'

@api_bp.route('/parseJD', methods=['POST'])
def parseJD():
    # extract_text = request.get_json()['jobDescription']
    extract_text = ""
    print(request.files)
    if 'File' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    if request.form.get('tags') is None:
        return jsonify({"error": "No tags part in the request"}), 400

    file = request.files['File']

    tagsData = request.form.to_dict(flat=True)['tags']
    # tagsData = request.form.get('tags')
    # tags = jsonify(tagsData)

    # Parse JSON into an object with attributes corresponding to dict keys.
    tags = tagsData.split(',')

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        reader = PdfReader(file)
        extract_text = ""
        for page in reader.pages:
            extract_text += page.extract_text()
        print(Fore.RED, extract_text, Style.RESET_ALL)
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
                model=MODEL_NAME,
                response_format={"type": "json_object"},
            )
            # print(Fore.GREEN + chat_completion.choices[0].message.content, Style.RESET_ALL)
            jd_collection.insert_one({ **json.loads(chat_completion.choices[0].message.content), **{'tags': tags}})
            return jsonify({"msg" : "pdf uploaded successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@api_bp.route('/getPDF', methods=['GET'])
def getPDF():
    id = request.args.get('id')

    try:
        filename = id + ".pdf"
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "../pdfUploads", filename)
        full_file_path = os.path.abspath(file_path)

        print(full_file_path)
        if os.path.isfile(full_file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return make_response(f"File '{filename}' not found.", 404)
    except Exception as e:
        return make_response(f"Error: {str(e)}"), 500

@api_bp.route('/getAllResumes', methods=['GET'])
def getResume():
    resumes = []

    for resume in pdf_collection.find({}):
        resume['_id'] = str(resume['_id'])
        resumes.append(resume)
    return jsonify(resumes), 200

def getAllResume():
    resumes = []

    for resume in pdf_collection.find({}):
        resume['_id'] = str(resume['_id'])
        resumes.append(resume)
    return resumes

def getResumeWithTag(tags, job):
    resumes = []

    for resume in pdf_collection.find({}):
        tag_ids = resume.get('tag_ids', [])

    # Check if 'tag_ids' is a list before proceeding
        if not isinstance(tag_ids, list):
            continue  # Skip this resume if 'tag_ids' is not a list
        for tag in tag_ids:
            if tag in job['tags']:
                resume['_id'] = str(resume['_id'])
                resumes.append(resume)
    return resumes


# analysis_json = '{   "name": "name",   "summary": "short summary of past experiences.",   "highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"],   "qualifications": {     "pastExperience": [       {         "name": "name of past experience",         "priority": "priority",         "minYears": 0,         "qualified": true // boolean return value depending if resume is qualified       }     ],     "technical": [       {         "name": "name of technical skill",         "priority": "priority",         "minYears": 0,         "qualified": true // boolean return value depending if resume is qualified       },     ],     "soft": [       {         "name": "name of soft skill",         "priority": "priority",         "minYears": 0,         "qualified": true // boolean return value depending if resume is qualified       },     ]   } }'
analysis_json = '{   "name": "name",   "summary": "short summary of past experiences.",   "highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"],   "qualifications": {     "pastExperience": [       {         "name": "name of past experience",         "priority": "priority",         "minYears": 0,         "qualified": "true / false (boolean)" }     ],     "technical": [       {         "name": "name of technical skill",         "priority": "priority",         "minYears": 0,         "qualified": "true / false (boolean)" }     ],     "soft": [       {         "name": "name of soft skill",         "priority": "priority",         "minYears": 0,         "qualified": "true / false (boolean)"     }     ]   } }'

def analyseSingleResume(resume, jobDescription):
    response =  requests.get('http://localhost:5000/api/getPDF?id=' + resume['_id'])
    file = BytesIO(response.content)
    if response.status_code != 200:
        print(f"Error fetching PDF: {response.status_code}")
        return None  # or handle the error as needed
    reader = PdfReader(file)
    extract_text = ""
    print(len(reader.pages))
    for page in reader.pages:
        extract_text += page.extract_text()
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a hr that takes in a resume as a string, extract and summarize its information and outputs it in JSON.\n"
                    f" The JSON object must use the schema:\n{analysis_json}\n"
                    f"\n The new json should follow the base of the qualifications from this object:\n{jobDescription}\n"
                    "you have to check whether each qualifications are fulfilled by the resume and change the \'qualified\' field to true / false boolean accordingly",
                    # "response_format": {"type": "json_object"}
                },
                {
                    "role": "user",
                    "content": extract_text + "summarize and match the qualifications",
                    # "response_format": {"type": "json_object"}
                }
            ],
            model=MODEL_NAME,
            response_format={"type": "json_object"},
        )
        # print(Fore.GREEN + chat_completion.choices[0].message.content, Style.RESET_ALL)
        # json.loads(chat_completion.choices[0].message.content)
        print(chat_completion.choices[0].message.content)
        return json.loads(chat_completion.choices[0].message.content)
    except Exception as e:
        print(e)
        return None

@api_bp.route('/job/analysis', methods=['GET'])
def get_job_analysis():
    job_id = request.args.get('id')
    if job_id is None:
        return jsonify({"error": "Job ID is required"}), 400

    # try:
    #     # Convert job_id to ObjectId
    #     job = jd_collection.find_one({"_id": job_id})
    # except Exception as e:
    #     return jsonify({"error": "Invalid Job ID format"}), 400
    try:
        object_id = ObjectId(job_id)
        # print("Converted ObjectId:", object_id)
        job = jd_collection.find_one({"_id": object_id})
    except Exception as e:
        print(f"Error: {e}")

    if (job.get('tags') and isinstance(job['tags'], list) and len(job['tags'])):
        resumes = getResumeWithTag(job['tags'], job)
    else:
        resumes = getAllResume()

    analysisAll = []
    for resume in resumes:
        analysis = analyseSingleResume(resume, job)

        if analysis is None:
            print("ERROR ANALYSIS")
            continue
        analysis['_id'] = str(resume['_id'])
        print("test")
        print(analysis)
        analysisAll.append(analysis)
    # print(job)
    return jsonify(analysisAll), 200
    # return jsonify({
    #     "message": f"Analysis for job ID: {job_id}",
    #     # "job_id": job
    # })
