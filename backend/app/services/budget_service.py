import uuid
from app.models.budget import Budget
from app.models.expense import Expense
from app.extensions import db

def get_budgets(user_id):
    budgets = Budget.query.filter_by(user_id=user_id).all()
    budget_data = []
    for budget in budgets:
        expenses = Expense.query.filter_by(user_id=user_id, category=budget.category).all()
        total_spent = sum(e.amount for e in expenses)
        remaining = budget.limit - total_spent
        budget_data.append({
            "id": budget.id,
            "category": budget.category,
            "limit": budget.limit,
            "spent": total_spent,
            "remaining": remaining
        })
    return budget_data, 200

def add_budget(user_id, data):
    new_budget = Budget(
        id=str(uuid.uuid4()),
        user_id=user_id,
        category=data['category'],
        limit=data['limit'],
        income_percentage=data['income_percentage']
    )
    db.session.add(new_budget)
    db.session.commit()
    return {"budget_id": new_budget.id, "message": "Budget created successfully"}, 201

def update_budget(user_id, budget_id, data):
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    if not budget:
        return {"message": "Budget not found"}, 404

    if data.get('category'):
        budget.category = data['category']
    if data.get('limit'):
        budget.limit = data['limit']
    if data.get('income_percentage'):
        budget.income_percentage = data['income_percentage']

    db.session.commit()
    return {"message": "Budget updated successfully"}, 200

def delete_budget(user_id, budget_id):
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    if not budget:
        return {"message": "Budget not found"}, 404

    db.session.delete(budget)
    db.session.commit()
    return {"message": "Budget deleted successfully"}, 200