from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    response, status_code = register_user(data)
    return jsonify(response), status_code

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    response, status_code = login_user(data)
    return jsonify(response), status_code