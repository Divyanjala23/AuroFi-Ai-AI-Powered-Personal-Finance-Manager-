from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.expense_service import get_expenses, add_expense, update_expense, delete_expense

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/', methods=['GET', 'POST'])
@expense_bp.route('/<expense_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_expenses(expense_id=None):
    user_id = get_jwt_identity()
    if request.method == 'GET':
        response, status_code = get_expenses(user_id)
    elif request.method == 'POST':
        data = request.json
        response, status_code = add_expense(user_id, data)
    elif request.method == 'PUT':
        data = request.json
        response, status_code = update_expense(user_id, expense_id, data)
    elif request.method == 'DELETE':
        response, status_code = delete_expense(user_id, expense_id)
    return jsonify(response), status_code