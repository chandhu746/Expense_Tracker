import React, { useState } from 'react';
import axios from 'axios';

const SetBudgetForm = () => {
    const [monthYear, setMonthYear] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
             await axios.post('http://localhost:5000/api/budget', 
                { monthYear, budget },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Budget set successfully!');
        } catch (error) {
            console.error('Error setting budget:', error);
            alert('Failed to set budget');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} placeholder="YYYY-MM" />
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Set Budget Amount" />
            <button type="submit">Set Budget</button>
        </form>
    );
};

export default SetBudgetForm;
