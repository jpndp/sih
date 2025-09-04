import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

export let db: sqlite3.Database;

export const initializeDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dbPath = process.env.DATABASE_PATH || './database.sqlite';

    // Ensure the directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }

      console.log('Connected to SQLite database');

      // Create tables
      createTables()
        .then(() => {
          console.log('Database tables created successfully');
          // Seed initial data
          return seedDatabase();
        })
        .then(() => {
          console.log('Database seeded successfully');
          resolve();
        })
        .catch(reject);
    });
  });
};

const createTables = async (): Promise<void> => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      summary TEXT,
      department TEXT NOT NULL,
      type TEXT NOT NULL,
      author TEXT NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      file_path TEXT,
      file_size INTEGER,
      language TEXT DEFAULT 'English',
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Active',
      tags TEXT, -- JSON array
      confidence REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS compliance_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      authority TEXT NOT NULL,
      due_date DATETIME NOT NULL,
      status TEXT DEFAULT 'normal', -- urgent, warning, normal
      progress REAL DEFAULT 0,
      assigned_to TEXT,
      documents_count INTEGER DEFAULT 0,
      last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS document_analytics (
      id TEXT PRIMARY KEY,
      date DATE NOT NULL,
      department TEXT NOT NULL,
      documents_processed INTEGER DEFAULT 0,
      accuracy_rate REAL DEFAULT 0,
      processing_time REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS search_logs (
      id TEXT PRIMARY KEY,
      query TEXT NOT NULL,
      user_id TEXT,
      results_count INTEGER DEFAULT 0,
      search_time REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const table of tables) {
    await runQuery(table);
  }
};

const seedDatabase = async (): Promise<void> => {
  // Check if data already exists
  const userCount = await getOne('SELECT COUNT(*) as count FROM users');
  if (userCount && typeof userCount.count === 'number' && userCount.count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database with initial data...');

  // Seed users
  const users = [
    ['admin', 'admin@kmrl.com', '$2a$10$hashedpassword', 'admin', 'IT'],
    ['safety_officer', 'safety@kmrl.com', '$2a$10$hashedpassword', 'user', 'Safety & Security'],
    ['engineer', 'engineer@kmrl.com', '$2a$10$hashedpassword', 'user', 'Engineering'],
    ['procurement', 'procurement@kmrl.com', '$2a$10$hashedpassword', 'user', 'Procurement']
  ];

  for (const user of users) {
    await runQuery('INSERT INTO users (id, username, email, password_hash, role, department) VALUES (?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), ...user]);
  }

  // Seed sample documents
  const documents = [
    ['Safety Protocol Update', 'Updated safety protocols for platform maintenance', 'Operations', 'Safety Bulletin', 'Chief Safety Officer', 'High', 'Active', '["safety", "maintenance", "platform"]', 95],
    ['Vendor Invoice - SKF Bearings', 'Invoice for Q1 bearing replacements', 'Procurement', 'Financial Report', 'Procurement Manager', 'Medium', 'Under Review', '["procurement", "invoice", "bearings"]', 88],
    ['Environmental Impact Assessment', 'Phase 2 corridor extension environmental clearance', 'Planning', 'Regulatory Document', 'Environmental Officer', 'High', 'Action Required', '["environment", "compliance", "phase-2"]', 92],
    ['Training Schedule Updates', 'Revised operator certification schedule', 'HR', 'Training Document', 'Training Coordinator', 'Low', 'Draft', '["training", "hr", "schedule"]', 78],
    ['Rolling Stock Maintenance Report', 'Monthly rolling stock maintenance report', 'Engineering', 'Maintenance Report', 'Chief Engineer', 'Medium', 'Complete', '["maintenance", "rolling-stock", "engineering"]', 91]
  ];

  for (const doc of documents) {
    await runQuery(`INSERT INTO documents
      (id, title, summary, department, type, author, priority, status, tags, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), ...doc]);
  }

  // Seed compliance items
  const complianceItems = [
    ['CMRS Annual Safety Inspection', 'Annual comprehensive safety inspection covering rolling stock, infrastructure, and operational procedures.', 'Commissioner of Metro Rail Safety', '2025-03-15', 'urgent', 65, 'Safety Team', 12],
    ['Environmental Impact Assessment Update', 'Environmental compliance update for Phase 2 corridor extension project.', 'Ministry of Environment', '2025-04-30', 'warning', 40, 'Environmental Team', 8],
    ['Fire Safety Certificate Renewal', 'Annual fire safety certificate renewal for all stations and depot facilities.', 'Kerala Fire & Rescue Services', '2025-05-20', 'normal', 25, 'Safety & Security', 5],
    ['Financial Audit Compliance', 'Annual financial audit preparation and compliance documentation submission.', 'Comptroller & Auditor General', '2025-06-30', 'normal', 15, 'Finance Team', 23],
    ['Accessibility Standards Review', 'Compliance review for accessibility standards across all metro stations and facilities.', 'Central Government', '2025-07-15', 'normal', 10, 'Operations Team', 7]
  ];

  for (const item of complianceItems) {
    await runQuery(`INSERT INTO compliance_items
      (id, title, description, authority, due_date, status, progress, assigned_to, documents_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), ...item]);
  }

  console.log('Database seeding completed');
};

// Helper functions for database operations
export const runQuery = async (query: string, params: (string | number | null)[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const getAll = async (query: string, params: (string | number | null)[] = []): Promise<Record<string, string | number | null>[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as Record<string, string | number | null>[]);
    });
  });
};

export const getOne = async (query: string, params: (string | number | null)[] = []): Promise<Record<string, string | number | null> | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as Record<string, string | number | null> | undefined);
    });
  });
};

export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
};
