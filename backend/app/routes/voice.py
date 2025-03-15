from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.expense import Expense
from app.extensions import db

voice_bp = Blueprint('voice', __name__)

@voice_bp.route('/command', methods=['POST'])
@jwt_required()
def process_voice_command():
    data = request.json
    user_id = get_jwt_identity()
    command = data['command']

    if "spent on groceries" in command:
        expenses = Expense.query.filter_by(user_id=user_id, category='groceries').all()
        total = sum(e.amount for e in expenses)
        return jsonify({"response": f"You spent ${total} on groceries."}), 200

    return jsonify({"response": "I didn't understand that command."}), 200