import React, { useState } from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Date');

    const filteredExpenses = expenses.filter(expense => {
        
        // if (!expense.category) return false;
        if (filter === 'All') return true;
        return expense.category === filter;
    });

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        if (sort === 'Date') return new Date(b.date) - new Date(a.date);
        if (sort === 'Amount') return b.amount - a.amount;
        return 0;
    });

    return (
        <div>
            <div>
                <label>Filter by Category:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                </select>
            </div>
            <div>
                <label>Sort by:</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="Date">Date</option>
                    <option value="Amount">Amount</option>
                </select>
            </div>
            <ul>
                {sortedExpenses.map(expense => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    );
};  

export default ExpenseList;
