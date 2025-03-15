import uuid
from app.models.goal import Goal
from app.extensions import db
from datetime import datetime

def get_goals(user_id):
    goals = Goal.query.filter_by(user_id=user_id).all()
    return [{
        "id": g.id,
        "goal_name": g.goal_name,
        "target_amount": g.target_amount,
        "saved_amount": g.saved_amount,
        "target_date": g.target_date.strftime('%Y-%m-%d') if g.target_date else None
    } for g in goals], 200

def add_goal(user_id, data):
    target_date = datetime.strptime(data['target_date'], '%Y-%m-%d') if data.get('target_date') else None
    new_goal = Goal(
        id=str(uuid.uuid4()),
        user_id=user_id,
        goal_name=data['goal_name'],
        target_amount=data['target_amount'],
        saved_amount=data.get('saved_amount', 0.0),
        target_date=target_date
    )
    db.session.add(new_goal)
    db.session.commit()
    return {"goal_id": new_goal.id, "message": "Goal created successfully"}, 201

def update_goal(user_id, goal_id, data):
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return {"message": "Goal not found"}, 404

    if data.get('goal_name'):
        goal.goal_name = data['goal_name']
    if data.get('target_amount'):
        goal.target_amount = data['target_amount']
    if data.get('saved_amount'):
        goal.saved_amount = data['saved_amount']
    if data.get('target_date'):
        goal.target_date = datetime.strptime(data['target_date'], '%Y-%m-%d')

    db.session.commit()
    return {"message": "Goal updated successfully"}, 200

def delete_goal(user_id, goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return {"message": "Goal not found"}, 404

    db.session.delete(goal)
    db.session.commit()
    return {"message": "Goal deleted successfully"}, 200