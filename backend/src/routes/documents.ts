import express from 'express';
import { getAll, getOne, runQuery } from '../database/init.js';

const router = express.Router();

// Get all documents with optional filtering
router.get('/', async (req, res) => {
  try {
    const {
      department,
      priority,
      status,
      type,
      search,
      page = '1',
      limit = '20'
    } = req.query;

    let query = 'SELECT * FROM documents WHERE 1=1';
    const params: (string | number)[] = [];

    // Add filters
    if (department && department !== 'All Departments') {
      query += ' AND department = ?';
      params.push(department as string);
    }

    if (priority && priority !== 'All Priorities') {
      query += ' AND priority = ?';
      params.push(priority as string);
    }

    if (status && status !== 'All Statuses') {
      query += ' AND status = ?';
      params.push(status as string);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type as string);
    }

    if (search) {
      query += ' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query += ' ORDER BY upload_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), offset);

    const documents = await getAll(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM documents WHERE 1=1';
    const countParams: (string | number)[] = [];

    if (department && department !== 'All Departments') {
      countQuery += ' AND department = ?';
      countParams.push(department as string);
    }

    if (priority && priority !== 'All Priorities') {
      countQuery += ' AND priority = ?';
      countParams.push(priority as string);
    }

    if (status && status !== 'All Statuses') {
      countQuery += ' AND status = ?';
      countParams.push(status as string);
    }

    if (type) {
      countQuery += ' AND type = ?';
      countParams.push(type as string);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await getOne(countQuery, countParams);
    const total = countResult ? (countResult.total as number) : 0;

    res.json({
      documents,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await getOne('SELECT * FROM documents WHERE id = ?', [id]);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new document
router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      summary,
      department,
      type,
      author,
      priority = 'Medium',
      status = 'Active',
      tags,
      confidence = 0,
      language = 'English',
      file_path,
      file_size
    } = req.body;

    if (!title || !department || !type || !author) {
      return res.status(400).json({ error: 'Title, department, type, and author are required' });
    }

    const documentId = crypto.randomUUID();

    await runQuery(
      `INSERT INTO documents
       (id, title, content, summary, department, type, author, priority, status, tags, confidence, language, file_path, file_size)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [documentId, title, content || null, summary || null, department, type, author, priority, status,
       tags ? JSON.stringify(tags) : null, confidence, language, file_path || null, file_size || null]
    );

    const newDocument = await getOne('SELECT * FROM documents WHERE id = ?', [documentId]);
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update document
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if document exists
    const existingDocument = await getOne('SELECT id FROM documents WHERE id = ?', [id]);
    if (!existingDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Build update query
    const updateFields: string[] = [];
    const params: (string | number | null)[] = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = ?`);
        params.push(key === 'tags' ? JSON.stringify(updates[key]) : updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(id);
    await runQuery(
      `UPDATE documents SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    const updatedDocument = await getOne('SELECT * FROM documents WHERE id = ?', [id]);
    res.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if document exists
    const existingDocument = await getOne('SELECT id FROM documents WHERE id = ?', [id]);
    if (!existingDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await runQuery('DELETE FROM documents WHERE id = ?', [id]);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await getAll(`
      SELECT
        COUNT(*) as total_documents,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_documents,
        COUNT(CASE WHEN priority = 'High' THEN 1 END) as high_priority,
        AVG(confidence) as avg_confidence,
        COUNT(DISTINCT department) as departments_count
      FROM documents
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching document stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
