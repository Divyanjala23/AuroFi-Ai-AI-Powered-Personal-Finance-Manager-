from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os
from dotenv import load_dotenv
import openai
import psycopg2
from psycopg2.extras import RealDictCursor
from marshmallow import Schema, fields, ValidationError
from contextlib import contextmanager

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Tokens expire after 1 hour
jwt = JWTManager(app)

# Set OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

import psycopg2

# Database connection details
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    dbname="finance_manager",
    user="postgres",
    password="1234"
)

# Create a cursor object
cursor = conn.cursor()

# Example: Fetch all users
cursor.execute("SELECT * FROM users;")
users = cursor.fetchall()
print(users)

# Close the connection
conn.close()

# Context manager for database cursor
@contextmanager
def get_db_cursor():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        yield cur
    finally:
        conn.commit()
        cur.close()
        conn.close()

# Marshmallow Schemas for Input Validation
class UserSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class ExpenseSchema(Schema):
    description = fields.Str(required=True)
    amount = fields.Float(required=True)
    category = fields.Str(required=True)

class BudgetSchema(Schema):
    category = fields.Str(required=True)
    budget_limit = fields.Float(required=True)
    month = fields.Str(required=True)

# Home route
@app.route('/')
def home():
    """Home route to welcome users."""
    return "Welcome to the Finance Manager Backend!"

# User registration
@app.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    try:
        data = UserSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({"message": err.messages}), 400

    # Hash the password
    hashed_password = generate_password_hash(data['password'])

    # Insert user into the database
    try:
        with get_db_cursor() as cur:
            cur.execute(
                'INSERT INTO users (email, password) VALUES (%s, %s) RETURNING id;',
                (data['email'], hashed_password)
            )
            user_id = cur.fetchone()['id']
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    except psycopg2.IntegrityError:
        return jsonify({"message": "User already exists"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# User login
@app.route('/login', methods=['POST'])
def login():
    """Log in a user and return a JWT token."""
    try:
        data = UserSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({"message": err.messages}), 400

    try:
        with get_db_cursor() as cur:
            cur.execute('SELECT * FROM users WHERE email = %s;', (data['email'],))
            user = cur.fetchone()

        # Check if user exists and password matches
        if user and check_password_hash(user['password'], data['password']):
            access_token = create_access_token(identity=user['email'])
            return jsonify(access_token=access_token), 200
        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Add expense (protected route)
@app.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    """Add a new expense for the logged-in user."""
    try:
        data = ExpenseSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({"message": err.messages}), 400

    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()

    # Insert expense into the database
    try:
        with get_db_cursor() as cur:
            cur.execute(
                'INSERT INTO expenses (user_email, description, amount, category) VALUES (%s, %s, %s, %s) RETURNING id;',
                (user_email, data['description'], data['amount'], data['category'])
            )
            expense_id = cur.fetchone()['id']
        return jsonify({"message": "Expense added successfully", "expense_id": expense_id}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Get all expenses for the logged-in user (protected route)
@app.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    """Get all expenses for the logged-in user."""
    user_email = get_jwt_identity()

    try:
        with get_db_cursor() as cur:
            cur.execute('SELECT * FROM expenses WHERE user_email = %s;', (user_email,))
            expenses = cur.fetchall()
        return jsonify(expenses), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Set budget (protected route)
@app.route('/budgets', methods=['POST'])
@jwt_required()
def set_budget():
    """Set a monthly budget for a specific category."""
    try:
        data = BudgetSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({"message": err.messages}), 400

    user_email = get_jwt_identity()

    try:
        with get_db_cursor() as cur:
            cur.execute(
                'INSERT INTO budgets (user_email, category, budget_limit, month) VALUES (%s, %s, %s, %s) RETURNING id;',
                (user_email, data['category'], data['budget_limit'], data['month'])
            )
            budget_id = cur.fetchone()['id']
        return jsonify({"message": "Budget set successfully", "budget_id": budget_id}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Get budgets (protected route)
@app.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    """Get all budgets for the logged-in user."""
    user_email = get_jwt_identity()

    try:
        with get_db_cursor() as cur:
            cur.execute('SELECT * FROM budgets WHERE user_email = %s;', (user_email,))
            budgets = cur.fetchall()
        return jsonify(budgets), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Budget insights (protected route)
@app.route('/budget-insights', methods=['GET'])
@jwt_required()
def budget_insights():
    """Compare actual spending against the budget and provide insights."""
    user_email = get_jwt_identity()

    try:
        with get_db_cursor() as cur:
            # Get budgets
            cur.execute('SELECT * FROM budgets WHERE user_email = %s;', (user_email,))
            budgets = cur.fetchall()

            # Get expenses
            cur.execute('SELECT * FROM expenses WHERE user_email = %s;', (user_email,))
            expenses = cur.fetchall()

        # Calculate total spending per category
        spending_by_category = {}
        for expense in expenses:
            category = expense['category']
            spending_by_category[category] = spending_by_category.get(category, 0) + expense['amount']

        # Compare spending against budgets
        insights = []
        for budget in budgets:
            category = budget['category']
            budget_limit = budget['budget_limit']
            actual_spending = spending_by_category.get(category, 0)
            remaining_budget = budget_limit - actual_spending

            insights.append({
                "category": category,
                "budget_limit": budget_limit,
                "actual_spending": actual_spending,
                "remaining_budget": remaining_budget
            })

        return jsonify(insights), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# AI-powered insights (protected route)
@app.route('/ai-insights', methods=['POST'])
@jwt_required()
def ai_insights():
    """Generate AI-powered financial insights for the logged-in user."""
    user_email = get_jwt_identity()

    try:
        with get_db_cursor() as cur:
            # Fetch expenses
            cur.execute('SELECT * FROM expenses WHERE user_email = %s;', (user_email,))
            user_expenses = cur.fetchall()

            # Fetch budgets
            cur.execute('SELECT * FROM budgets WHERE user_email = %s;', (user_email,))
            budgets = cur.fetchall()

        if not user_expenses:
            return jsonify({"error": "No expenses found for the user"}), 404

        # Create a prompt for OpenAI
        prompt = "Analyze these expenses and provide financial advice:\n"
        for expense in user_expenses:
            prompt += f"- {expense['description']}: ${expense['amount']} ({expense['category']})\n"
        prompt += "\nThe user has the following budgets:\n"
        for budget in budgets:
            prompt += f"- {budget['category']}: ${budget['budget_limit']} for {budget['month']}\n"
        prompt += "\nProvide actionable advice to save money and improve financial health."

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7,
        )
        insights = response.choices[0].message['content'].strip()
        return jsonify({"insights": insights}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)