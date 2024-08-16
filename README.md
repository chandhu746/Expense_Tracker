# Expense Tracker

## Description

The Expense Tracker is a web application that helps users manage their personal finances by tracking their expenses and budgets. It consists of a frontend built with React and a backend powered by Node.js and PostgreSQL. The application includes features for managing expenses, setting and updating budgets, and comparing budgets to actual expenses.

## Features

- **Expense Management**: Add, view, update, and delete expenses.
- **Budget Management**: Set and update monthly budgets.
- **Budget Comparison**: Compare budgets with actual expenses.
- **User Authentication**: Secure login and user-specific data management.
- **Role Management**: Differentiate between admin and regular users (if implemented).

## Technologies Used

- **Frontend**: React, Axios
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)

## Project Structure

- `frontend/`: Contains the React application.
- `backend/`: Contains the Node.js and Express backend.

## Setup and Installation

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```sh
   cd frontend
   #Install dependencies:
  npm install
  
#Start the development server:
  npm start
### Backend Setup

2. Navigate to the `Backend` directory:

##Install dependencies:
npm install

##Database Connection with the PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expensetracker
DB_USER=yourusername
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret

##Start Backend server
npm start

##API Endpoints
POST /api/login: User login.
GET /api/budget/:monthYear: Get budget for a specific month and year.
PUT /api/budgets: Update the budget for a specific month and year.
DELETE /api/budgets: Delete the budget for a specific month and year.
GET /api/budgets/comparison: Get a comparison of the budget and total expenses for a specific month and year.

##Acknowledgments
React for building the frontend.
Node.js and Express.js for the backend.
PostgreSQL for the database.

