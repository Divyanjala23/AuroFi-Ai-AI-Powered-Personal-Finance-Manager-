from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.recurring_expense_service import get_recurring_expenses, add_recurring_expense, update_recurring_expense, delete_recurring_expense

recurring_expense_bp = Blueprint('recurring_expense', __name__)

@recurring_expense_bp.route('/', methods=['GET', 'POST'])
@recurring_expense_bp.route('/<expense_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_recurring_expenses(expense_id=None):
    user_id = get_jwt_identity()
    if request.method == 'GET':
        response, status_code = get_recurring_expenses(user_id)
    elif request.method == 'POST':
        data = request.json
        response, status_code = add_recurring_expense(user_id, data)
    elif request.method == 'PUT':
        data = request.json
        response, status_code = update_recurring_expense(user_id, expense_id, data)
    elif request.method == 'DELETE':
        response, status_code = delete_recurring_expense(user_id, expense_id)
    return jsonify(response), status_code