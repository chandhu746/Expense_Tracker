import React, { useState } from 'react';
import axios from 'axios';

const GetBudget = () => {
    const [monthYear, setMonthYear] = useState('');
    const [budget, setBudget] = useState(null);

    const fetchBudget = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);  // Verify that the token is correctly logged
            const response = await axios.get(`http://localhost:5000/api/budget/${monthYear}`, {
                headers: { Authorization: `Bearer ${token}` }  // Fixed typo here
            });
            setBudget(response.data.budget);
        } catch (error) {
            console.error('Error fetching budget:', error);
            alert('Failed to fetch budget');
        }
    };

    return (
        <div>
            <input type="text" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} placeholder="YYYY-MM" />
            <button onClick={fetchBudget}>Get Budget</button>
            {budget !== null && <p>Budget for {monthYear}: {budget}</p>}
        </div>
    );
};

export default GetBudget;
