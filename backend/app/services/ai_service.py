import numpy as np
from sklearn.ensemble import RandomForestRegressor
from app.models.expense import Expense

def predict_future_expenses(user_id):
    expenses = Expense.query.filter_by(user_id=user_id).all()
    if not expenses:
        return []

    # Prepare data for the model
    X = np.array([i for i in range(len(expenses))]).reshape(-1, 1)
    y = np.array([expense.amount for expense in expenses])

    # Train a Random Forest model
    model = RandomForestRegressor()
    model.fit(X, y)

    # Predict next 3 months
    future_X = np.array([len(expenses), len(expenses) + 1, len(expenses) + 2]).reshape(-1, 1)
    predictions = model.predict(future_X)

    return predictions.tolist()