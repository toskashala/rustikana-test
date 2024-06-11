require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

console.log('SECRET_KEY:', secretKey); // Ensure the secret key is loaded

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Connect to the database
pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database');
        done();
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT * FROM admins WHERE username = $1';
        const { rows } = await pool.query(query, [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err); // Debugging line to check verification error
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}

// Serve dashboard.html if authenticated
app.get('/dashboard', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Protected API route
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed' });
});

// Fallback to redirect to login if not authenticated
app.get('/dashboard.html', (req, res) => {
    res.redirect('/login.html');
});

// Existing route to fetch menu items
app.get('/menuitems', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, description, price, category FROM menuitems ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch table numbers
app.get('/api/table-numbers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM table_numbers');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching table numbers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle order submissions
app.post('/api/orders', async (req, res) => {
    const { items, comments, tableNumber } = req.body;
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Calculate the total quantity
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

    // Create a single string for menu items and their quantities
    const menuItemsString = items.map(item => `${item.name} quantity: ${item.quantity}`).join(', ');

    try {
        // Validate table number
        console.log('Validating table number:', tableNumber); // Log the table number being validated
        const tableNumberQuery = 'SELECT * FROM table_numbers WHERE table_number = $1';
        const { rows: tableRows } = await pool.query(tableNumberQuery, [tableNumber]);

        if (tableRows.length === 0) {
            console.log('Invalid table number:', tableNumber); // Log invalid table number
            return res.status(400).json({ success: false, message: 'Invalid table number' });
        }

        // Insert new order
        const query = 'INSERT INTO orders (menu_item, quantity, category, subtotal, comments, table_number, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
        const { rows } = await pool.query(query, [menuItemsString, totalQuantity, null, subtotal, comments, tableNumber, 'new']);
        const orderId = rows[0].id;

        // Update the table_order table
        await updateTableOrder(tableNumber);

        res.status(200).json({ success: true, orderId });
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).json({ success: false, message: 'Error inserting order' });
    }
});

// Function to update table_order table
async function updateTableOrder(tableNumber) {
    try {
        const existingOrderQuery = 'SELECT id FROM table_order WHERE table_number = $1 AND status != \'table-done\' ORDER BY id DESC LIMIT 1';
        const { rows: existingOrderRows } = await pool.query(existingOrderQuery, [tableNumber]);

        const query = `
            SELECT
                STRING_AGG(menu_item, ', ') AS ordered_items,
                SUM(quantity) AS total_quantity,
                SUM(subtotal) AS total_subtotal,
                MAX(status) AS status
            FROM orders
            WHERE table_number = $1
            AND status != 'table-done'
            GROUP BY table_number
        `;
        const { rows } = await pool.query(query, [tableNumber]);
        const { ordered_items, total_quantity, total_subtotal, status } = rows[0];

        if (existingOrderRows.length === 0) {
            // No existing ongoing order, insert new
            const insertQuery = `
                INSERT INTO table_order (table_number, ordered_items, total_quantity, total_subtotal, status)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await pool.query(insertQuery, [tableNumber, ordered_items, total_quantity, total_subtotal, status]);
        } else {
            // Update existing ongoing order
            const existingOrderId = existingOrderRows[0].id;
            const updateQuery = `
                UPDATE table_order
                SET ordered_items = $2, total_quantity = $3, total_subtotal = $4, status = $5
                WHERE id = $1
            `;
            await pool.query(updateQuery, [existingOrderId, ordered_items, total_quantity, total_subtotal, status]);
        }
    } catch (error) {
        console.error('Error updating table_order:', error);
    }
}

// Route to fetch all orders
app.get('/api/orders', verifyToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM orders WHERE status != 'table-done' ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/orders/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update order status
app.patch('/api/orders/:id/status', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const queryOrders = 'UPDATE orders SET status = $1 WHERE id = $2';
        await pool.query(queryOrders, [status, id]);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Error updating order status' });
    }
});

// Route to fetch table numbers with ongoing orders
app.get('/api/table-orders', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT table_number FROM table_order WHERE status != \'table-done\' ORDER BY table_number');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching table numbers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch order details for a specific table number
app.get('/api/table-orders/:tableNumber', verifyToken, async (req, res) => {
    const { tableNumber } = req.params;
    try {
        const query = 'SELECT * FROM table_order WHERE table_number = $1 AND status != \'table-done\' ORDER BY id DESC LIMIT 1';
        const { rows } = await pool.query(query, [tableNumber]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to mark a table order as done
app.patch('/api/table-orders/:tableNumber/status', verifyToken, async (req, res) => {
    const { tableNumber } = req.params;
    const { status } = req.body;

    try {
        const query = `
            UPDATE table_order
            SET status = $1
            WHERE table_number = $2 AND status != 'table-done'
            RETURNING id
        `;
        const { rows } = await pool.query(query, [status, tableNumber]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found or already marked as done' });
        }

        // If table order is marked as done, mark all related orders as done
        const orderQuery = `
            UPDATE orders
            SET status = $1
            WHERE table_number = $2 AND status != 'table-done'
        `;
        await pool.query(orderQuery, [status, tableNumber]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating table_order status:', error);
        res.status(500).json({ success: false, message: 'Error updating table_order status' });
    }
});

// Route to mark all orders for a specific table as done
app.patch('/api/table-orders/:tableNumber/orders/status', verifyToken, async (req, res) => {
    const { tableNumber } = req.params;
    const { status } = req.body;

    try {
        const query = `
            UPDATE orders
            SET status = $1
            WHERE table_number = $2 AND status != 'table-done'
        `;
        await pool.query(query, [status, tableNumber]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating order status for table:', error);
        res.status(500).json({ success: false, message: 'Error updating order status for table' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

