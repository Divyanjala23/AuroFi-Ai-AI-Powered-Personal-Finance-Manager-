from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import uuid
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_cors import CORS
from faker import Faker
from datetime import timedelta

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv()

# Configure PostgreSQL Database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://myuser:mypassword@localhost/finance_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Database
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=12)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Expense(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Budget(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    limit = db.Column(db.Float, nullable=False)

class Goal(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    goal_name = db.Column(db.String(100), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    saved_amount = db.Column(db.Float, default=0.0)
    target_date = db.Column(db.DateTime)

# Helper Functions
def predict_future_expenses(user_id):
    """Improved AI model to predict future expenses using Random Forest."""
    expenses = Expense.query.filter_by(user_id=user_id).all()
    if not expenses:
        return []

    # Prepare data for the model
    X = np.array([i for i in range(len(expenses))]).reshape(-1, 1)
    y = np.array([expense.amount for expense in expenses])

    # Train a Random Forest model
    model = RandomForestRegressor()
    model.fit(X, y)

    # Predict next 3 months
    future_X = np.array([len(expenses), len(expenses) + 1, len(expenses) + 2]).reshape(-1, 1)
    predictions = model.predict(future_X)

    return predictions.tolist()

# API Endpoints

# User Management
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(id=str(uuid.uuid4()), name=data['name'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"user_id": new_user.id, "message": "User registered successfully"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token, "message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Fetch User Data
@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    }), 200

# Expense Tracking
@app.route('/api/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    data = request.json
    user_id = get_jwt_identity()
    new_expense = Expense(id=str(uuid.uuid4()), user_id=user_id, amount=data['amount'], category=data['category'])
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"expense_id": new_expense.id, "message": "Expense added successfully"}), 201

@app.route('/api/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": e.id, "amount": e.amount, "category": e.category, "date": e.date} for e in expenses]), 200

# DELETE endpoint for expenses
@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    user_id = get_jwt_identity()

    # Find the expense by ID and user ID
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()

    if not expense:
        return jsonify({"message": "Expense not found"}), 404

    # Delete the expense
    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Expense deleted successfully"}), 200

# Budgeting
@app.route('/api/budgets', methods=['POST'])
@jwt_required()
def create_budget():
    data = request.json
    user_id = get_jwt_identity()
    new_budget = Budget(id=str(uuid.uuid4()), user_id=user_id, category=data['category'], limit=data['limit'])
    db.session.add(new_budget)
    db.session.commit()
    return jsonify({"budget_id": new_budget.id, "message": "Budget created successfully"}), 201

@app.route('/api/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": b.id, "category": b.category, "limit": b.limit} for b in budgets]), 200

# DELETE endpoint for budgets
@app.route('/api/budgets/<budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    user_id = get_jwt_identity()

    # Find the budget by ID and user ID
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()

    if not budget:
        return jsonify({"message": "Budget not found"}), 404

    # Delete the budget
    db.session.delete(budget)
    db.session.commit()

    return jsonify({"message": "Budget deleted successfully"}), 200

# Goal Setting
@app.route('/api/goals', methods=['POST'])
@jwt_required()
def create_goal():
    data = request.json
    user_id = get_jwt_identity()

    # Parse the target_date from the request (if provided)
    target_date = None
    if data.get('target_date'):
        target_date = datetime.strptime(data['target_date'], '%Y-%m-%d')

    new_goal = Goal(
        id=str(uuid.uuid4()),
        user_id=user_id,
        goal_name=data['goal_name'],
        target_amount=data['target_amount'],
        saved_amount=data.get('saved_amount', 0.0),
        target_date=target_date
    )
    db.session.add(new_goal)
    db.session.commit()
    return jsonify({"goal_id": new_goal.id, "message": "Goal created successfully"}), 201

@app.route('/api/goals', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = Goal.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": g.id,
        "goal_name": g.goal_name,
        "target_amount": g.target_amount,
        "saved_amount": g.saved_amount,
        "target_date": g.target_date.strftime('%Y-%m-%d') if g.target_date else None
    } for g in goals]), 200

# DELETE endpoint for goals
@app.route('/api/goals/<goal_id>', methods=['DELETE'])
@jwt_required()
def delete_goal(goal_id):
    user_id = get_jwt_identity()

    # Find the goal by ID and user ID
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()

    if not goal:
        return jsonify({"message": "Goal not found"}), 404

    # Delete the goal
    db.session.delete(goal)
    db.session.commit()

    return jsonify({"message": "Goal deleted successfully"}), 200

# AI Insights
@app.route('/api/insights/predictions', methods=['GET'])
@jwt_required()
def get_predictions():
    user_id = get_jwt_identity()
    predictions = predict_future_expenses(user_id)
    return jsonify({"predictions": predictions}), 200

# Mock Bank Integration
fake = Faker()

@app.route('/api/mock/bank/link', methods=['POST'])
@jwt_required()
def mock_link_bank_account():
    # Simulate linking a bank account
    return jsonify({
        "link_token": "mock_link_token_12345",
        "message": "Mock bank account linked successfully"
    }), 200

@app.route('/api/mock/bank/accounts', methods=['GET'])
@jwt_required()
def mock_get_bank_accounts():
    # Simulate fetching bank accounts
    user_id = get_jwt_identity()
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

@app.route('/api/mock/bank/transactions', methods=['GET'])
@jwt_required()
def mock_get_transactions():
    # Simulate fetching transactions
    user_id = get_jwt_identity()
    transactions = [{
        "transaction_id": fake.uuid4(),
        "amount": round(fake.random_number(digits=3) / 100, 2),  # Random amount
        "date": fake.date_this_year().isoformat(),  # Random date
        "description": fake.sentence(),  # Random description
        "category": fake.random_element(elements=("Groceries", "Dining", "Transport", "Entertainment"))
    } for _ in range(10)]  # Generate 10 random transactions
    return jsonify({
        "transactions": transactions,
        "message": "Mock transactions fetched successfully"
    }), 200

# Mock Notification Endpoint
@app.route('/api/notifications/send', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.json
    user_id = get_jwt_identity()
    
    # Example: Send a notification if spending exceeds budget
    budget = Budget.query.filter_by(user_id=user_id, category=data['category']).first()
    expenses = Expense.query.filter_by(user_id=user_id, category=data['category']).all()
    total_spent = sum(e.amount for e in expenses)
    
    if total_spent > budget.limit:
        # Simulate sending an SMS
        return jsonify({
            "message_id": "mock_message_id_12345",
            "message": f"Mock SMS sent: You've exceeded your budget for {data['category']}."
        }), 200
    
    return jsonify({"message": "No notification sent."}), 200

# Voice Integration (Google Assistant)
@app.route('/api/voice/command', methods=['POST'])
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

# Run the App
if __name__ == '__main__':
    app.run(debug=True)