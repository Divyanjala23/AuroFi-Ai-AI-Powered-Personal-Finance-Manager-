from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.income_service import get_incomes, add_income, update_income, delete_income

income_bp = Blueprint('income', __name__)

@income_bp.route('/', methods=['GET', 'POST'])
@income_bp.route('/<income_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_income(income_id=None):
    user_id = get_jwt_identity()
    if request.method == 'GET':
        response, status_code = get_incomes(user_id)
    elif request.method == 'POST':
        data = request.json
        response, status_code = add_income(user_id, data)
    elif request.method == 'PUT':
        data = request.json
        response, status_code = update_income(user_id, income_id, data)
    elif request.method == 'DELETE':
        response, status_code = delete_income(user_id, income_id)
    return jsonify(response), status_code