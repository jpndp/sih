import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { runQuery } from '../database/init.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, Excel, and image files are allowed.'));
    }
  }
});

// Upload single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const { department, type, author } = req.body;

    // Generate document metadata
    const documentId = crypto.randomUUID();
    const title = path.parse(file.originalname).name;
    const summary = generateSummary(title, department);
    const tags = generateTags(title, department);
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%

    // Save document to database
    await runQuery(
      `INSERT INTO documents
       (id, title, summary, department, type, author, file_path, file_size, tags, confidence, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        documentId,
        title,
        summary,
        department || 'General',
        type || 'Document',
        author || 'System',
        file.path,
        file.size,
        JSON.stringify(tags),
        confidence,
        'processing'
      ]
    );

    // Simulate processing delay
    setTimeout(async () => {
      await runQuery('UPDATE documents SET status = ? WHERE id = ?', ['complete', documentId]);
    }, 3000);

    const document = {
      id: documentId,
      title,
      summary,
      department: department || 'General',
      type: type || 'Document',
      author: author || 'System',
      file_path: file.path,
      file_size: file.size,
      tags,
      confidence,
      status: 'processing',
      upload_date: new Date().toISOString()
    };

    res.status(201).json({
      message: 'File uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files as Express.Multer.File[];
    const { department, type, author } = req.body;

    const uploadedDocuments = [];

    for (const file of files) {
      const documentId = crypto.randomUUID();
      const title = path.parse(file.originalname).name;
      const summary = generateSummary(title, department);
      const tags = generateTags(title, department);
      const confidence = Math.floor(Math.random() * 20) + 80;

      await runQuery(
        `INSERT INTO documents
         (id, title, summary, department, type, author, file_path, file_size, tags, confidence, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          documentId,
          title,
          summary,
          department || 'General',
          type || 'Document',
          author || 'System',
          file.path,
          file.size,
          JSON.stringify(tags),
          confidence,
          'processing'
        ]
      );

      // Simulate processing delay
      setTimeout(async () => {
        await runQuery('UPDATE documents SET status = ? WHERE id = ?', ['complete', documentId]);
      }, 2000 + Math.random() * 3000);

      uploadedDocuments.push({
        id: documentId,
        title,
        summary,
        department: department || 'General',
        type: type || 'Document',
        author: author || 'System',
        file_path: file.path,
        file_size: file.size,
        tags,
        confidence,
        status: 'processing',
        upload_date: new Date().toISOString()
      });
    }

    res.status(201).json({
      message: `${files.length} files uploaded successfully`,
      documents: uploadedDocuments
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upload statistics
router.get('/stats', async (req, res) => {
  try {
    // Return mock statistics for now
    res.json({
      today_uploads: 247,
      processing: 18,
      completed: 229,
      avg_confidence: 94.2,
      processing_time: 1.8
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function generateSummary(title: string, department?: string): string {
  const summaries = [
    'Critical safety updates for platform operations with immediate implementation required.',
    'Procurement document requires approval from Engineering department before processing payment.',
    'Routine maintenance schedule changes affecting weekend service operations.',
    'Staff training requirements updated per latest regulatory guidelines.',
    'Standard operational procedure updates for customer service protocols.',
    'Environmental compliance documentation for regulatory submission.',
    'Financial report analysis showing cost optimization opportunities.',
    'Technical specifications updated for equipment procurement.'
  ];

  // Department-specific summaries
  if (department === 'Safety & Security') {
    return 'Safety protocol documentation with compliance requirements and implementation guidelines.';
  } else if (department === 'Procurement') {
    return 'Procurement documentation including vendor evaluation and contract terms.';
  } else if (department === 'Engineering') {
    return 'Technical documentation covering system specifications and maintenance procedures.';
  }

  return summaries[Math.floor(Math.random() * summaries.length)];
}

function generateTags(title: string, department?: string): string[] {
  const baseTags = ['document'];

  if (department) {
    baseTags.push(department.toLowerCase().replace(' & ', '-'));
  }

  // Extract keywords from title
  const titleWords = title.toLowerCase().split(/[\s\-_]+/);
  const relevantWords = titleWords.filter(word =>
    word.length > 3 &&
    !['document', 'report', 'update', 'review', 'analysis'].includes(word)
  );

  return [...baseTags, ...relevantWords.slice(0, 3)];
}

export default router;
