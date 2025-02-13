from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)

# Set OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

# Mock data (replace with a database later)
users = []
expenses = []

# Helper function to find user by email
def find_user(email):
    return next((u for u in users if u['email'] == email), None)

# Home route
@app.route('/')
def home():
    return "Welcome to the Finance Manager Backend!"

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if find_user(data['email']):
        return jsonify({"message": "User already exists"}), 400
    
    # Add new user
    users.append(data)
    return jsonify({"message": "User registered successfully"}), 201

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = find_user(data['email'])
    
    # Check if user exists and password matches
    if user and user['password'] == data['password']:
        access_token = create_access_token(identity=user['email'])
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Add expense (protected route)
@app.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    data = request.get_json()
    
    # Validate required fields
    if not data.get('description') or not data.get('amount'):
        return jsonify({"message": "Description and amount are required"}), 400
    
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Add user email to the expense data
    data['user_email'] = user_email
    expenses.append(data)
    
    return jsonify({"message": "Expense added successfully"}), 201

# Get all expenses for the logged-in user (protected route)
@app.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Filter expenses by user email
    user_expenses = [e for e in expenses if e['user_email'] == user_email]
    return jsonify(user_expenses), 200

# AI-powered insights (protected route)
@app.route('/ai-insights', methods=['POST'])
@jwt_required()
def ai_insights():
    data = request.get_json()
    
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Filter expenses by user email
    user_expenses = [e for e in expenses if e['user_email'] == user_email]
    
    # Create a prompt for OpenAI
    prompt = f"Analyze these expenses and provide financial advice:\n"
    for expense in user_expenses:
        prompt += f"- {expense['description']}: ${expense['amount']}\n"
    prompt += "\nProvide actionable advice to save money and improve financial health."

    # Call OpenAI API
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # Use the GPT-3.5 model
            prompt=prompt,
            max_tokens=150,  # Limit the response length
            temperature=0.7,  # Control creativity (0 = strict, 1 = creative)
        )
        insights = response.choices[0].text.strip()
        return jsonify({"insights": insights}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)