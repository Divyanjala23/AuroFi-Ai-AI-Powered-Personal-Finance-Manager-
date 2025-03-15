import uuid
from app.models.expense import Expense
from app.extensions import db

def get_expenses(user_id):
    expenses = Expense.query.filter_by(user_id=user_id).all()
    return [{"id": e.id, "amount": e.amount, "category": e.category, "date": e.date} for e in expenses], 200

def add_expense(user_id, data):
    new_expense = Expense(
        id=str(uuid.uuid4()),
        user_id=user_id,
        amount=data['amount'],
        category=data['category']
    )
    db.session.add(new_expense)
    db.session.commit()
    return {"expense_id": new_expense.id, "message": "Expense added successfully"}, 201

def update_expense(user_id, expense_id, data):
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    if not expense:
        return {"message": "Expense not found"}, 404

    if data.get('amount'):
        expense.amount = data['amount']
    if data.get('category'):
        expense.category = data['category']

    db.session.commit()
    return {"message": "Expense updated successfully"}, 200

def delete_expense(user_id, expense_id):
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    if not expense:
        return {"message": "Expense not found"}, 404

    db.session.delete(expense)
    db.session.commit()
    return {"message": "Expense deleted successfully"}, 200