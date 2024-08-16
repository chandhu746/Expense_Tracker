import React, { useState } from 'react';
import axios from 'axios';

const BudgetComparison = () => {
    const [monthYear, setMonthYear] = useState('');
    const [comparison, setComparison] = useState(null);

    const fetchComparison = async () => {
        try {
            const [year, month] = monthYear.split('-'); // Split monthYear into year and month
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/budgets/comparison`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { month, year } // Send month and year separately
            });
            setComparison(response.data);
        } catch (error) {
            console.error('Error fetching comparison:', error);
            alert('Failed to fetch comparison');
        }
    };

    return (
        <div>
            <input type="text" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} placeholder="YYYY-MM" />
            <button onClick={fetchComparison}>Compare Budget</button>
            {comparison && (
                <div>
                    <p>Budget: {comparison.budget}</p>
                    <p>Total Expenses: {comparison.totalExpenses}</p>
                    <p>Remaining Balance: {comparison.remainingBalance}</p>
                </div>
            )}
        </div>
    );
};

export default BudgetComparison;
