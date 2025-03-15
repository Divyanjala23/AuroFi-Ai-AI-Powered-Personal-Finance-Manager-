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

def test_mock_link_bank_account(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post('/api/mock/bank/link', headers=headers)
    assert response.status_code == 200
    assert "link_token" in response.json

def test_mock_get_bank_accounts(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get('/api/mock/bank/accounts', headers=headers)
    assert response.status_code == 200
    assert "accounts" in response.json

def test_mock_get_transactions(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get('/api/mock/bank/transactions', headers=headers)
    assert response.status_code == 200
    assert "transactions" in response.json