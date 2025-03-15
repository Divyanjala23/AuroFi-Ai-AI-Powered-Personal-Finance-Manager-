import pytest
from app import create_app
from app.extensions import db
from app.models.user import User

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

def test_register(client):
    response = client.post('/api/auth/register', json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password",
        "income": 5000.0
    })
    assert response.status_code == 201
    assert "user_id" in response.json

def test_login(client):
    # Register a user first
    client.post('/api/auth/register', json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password",
        "income": 5000.0
    })

    # Test login
    response = client.post('/api/auth/login', json={
        "email": "test@example.com",
        "password": "password"
    })
    assert response.status_code == 200
    assert "access_token" in response.json