from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from faker import Faker

mock_bank_bp = Blueprint('mock_bank', __name__)
fake = Faker()

@mock_bank_bp.route('/link', methods=['POST'])
@jwt_required()
def mock_link_bank_account():
    return jsonify({
        "link_token": "mock_link_token_12345",
        "message": "Mock bank account linked successfully"
    }), 200

@mock_bank_bp.route('/accounts', methods=['GET'])
@jwt_required()
def mock_get_bank_accounts():
    return jsonify({
        "accounts": [
            {
                "account_id": "mock_account_123",
                "name": "Savings Account",
                "balance": 1000.00,
                "currency": "LKR"
            },
            {
                "account_id": "mock_account_456",
                "name": "Checking Account",
                "balance": 500.00,
                "currency": "LKR"
            }
        ],
        "message": "Mock bank accounts fetched successfully"
    }), 200

@mock_bank_bp.route('/transactions', methods=['GET'])
@jwt_required()
def mock_get_transactions():
    transactions = [{
        "transaction_id": fake.uuid4(),
        "amount": round(fake.random_number(digits=3) / 100, 2),
        "date": fake.date_this_year().isoformat(),
        "description": fake.sentence(),
        "category": fake.random_element(elements=("Groceries", "Dining", "Transport", "Entertainment"))
    } for _ in range(10)]
    return jsonify({
        "transactions": transactions,
        "message": "Mock transactions fetched successfully"
    }), 200