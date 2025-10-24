const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Configuration ---
// !! Make sure this matches your database !!
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234', 
  database: 'dbmslab' // From your SQL file
};

const pool = mysql.createPool(dbConfig);

// --- API Endpoints for 'employees' table ---

/**
 * 1. READ (GET)
 * Fetches all employees.
 */
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM employees ORDER BY FIRST_NAME, LAST_NAME ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

/**
 * 2. CREATE (POST)
 * Adds a new employee.
 */
app.post('/api/employees', async (req, res) => {
  // CHANGED: Destructure all 11 fields from the request body
  const {
    EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER,
    HIRE_DATE, JOB_ID, SALARY, COMMISSION_PCT, MANAGER_ID, DEPARTMENT_ID
  } = req.body;

  // CHANGED: Validation based on your schema's NOT NULL fields
  if (!EMPLOYEE_ID || !LAST_NAME || !EMAIL || !HIRE_DATE || !JOB_ID) {
    return res.status(400).json({ error: 'Employee ID, Last Name, Email, Hire Date, and Job ID are required.' });
  }

  try {
    // CHANGED: Insert query for all 11 columns
    const sql = `INSERT INTO employees 
      (EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER, HIRE_DATE, JOB_ID, SALARY, COMMISSION_PCT, MANAGER_ID, DEPARTMENT_ID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // CHANGED: Parameters array, using '|| null' for optional fields
    const params = [
      EMPLOYEE_ID,
      FIRST_NAME || null,
      LAST_NAME,
      EMAIL,
      PHONE_NUMBER || null,
      HIRE_DATE,
      JOB_ID,
      SALARY || null,
      COMMISSION_PCT || null,
      MANAGER_ID || null,
      DEPARTMENT_ID || null
    ];
    
    await pool.execute(sql, params);
    
    // Send back the new employee object
    res.status(201).json(req.body);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Database insert failed. Check for duplicate EMPLOYEE_ID or EMAIL.' });
  }
});

/**
 * 3. UPDATE (PUT)
 * Updates an existing employee by their EMPLOYEE_ID.
 */
app.put('/api/employees/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  
  // CHANGED: Destructure all fields that can be updated (not the primary key)
  const {
    FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER,
    HIRE_DATE, JOB_ID, SALARY, COMMISSION_PCT, MANAGER_ID, DEPARTMENT_ID
  } = req.body;

  // CHANGED: Validation for updated fields
  if (!LAST_NAME || !EMAIL || !HIRE_DATE || !JOB_ID) {
    return res.status(400).json({ error: 'Last Name, Email, Hire Date, and Job ID are required.' });
  }

  try {
    // CHANGED: Update query for all 10 columns
    const sql = `UPDATE employees SET 
      FIRST_NAME = ?, LAST_NAME = ?, EMAIL = ?, PHONE_NUMBER = ?, HIRE_DATE = ?, 
      JOB_ID = ?, SALARY = ?, COMMISSION_PCT = ?, MANAGER_ID = ?, DEPARTMENT_ID = ? 
      WHERE EMPLOYEE_ID = ?`;
      
    // CHANGED: Parameters array for update
    const params = [
      FIRST_NAME || null,
      LAST_NAME,
      EMAIL,
      PHONE_NUMBER || null,
      HIRE_DATE,
      JOB_ID,
      SALARY || null,
      COMMISSION_PCT || null,
      MANAGER_ID || null,
      DEPARTMENT_ID || null,
      employeeId // The ID from the URL
    ];

    const [result] = await pool.execute(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Send back the updated data
    res.json(req.body);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Database update failed. Check for duplicate EMAIL.' });
  }
});

/**
 * 4. DELETE (DELETE)
 * Deletes an employee by their EMPLOYEE_ID.
 */
app.delete('/api/employees/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM employees WHERE EMPLOYEE_ID = ?',
      [employeeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(204).send(); // 'No Content' success status
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

// --- Start the Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});