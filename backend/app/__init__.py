from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Register routes with URL prefixes
    from .routes.auth import auth_bp
    from .routes.user import user_bp
    from .routes.expense import expense_bp
    from .routes.budget import budget_bp
    from .routes.goal import goal_bp
    from .routes.income import income_bp
    from .routes.recurring_expense import recurring_expense_bp
    from .routes.insights import insights_bp
    from .routes.mock_bank import mock_bank_bp
    from .routes.notifications import notifications_bp
    from .routes.voice import voice_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(expense_bp, url_prefix='/api/expenses')
    app.register_blueprint(budget_bp, url_prefix='/api/budgets')
    app.register_blueprint(goal_bp, url_prefix='/api/goals')
    app.register_blueprint(income_bp, url_prefix='/api/income')
    app.register_blueprint(recurring_expense_bp, url_prefix='/api/recurring-expenses')
    app.register_blueprint(insights_bp, url_prefix='/api/insights')
    app.register_blueprint(mock_bank_bp, url_prefix='/api/mock/bank')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(voice_bp, url_prefix='/api/voice')

    return app