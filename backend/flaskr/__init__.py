from flask import Blueprint

api_bp = Blueprint('api', __name__)

from .resume import api_bp as openAI
from .tagsAPI import api_bp as tagsAPI
from .jobDescriptionsAPI import api_bp as jobDescriptionsAPI