import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseList from '../components/ExpenseList';
import AddExpenseForm from '../components/AddExpenseForm';
import Navbar from '../components/Navbar';
import SetBudgetForm from '../components/SetBudgetForm';
import UpdateBudgetForm from '../components/UpdateBudgetForm';
import GetBudget from '../components/GetBudget';
import DeleteBudget from '../components/DeleteBudget';
import BudgetComparison from '../components/BudgetComparison';
import '../Styles/DashBoard.css';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [remainingBalance, setRemainingBalance] = useState(60000);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);

    const token = localStorage.getItem('token');
 
    useEffect(() => {
        axios.get('http://localhost:5000/api/expenses', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const fetchedExpenses = response.data;
                setExpenses(fetchedExpenses);
                const total = fetchedExpenses.reduce((acc, expense) => {
                    const amount = !isNaN(expense.amount) ? parseFloat(expense.amount) : 0;
                    return acc + amount;
                }, 0);
                
                
                setTotalExpenses(Number(total));
                setRemainingBalance(60000 - total);
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }, [token]);

    const addExpense = (expense) => {
        axios.post('http://localhost:5000/api/expenses', expense, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const newExpense = response.data;
                console.log('Expense added:', newExpense);
                const newExpenses = [...expenses, newExpense];
                setExpenses(newExpenses);

                const newTotal = newExpenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
                setTotalExpenses(Number(newTotal));
                setRemainingBalance(60000 - newTotal);
            })
            .catch(error => console.error('Error adding expense:', error));
    };

    const deleteExpense = (id) => {
        axios.delete(`http://localhost:5000/api/expenses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                const newExpenses = expenses.filter((expense) => expense.id !== id);
                setExpenses(newExpenses);
                const newTotal = newExpenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
                setTotalExpenses(newTotal);
                setRemainingBalance(60000 - newTotal);
            })
            .catch(error => console.error('Error deleting expense:', error));
    };

    const editExpense = (expense) => {
        setIsEditing(true);
        setCurrentExpense(expense);
    };

    const updateExpense = (updatedExpense) => {
        axios.put(`http://localhost:5000/api/expenses/${updatedExpense.id}`, updatedExpense, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const updatedExpenses = expenses.map((expense) =>
                    expense.id === updatedExpense.id ? updatedExpense : expense
                );
                setExpenses(updatedExpenses);
                const newTotal = updatedExpenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);

                setTotalExpenses(newTotal);
                setRemainingBalance(60000 - newTotal);
                setIsEditing(false);
                setCurrentExpense(null);
            })
            .catch(error => console.error('Error updating expense:', error));
    };

    return (
        <div>
            <Navbar />
            <h2>Dashboard</h2>
            <div className="summary">
                <div className="summary-item">
                    <h3>Total Expenses</h3>
                    <p>₹{totalExpenses.toFixed(2)}</p>
                </div>
                <div className="summary-item">
                    <h3>Remaining Balance</h3>
                    <p>₹{remainingBalance.toFixed(2)}</p>
                </div>
            </div>
            <div className="budget-forms">
                <SetBudgetForm />
                <UpdateBudgetForm />
                <GetBudget />
                <DeleteBudget />
                <BudgetComparison />
            </div>
            {isEditing ? (
                <AddExpenseForm onAddExpense={updateExpense} expense={currentExpense} />
            ) : (
                <AddExpenseForm onAddExpense={addExpense} />
            )}
            <ExpenseList expenses={expenses} onEdit={editExpense} onDelete={deleteExpense} />
        </div>
    );
};

export default Dashboard;
