from flask import Blueprint

api_bp = Blueprint('api', __name__)

from .openAPI import api_bp as openAPI