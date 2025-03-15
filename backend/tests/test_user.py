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

def test_get_user(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get('/api/user', headers=headers)
    assert response.status_code == 200
    assert response.json['name'] == "Test User"

def test_update_income(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.put('/api/user/income', json={"income": 6000.0}, headers=headers)
    assert response.status_code == 200
    assert response.json['message'] == "Income updated successfully"