import uuid
from app.models.recurring_expense import RecurringExpense
from app.extensions import db
from datetime import datetime

def get_recurring_expenses(user_id):
    expenses = RecurringExpense.query.filter_by(user_id=user_id).all()
    return [{
        "id": e.id,
        "amount": e.amount,
        "category": e.category,
        "frequency": e.frequency,
        "next_date": e.next_date.isoformat()
    } for e in expenses], 200

def add_recurring_expense(user_id, data):
    new_expense = RecurringExpense(
        id=str(uuid.uuid4()),
        user_id=user_id,
        amount=data['amount'],
        category=data['category'],
        frequency=data['frequency'],
        next_date=datetime.strptime(data['next_date'], '%Y-%m-%d')
    )
    db.session.add(new_expense)
    db.session.commit()
    return {"expense_id": new_expense.id, "message": "Recurring expense added successfully"}, 201

def update_recurring_expense(user_id, expense_id, data):
    expense = RecurringExpense.query.filter_by(id=expense_id, user_id=user_id).first()
    if not expense:
        return {"message": "Recurring expense not found"}, 404

    if data.get('amount'):
        expense.amount = data['amount']
    if data.get('category'):
        expense.category = data['category']
    if data.get('frequency'):
        expense.frequency = data['frequency']
    if data.get('next_date'):
        expense.next_date = datetime.strptime(data['next_date'], '%Y-%m-%d')

    db.session.commit()
    return {"message": "Recurring expense updated successfully"}, 200

def delete_recurring_expense(user_id, expense_id):
    expense = RecurringExpense.query.filter_by(id=expense_id, user_id=user_id).first()
    if not expense:
        return {"message": "Recurring expense not found"}, 404

    db.session.delete(expense)
    db.session.commit()
    return {"message": "Recurring expense deleted successfully"}, 200