import pytest
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.goal import Goal

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_token(client):
    # Register and login to get a token
    client.post('/api/auth/register', json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password",
        "income": 5000.0
    })
    response = client.post('/api/auth/login', json={
        "email": "test@example.com",
        "password": "password"
    })
    return response.json['access_token']

def test_add_goal(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post('/api/goals', json={
        "goal_name": "Buy a car",
        "target_amount": 10000.0,
        "saved_amount": 2000.0,
        "target_date": "2025-12-31"
    }, headers=headers)
    assert response.status_code == 201
    assert "goal_id" in response.json

def test_get_goals(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get('/api/goals', headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json, list)