import React from 'react';
import '../Styles/ExpenseItem.css';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
    const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0;

    return (
        <li className="expense-item">
            <span>{expense.name}</span>
            <span>₹{amount.toFixed(2)}</span>
            <button onClick={() => onEdit(expense)}>Edit</button>
            <button onClick={() => onDelete(expense.id)}>Delete</button>
        </li>
    );
};

export default ExpenseItem;
