import uuid
from app.models.income import Income
from app.extensions import db

def get_incomes(user_id):
    incomes = Income.query.filter_by(user_id=user_id).all()
    return [{
        "id": i.id,
        "source": i.source,
        "amount": i.amount,
        "date": i.date.isoformat() if i.date else None
    } for i in incomes], 200

def add_income(user_id, data):
    new_income = Income(
        id=str(uuid.uuid4()),
        user_id=user_id,
        source=data['source'],
        amount=data['amount']
    )
    db.session.add(new_income)
    db.session.commit()
    return {"income_id": new_income.id, "message": "Income added successfully"}, 201

def update_income(user_id, income_id, data):
    income = Income.query.filter_by(id=income_id, user_id=user_id).first()
    if not income:
        return {"message": "Income not found"}, 404

    if data.get('source'):
        income.source = data['source']
    if data.get('amount'):
        income.amount = data['amount']

    db.session.commit()
    return {"message": "Income updated successfully"}, 200

def delete_income(user_id, income_id):
    income = Income.query.filter_by(id=income_id, user_id=user_id).first()
    if not income:
        return {"message": "Income not found"}, 404

    db.session.delete(income)
    db.session.commit()
    return {"message": "Income deleted successfully"}, 200