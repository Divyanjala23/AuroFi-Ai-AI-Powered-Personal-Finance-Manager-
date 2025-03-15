from app.models.budget import Budget
import uuid

def allocate_budgets(user_id, income):
    budgets = []
    for category in CATEGORIES:
        limit = (income * category['percentage']) / 100
        new_budget = Budget(
            id=str(uuid.uuid4()),
            user_id=user_id,
            category=category['name'],
            limit=limit,
            income_percentage=category['percentage']
        )
        budgets.append(new_budget)
    return budgets