from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import get_user_profile, update_user_income

user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    response, status_code = get_user_profile(user_id)
    return jsonify(response), status_code

@user_bp.route('/income', methods=['PUT'])
@jwt_required()
def update_income():
    user_id = get_jwt_identity()
    data = request.json
    response, status_code = update_user_income(user_id, data)
    return jsonify(response), status_code

