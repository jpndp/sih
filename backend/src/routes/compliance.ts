import express from 'express';
import { getAll, getOne, runQuery } from '../database/init.js';

const router = express.Router();

// Get all compliance items
router.get('/', async (req, res) => {
  try {
    const { status, department, page = '1', limit = '20' } = req.query;

    let query = 'SELECT * FROM compliance_items WHERE 1=1';
    const params: (string | number)[] = [];

    // Add filters
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status as string);
    }

    if (department) {
      query += ' AND assigned_to LIKE ?';
      params.push(`%${department}%`);
    }

    // Add pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query += ' ORDER BY due_date ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), offset);

    const items = await getAll(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM compliance_items WHERE 1=1';
    const countParams: (string | number)[] = [];

    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status as string);
    }

    if (department) {
      countQuery += ' AND assigned_to LIKE ?';
      countParams.push(`%${department}%`);
    }

    const countResult = await getAll(countQuery, countParams);
    const total = (countResult[0]?.total as number) || 0;

    // Process items to add calculated fields
    const processedItems = items.map(item => ({
      ...item,
      days_left: calculateDaysLeft(item.due_date as string),
      progress_percentage: item.progress,
      is_overdue: new Date(item.due_date as string) < new Date()
    }));

    res.json({
      items: processedItems,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching compliance items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get compliance item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getOne('SELECT * FROM compliance_items WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Compliance item not found' });
    }

    res.json({
      ...item,
      days_left: calculateDaysLeft(item.due_date as string),
      progress_percentage: item.progress,
      is_overdue: new Date(item.due_date as string) < new Date()
    });
  } catch (error) {
    console.error('Error fetching compliance item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new compliance item
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      authority,
      due_date,
      status = 'normal',
      progress = 0,
      assigned_to,
      documents_count = 0
    } = req.body;

    if (!title || !authority || !due_date) {
      return res.status(400).json({ error: 'Title, authority, and due date are required' });
    }

    const itemId = crypto.randomUUID();

    await runQuery(
      `INSERT INTO compliance_items
       (id, title, description, authority, due_date, status, progress, assigned_to, documents_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [itemId, title, description || null, authority, due_date, status, progress, assigned_to || null, documents_count]
    );

    const newItem = await getOne('SELECT * FROM compliance_items WHERE id = ?', [itemId]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating compliance item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update compliance item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if item exists
    const existingItem = await getOne('SELECT id FROM compliance_items WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Compliance item not found' });
    }

    // Build update query
    const updateFields: string[] = [];
    const params: (string | number | null)[] = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(id);
    await runQuery(
      `UPDATE compliance_items SET ${updateFields.join(', ')}, last_update = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    const updatedItem = await getOne('SELECT * FROM compliance_items WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating compliance item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete compliance item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const existingItem = await getOne('SELECT id FROM compliance_items WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Compliance item not found' });
    }

    await runQuery('DELETE FROM compliance_items WHERE id = ?', [id]);
    res.json({ message: 'Compliance item deleted successfully' });
  } catch (error) {
    console.error('Error deleting compliance item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get compliance overview statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await getAll(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'urgent' THEN 1 END) as urgent_items,
        COUNT(CASE WHEN status = 'warning' THEN 1 END) as warning_items,
        COUNT(CASE WHEN progress >= 80 THEN 1 END) as on_track,
        AVG(progress) as avg_completion_rate
      FROM compliance_items
    `);

    res.json(stats[0] || {
      total_items: 0,
      urgent_items: 0,
      warning_items: 0,
      on_track: 0,
      avg_completion_rate: 0
    });
  } catch (error) {
    console.error('Error fetching compliance stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upcoming deadlines
router.get('/deadlines/upcoming', async (req, res) => {
  try {
    const { days = '30' } = req.query;

    const upcomingItems = await getAll(`
      SELECT *,
             CAST((julianday(due_date) - julianday('now')) AS INTEGER) as days_left
      FROM compliance_items
      WHERE due_date >= DATE('now')
        AND due_date <= DATE('now', '+${days} days')
      ORDER BY due_date ASC
      LIMIT 10
    `);

    res.json(upcomingItems);
  } catch (error) {
    console.error('Error fetching upcoming deadlines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get overdue items
router.get('/deadlines/overdue', async (req, res) => {
  try {
    const overdueItems = await getAll(`
      SELECT *,
             CAST((julianday('now') - julianday(due_date)) AS INTEGER) as days_overdue
      FROM compliance_items
      WHERE due_date < DATE('now')
      ORDER BY due_date ASC
    `);

    res.json(overdueItems);
  } catch (error) {
    console.error('Error fetching overdue items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to calculate days left
function calculateDaysLeft(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);
  const timeDiff = due.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export default router;
