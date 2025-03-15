from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.goal_service import get_goals, add_goal, update_goal, delete_goal

goal_bp = Blueprint('goal', __name__)

@goal_bp.route('/', methods=['GET', 'POST'])
@goal_bp.route('/<goal_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_goals(goal_id=None):
    user_id = get_jwt_identity()
    if request.method == 'GET':
        response, status_code = get_goals(user_id)
    elif request.method == 'POST':
        data = request.json
        response, status_code = add_goal(user_id, data)
    elif request.method == 'PUT':
        data = request.json
        response, status_code = update_goal(user_id, goal_id, data)
    elif request.method == 'DELETE':
        response, status_code = delete_goal(user_id, goal_id)
    return jsonify(response), status_code