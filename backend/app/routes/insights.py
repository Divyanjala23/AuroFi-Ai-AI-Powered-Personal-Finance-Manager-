from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.ai_service import predict_future_expenses

insights_bp = Blueprint('insights', __name__)

@insights_bp.route('/predictions', methods=['GET'])
@jwt_required()
def get_predictions():
    user_id = get_jwt_identity()
    predictions = predict_future_expenses(user_id)
    return jsonify({"predictions": predictions}), 200