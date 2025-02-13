from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')

jwt = JWTManager(app)

@app.route('/')
def home():
    return jsonify(message="Finance Manager Backend")

if __name__ == '__main__':
    app.run(debug=True, port=5000)