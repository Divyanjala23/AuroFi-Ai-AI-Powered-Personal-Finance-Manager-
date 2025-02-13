from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)

# Mock data (replace with a database later)
users = []
expenses = []

# Home route
@app.route('/')
def home():
    return "Welcome to the Finance Manager Backend!"

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    users.append(data)
    return jsonify({"message": "User registered successfully"}), 201

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = next((u for u in users if u['email'] == data['email'] and u['password'] == data['password']), None)
    if user:
        access_token = create_access_token(identity=user['email'])
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Add expense (protected route)
@app.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    data = request.get_json()
    expenses.append(data)
    return jsonify({"message": "Expense added successfully"}), 201

# Get all expenses (protected route)
@app.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    return jsonify(expenses), 200

# AI-powered insights (protected route)
@app.route('/ai-insights', methods=['POST'])
@jwt_required()
def ai_insights():
    data = request.get_json()
    prompt = f"Analyze these expenses and provide financial advice: {data['expenses']}"
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=100
    )
    return jsonify({"insights": response.choices[0].text.strip()}), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)