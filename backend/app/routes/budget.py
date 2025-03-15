from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.budget_service import get_budgets, add_budget, update_budget, delete_budget
from app.utils.constants import CATEGORIES  # Import the CATEGORIES constant

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/', methods=['GET', 'POST'])
@budget_bp.route('/<budget_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_budgets(budget_id=None):
    user_id = get_jwt_identity()
    if request.method == 'GET':
        response, status_code = get_budgets(user_id)
    elif request.method == 'POST':
        data = request.json
        response, status_code = add_budget(user_id, data)
    elif request.method == 'PUT':
        data = request.json
        response, status_code = update_budget(user_id, budget_id, data)
    elif request.method == 'DELETE':
        response, status_code = delete_budget(user_id, budget_id)
    return jsonify(response), status_code

# Add the new route for fetching budget categories
@budget_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    # Return the predefined CATEGORIES list
    return jsonify(CATEGORIES), 200