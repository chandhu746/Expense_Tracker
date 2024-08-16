const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config(); 

const app = express();
app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY; 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Expense_Tracker',
  password: '12345',
  port: 5432,
});

// Utility function to query the database
const queryDB = async (query, values) => {
  const client = await pool.connect();
  try {
    const res = await client.query(query, values);
    return res;
  } finally {
    client.release();
  }
};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
  const { rows } = await queryDB(query, [email, password]);

  if (rows.length > 0) {
    const token = jwt.sign({ email: rows[0].email }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Invalid token format' });
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.email = decoded.email;
    const userQuery = 'SELECT id FROM users WHERE email = $1';
    const userResult = await queryDB(userQuery, [req.email]);

    if (userResult.rows.length > 0) {
      req.userId = userResult.rows[0].id;
      next();
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
};


app.get('/api/expenses', verifyToken, async (req, res) => {
  const query = 'SELECT * FROM expenses';
  const { rows } = await queryDB(query);
  res.json(rows);
});

app.post('/api/expenses', verifyToken, async (req, res) => {
  const { name, amount, category } = req.body;
 
  const query = 'INSERT INTO expenses (name, amount, category) VALUES ($1, $2, $3) RETURNING *';
  const { rows } = await queryDB(query, [name, amount, category]);
  res.json(rows[0]);
});

app.delete('/api/expenses/:id', verifyToken, async (req, res) => {
 
  const { id } = req.params;
  const query = 'DELETE FROM expenses WHERE id = $1';
  await queryDB(query, [id]);
  res.json({ message: 'Expense deleted' });
}); 

app.put('/api/expenses/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, amount, category } = req.body;
  const query = 'UPDATE expenses SET name = $1, amount = $2, category = $3 WHERE id = $4 RETURNING *';
  const { rows } = await queryDB(query, [name, amount, category, id]);
  res.json(rows[0]);
});

// Endpoint to add a monthly budget
// Endpoint to add or update a monthly budget
app.post('/api/budget', verifyToken, async (req, res) => {
  const { monthYear, budget } = req.body;

  const query = `
      INSERT INTO monthly_budgets (user_id, month_year, budget)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, month_year)
      DO UPDATE SET budget = EXCLUDED.budget
      RETURNING *;
  `;
  const values = [req.userId, monthYear, budget];

  try {
      const { rows } = await queryDB(query, values);
      res.json({ message: 'Budget set successfully', budget: rows[0] });
  } catch (error) {
      console.error('Error setting budget:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});





// Endpoint to get the budget for a specific month and year
app.get('/api/budget/:monthYear', verifyToken, async (req, res) => {
  // console.log('Request params:', req.params);
  const { monthYear } = req.params;

  const query = `
      SELECT budget FROM monthly_budgets
      WHERE user_id = $1 AND month_year = $2;
  `;
  const values = [req.userId, monthYear];

  try {
      const { rows } = await queryDB(query, values);
      if (rows.length > 0) {
          res.json({ budget: rows[0].budget });
      } else {
          res.status(404).json({ message: 'No budget found for this month' });
      }
  } catch (error) {
      console.error('Error fetching budget:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to update the budget for a specific month and year
app.put('/api/budgets', verifyToken, async (req, res) => {
  const { monthYear, budget } = req.body;

  if (!monthYear || !budget) {
    return res.status(400).json({ message: 'MonthYear and budget are required' });
  }

  const query = `
      UPDATE monthly_budgets 
      SET budget = $1 
      WHERE user_id = $2 
      AND month_year = $3 
      RETURNING *;
  `;
  const values = [budget, req.userId, monthYear];

  console.log('Query:', query);
  console.log('Values:', values);

  try {
      const { rows } = await queryDB(query, values);
      if (rows.length > 0) {
          res.json(rows[0]);
      } else {
          res.status(404).json({ message: 'Budget not found for this month and year' });
      }
  } catch (error) {
      console.error('Error updating budget:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to delete the budget for a specific month and year
app.delete('/api/budgets', verifyToken, async (req, res) => {
  const { monthYear } = req.query; 

  const query = 'DELETE FROM monthly_budgets WHERE month_year = $1 AND user_id = $2'; // Adjust query based on your schema
  const result = await queryDB(query, [monthYear, req.userId]);

  if (result.rowCount > 0) {
      res.json({ message: 'Budget deleted successfully' });
  } else {
      res.status(404).json({ message: 'Budget not found for this month and year' });
  }
});


// Endpoint to get the comparison of monthly expenses vs. budget
app.get('/api/budgets/comparison', verifyToken, async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: 'Month and year are required' });
  }

  const monthYear = `${year}-${month}`; 
  try {
    
    const budgetQuery = 'SELECT * FROM monthly_budgets WHERE month_year = $1';
    const budgetResult = await queryDB(budgetQuery, [monthYear]);

    if (budgetResult.rows.length === 0) {
      return res.status(404).json({ message: 'Budget not found for this month and year' });
    }

    const budget = budgetResult.rows[0].budget;

    // Sum up the expenses for the specified month and year
    const expensesQuery = `
        SELECT SUM(amount) as total_expenses
        FROM expenses
        WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2
    `;
    const expensesResult = await queryDB(expensesQuery, [month, year]);

    const totalExpenses = expensesResult.rows[0].total_expenses || 0;

    // Return both the budget and the total expenses
    res.json({
      month,
      year,
      budget,
      totalExpenses,
      remainingBalance: budget - totalExpenses,
    });
  } catch (error) {
    console.error('Error fetching budget comparison:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
