from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.budget import Budget
from app.models.expense import Expense
from app.extensions import db

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/send', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.json
    user_id = get_jwt_identity()

    budget = Budget.query.filter_by(user_id=user_id, category=data['category']).first()
    expenses = Expense.query.filter_by(user_id=user_id, category=data['category']).all()
    total_spent = sum(e.amount for e in expenses)

    if total_spent > budget.limit:
        return jsonify({
            "message_id": "mock_message_id_12345",
            "message": f"Mock SMS sent: You've exceeded your budget for {data['category']}."
        }), 200

    return jsonify({"message": "No notification sent."}), 200