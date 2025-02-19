from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import openai
import psycopg2
from psycopg2.extras import RealDictCursor

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

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        cursor_factory=RealDictCursor
    )
    return conn

# Home route
@app.route('/')
def home():
    """Home route to welcome users."""
    return "Welcome to the Finance Manager Backend!"

# User registration
@app.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400
    
    # Hash the password
    hashed_password = generate_password_hash(data['password'])
    
    # Insert user into the database
    import psycopg2
from flask import jsonify

def register_user(data):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO users (email, password) VALUES (%s, %s) RETURNING id;',
            (data['email'], hashed_password)
        )
        user_id = cur.fetchone()['id']
        conn.commit()
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    except psycopg2.IntegrityError:
        return jsonify({"message": "User already exists"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

# User login
@app.route('/login', methods=['POST'])
def login():
    """Log in a user and return a JWT token."""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM users WHERE email = %s;', (data['email'],))
        user = cur.fetchone()
        cur.close()
        conn.close()
        
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
    data = request.get_json()
    
    # Validate required fields
    if not data.get('description') or not data.get('amount') or not data.get('category'):
        return jsonify({"message": "Description, amount, and category are required"}), 400
    
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Insert expense into the database
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO expenses (user_email, description, amount, category) VALUES (%s, %s, %s, %s) RETURNING id;',
            (user_email, data['description'], data['amount'], data['category'])
        )
        expense_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Expense added successfully", "expense_id": expense_id}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Get all expenses for the logged-in user (protected route)
@app.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    """Get all expenses for the logged-in user."""
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Fetch expenses from the database
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM expenses WHERE user_email = %s;', (user_email,))
        expenses = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(expenses), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Set budget (protected route)
@app.route('/budgets', methods=['POST'])
@jwt_required()
def set_budget():
    """Set a monthly budget for a specific category."""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('category') or not data.get('budget_limit') or not data.get('month'):
        return jsonify({"message": "Category, budget limit, and month are required"}), 400
    
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Insert budget into the database
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO budgets (user_email, category, budget_limit, month) VALUES (%s, %s, %s, %s) RETURNING id;',
            (user_email, data['category'], data['budget_limit'], data['month'])
        )
        budget_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Budget set successfully", "budget_id": budget_id}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Get budgets (protected route)
@app.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    """Get all budgets for the logged-in user."""
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Fetch budgets from the database
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM budgets WHERE user_email = %s;', (user_email,))
        budgets = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(budgets), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Budget insights (protected route)
@app.route('/budget-insights', methods=['GET'])
@jwt_required()
def budget_insights():
    """Compare actual spending against the budget and provide insights."""
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Fetch budgets and expenses from the database
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get budgets
        cur.execute('SELECT * FROM budgets WHERE user_email = %s;', (user_email,))
        budgets = cur.fetchall()
        
        # Get expenses
        cur.execute('SELECT * FROM expenses WHERE user_email = %s;', (user_email,))
        expenses = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Calculate total spending per category
        spending_by_category = {}
        for expense in expenses:
            category = expense['category']
            if category in spending_by_category:
                spending_by_category[category] += expense['amount']
            else:
                spending_by_category[category] = expense['amount']
        
        # Compare spending against budgets
        insights = []
        for budget in budgets:
            category = budget['category']
            budget_limit = budget['budget_limit']
            actual_spending = spending_by_category.get(category, 0)
            remaining_budget = budget_limit - actual_spending
            
            insight = {
                "category": category,
                "budget_limit": budget_limit,
                "actual_spending": actual_spending,
                "remaining_budget": remaining_budget
            }
            insights.append(insight)
        
        return jsonify(insights), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# AI-powered insights (protected route)
@app.route('/ai-insights', methods=['POST'])
@jwt_required()
def ai_insights():
    """Generate AI-powered financial insights for the logged-in user."""
    # Get the current user's email from the JWT token
    user_email = get_jwt_identity()
    
    # Fetch expenses from the database
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM expenses WHERE user_email = %s;', (user_email,))
        user_expenses = cur.fetchall()
        cur.close()
        conn.close()
        
        # Check if user has any expenses
        if not user_expenses:
            return jsonify({"error": "No expenses found for the user"}), 404
        
        # Create a prompt for OpenAI
        prompt = f"Analyze these expenses and provide financial advice:\n"
        for expense in user_expenses:
            prompt += f"- {expense['description']}: ${expense['amount']}\n"
        prompt += "\nProvide actionable advice to save money and improve financial health."

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use the GPT-3.5 model
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,  # Limit the response length
            temperature=0.7,  # Control creativity (0 = strict, 1 = creative)
        )
        insights = response.choices[0].message['content'].strip()
        return jsonify({"insights": insights}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)