import React, { useState } from 'react';
import axios from 'axios';

const DeleteBudget = () => {
    const [monthYear, setMonthYear] = useState('');

    const deleteBudget = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/api/budgets`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { monthYear } 
            });
            console.log('Response:', response); 
            alert('Budget deleted successfully!');
        } catch (error) {
            console.error('Error deleting budget:', error);
            alert('Failed to delete budget');
        }
    };

    return (
        <div>
            <input type="text" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} placeholder="YYYY-MM" />
            <button onClick={deleteBudget}>Delete Budget</button>
        </div>
    );
};

export default DeleteBudget;
