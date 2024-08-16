import React, { useState, useEffect } from 'react';
import '../Styles/AddExpenseForm.css';

const AddExpenseForm = ({ onAddExpense, expense }) => {
  const [name, setName] = useState(expense ? expense.name : '');
  const [amount, setAmount] = useState(expense ? expense.amount : '');
  const [category, setCategory] = useState(expense ? expense.category : '');

    useEffect(() => {
        if (expense) {
            setName(expense.name);
            setAmount(expense.amount);
            setCategory(expense.category ); 
        }
    }, [expense]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const expenseData = {
            id: expense ? expense.id : Date.now(), 
            name,
            amount: parseFloat(amount),
            category
        };
        onAddExpense(expenseData);
        setName('');
        setAmount('');
        setCategory('Food');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Expense Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                </select>
            </div>
            <button type="submit">{expense ? 'Update' : 'Add'} Expense</button>
        </form>
    );
};

export default AddExpenseForm;
