import express from 'express';
import { getAll, runQuery } from '../database/init.js';

const router = express.Router();

// Advanced search endpoint
router.get('/', async (req, res) => {
  try {
    const {
      q: query,
      department,
      type,
      date_from,
      date_to,
      language,
      page = '1',
      limit = '20'
    } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let sqlQuery = `
      SELECT *,
             CASE
               WHEN title LIKE ? THEN 3
               WHEN summary LIKE ? THEN 2
               WHEN content LIKE ? THEN 1
               ELSE 0
             END as relevance_score
      FROM documents
      WHERE (title LIKE ? OR summary LIKE ? OR content LIKE ?)
    `;

    const searchTerm = `%${query}%`;
    const params: (string | number)[] = [
      searchTerm, searchTerm, searchTerm, // For relevance scoring
      searchTerm, searchTerm, searchTerm  // For WHERE clause
    ];

    // Add filters
    if (department && department !== 'All') {
      sqlQuery += ' AND department = ?';
      params.push(department as string);
    }

    if (type && type !== 'All') {
      sqlQuery += ' AND type = ?';
      params.push(type as string);
    }

    if (language && language !== 'All') {
      sqlQuery += ' AND language = ?';
      params.push(language as string);
    }

    if (date_from) {
      sqlQuery += ' AND DATE(upload_date) >= ?';
      params.push(date_from as string);
    }

    if (date_to) {
      sqlQuery += ' AND DATE(upload_date) <= ?';
      params.push(date_to as string);
    }

    // Add pagination and ordering
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    sqlQuery += ' ORDER BY relevance_score DESC, upload_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), offset);

    const results = await getAll(sqlQuery, params);

    // Process results to add highlights and format data
    const processedResults = results.map(result => ({
      ...result,
      highlights: generateHighlights(result, query as string),
      tags: result.tags ? JSON.parse(result.tags as string) : [],
      upload_date: new Date(result.upload_date as string).toISOString().split('T')[0]
    }));

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM documents WHERE (title LIKE ? OR summary LIKE ? OR content LIKE ?)';
    const countParams: (string | number)[] = [searchTerm, searchTerm, searchTerm];

    if (department && department !== 'All') {
      countQuery += ' AND department = ?';
      countParams.push(department as string);
    }

    if (type && type !== 'All') {
      countQuery += ' AND type = ?';
      countParams.push(type as string);
    }

    if (language && language !== 'All') {
      countQuery += ' AND language = ?';
      countParams.push(language as string);
    }

    if (date_from) {
      countQuery += ' AND DATE(upload_date) >= ?';
      countParams.push(date_from as string);
    }

    if (date_to) {
      countQuery += ' AND DATE(upload_date) <= ?';
      countParams.push(date_to as string);
    }

    const countResult = await getAll(countQuery, countParams);
    const total = (countResult[0]?.total as number) || 0;

    // Log search for analytics
    await runQuery(
      'INSERT INTO search_logs (id, query, results_count, search_time) VALUES (?, ?, ?, ?)',
      [crypto.randomUUID(), query as string, processedResults.length, 0.24]
    );

    res.json({
      query: query as string,
      results: processedResults,
      total,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string))
      },
      search_time: 0.24
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Quick search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query || (query as string).length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await getAll(`
      SELECT DISTINCT title as suggestion, 'title' as type, COUNT(*) as frequency
      FROM documents
      WHERE title LIKE ?
      GROUP BY title
      ORDER BY frequency DESC, title
      LIMIT 5
    `, [`%${query}%`]);

    const summarySuggestions = await getAll(`
      SELECT DISTINCT substr(summary, 1, 50) || '...' as suggestion, 'summary' as type, COUNT(*) as frequency
      FROM documents
      WHERE summary LIKE ?
      GROUP BY summary
      ORDER BY frequency DESC
      LIMIT 3
    `, [`%${query}%`]);

    res.json({
      suggestions: [...suggestions, ...summarySuggestions]
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search analytics
router.get('/analytics/overview', async (req, res) => {
  try {
    const analytics = await getAll(`
      SELECT
        COUNT(*) as total_searches,
        AVG(results_count) as avg_results,
        AVG(search_time) as avg_search_time,
        COUNT(DISTINCT query) as unique_queries
      FROM search_logs
      WHERE timestamp >= DATE('now', '-30 days')
    `);

    const popularQueries = await getAll(`
      SELECT query, COUNT(*) as count
      FROM search_logs
      WHERE timestamp >= DATE('now', '-30 days')
      GROUP BY query
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      overview: analytics[0] || {
        total_searches: 0,
        avg_results: 0,
        avg_search_time: 0,
        unique_queries: 0
      },
      popular_queries: popularQueries
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to generate highlights
function generateHighlights(document: Record<string, string | number | null>, query: string): string[] {
  const highlights: string[] = [];
  const searchTerms = query.toLowerCase().split(/\s+/);

  // Check title
  if (document.title && typeof document.title === 'string' && searchTerms.some(term => (document.title as string).toLowerCase().includes(term))) {
    highlights.push(document.title as string);
  }

  // Check summary
  if (document.summary && typeof document.summary === 'string') {
    const summaryWords = (document.summary as string).toLowerCase().split(/\s+/);
    const matchingWords = summaryWords.filter((word: string) =>
      searchTerms.some(term => word.includes(term))
    );
    if (matchingWords.length > 0) {
      highlights.push(...matchingWords.slice(0, 3));
    }
  }

  // Check content
  if (document.content && typeof document.content === 'string') {
    const contentWords = (document.content as string).toLowerCase().split(/\s+/);
    const matchingWords = contentWords.filter((word: string) =>
      searchTerms.some(term => word.includes(term))
    );
    if (matchingWords.length > 0) {
      highlights.push(...matchingWords.slice(0, 3));
    }
  }

  return [...new Set(highlights)]; // Remove duplicates
}

export default router;
