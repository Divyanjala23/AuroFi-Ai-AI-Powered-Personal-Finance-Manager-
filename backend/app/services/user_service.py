from app.models.user import User
from app.models.budget import Budget
from app.extensions import db
from app.utils.helpers import allocate_budgets
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "income": user.income
    }, 200

def update_user_income(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404

    user.income = data['income']
    db.session.commit()

    # Reallocate budgets based on new income
    budgets = allocate_budgets(user_id, user.income)
    db.session.add_all(budgets)
    db.session.commit()

    return {"message": "Income updated successfully"}, 200