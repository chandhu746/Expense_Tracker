import React, { useState } from 'react';
import axios from 'axios';

const UpdateBudgetForm = () => {
    const [monthYear, setMonthYear] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/api/budgets', 
                { monthYear, budget },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Budget updated successfully!');
        } catch (error) {
            console.error('Error updating budget:', error);
            alert('Failed to update budget');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} placeholder="YYYY-MM" />
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget Amount" />
            <button type="submit">Update Budget</button>
        </form>
    );
};

export default UpdateBudgetForm;
