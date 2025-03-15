import uuid
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import create_access_token

def register_user(data):
    new_user = User(
        id=str(uuid.uuid4()),
        name=data['name'],
        email=data['email'],
        password=data['password'],
        income=data.get('income', 0.0)
    )
    db.session.add(new_user)
    db.session.commit()
    return {"user_id": new_user.id, "message": "User registered successfully"}, 201

def login_user(data):
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        access_token = create_access_token(identity=user.id)
        return {"access_token": access_token, "message": "Login successful"}, 200
    return {"message": "Invalid credentials"}, 401