import express from 'express';
import { getAll } from '../database/init.js';

const router = express.Router();

// Get dashboard overview data
router.get('/overview', async (req, res) => {
  try {
    // Get document statistics
    const documentStats = await getAll(`
      SELECT
        COUNT(*) as total_documents,
        COUNT(CASE WHEN DATE(upload_date) = DATE('now') THEN 1 END) as today_documents,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as pending_reviews,
        COUNT(CASE WHEN priority = 'High' THEN 1 END) as high_priority_alerts,
        AVG(confidence) as auto_categorized_percentage
      FROM documents
    `);

    // Get recent documents
    const recentDocuments = await getAll(`
      SELECT
        id,
        title,
        department,
        priority,
        upload_date,
        summary,
        status
      FROM documents
      ORDER BY upload_date DESC
      LIMIT 5
    `);

    // Get compliance alerts
    const complianceAlerts = await getAll(`
      SELECT
        id,
        title,
        due_date,
        status,
        CAST((julianday(due_date) - julianday('now')) AS INTEGER) as days_left
      FROM compliance_items
      WHERE status IN ('urgent', 'warning')
        AND due_date >= DATE('now')
      ORDER BY due_date ASC
      LIMIT 3
    `);

    // Process recent documents
    const processedRecentDocs = recentDocuments.map(doc => ({
      ...doc,
      processed: formatTimeAgo(doc.upload_date as string),
      priority_color: getPriorityColor(doc.priority as string)
    }));

    // Process compliance alerts
    const processedAlerts = complianceAlerts.map(alert => ({
      ...alert,
      deadline: new Date(alert.due_date as string).toLocaleDateString(),
      status_color: getStatusColor(alert.status as string)
    }));

    res.json({
      stats: {
        documents_processed_today: (documentStats[0]?.today_documents as number) || 0,
        pending_reviews: (documentStats[0]?.pending_reviews as number) || 0,
        compliance_alerts: (documentStats[0]?.high_priority_alerts as number) || 0,
        auto_categorized_percentage: Math.round(((documentStats[0]?.auto_categorized_percentage as number) || 0) * 100) / 100
      },
      recent_documents: processedRecentDocs,
      compliance_alerts: processedAlerts,
      system_status: {
        ai_processing_active: true,
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quick actions data
router.get('/quick-actions', async (req, res) => {
  try {
    // Get processing queue length
    const processingStats = await getAll(`
      SELECT
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_count,
        COUNT(CASE WHEN status = 'complete' THEN 1 END) as completed_today,
        AVG(confidence) as avg_confidence
      FROM documents
      WHERE upload_date >= DATE('now', '-1 day')
    `);

    // Get compliance items needing attention
    const urgentCompliance = await getAll(`
      SELECT COUNT(*) as urgent_count
      FROM compliance_items
      WHERE status = 'urgent' AND due_date >= DATE('now')
    `);

    res.json({
      bulk_upload: {
        available: true,
        processing_queue: (processingStats[0]?.processing_count as number) || 0
      },
      ai_summary: {
        available: true,
        accuracy_rate: Math.round(((processingStats[0]?.avg_confidence as number) || 0) * 100) / 100
      },
      team_reports: {
        available: true,
        pending_reports: (urgentCompliance[0]?.urgent_count as number) || 0
      },
      schedule_review: {
        available: true,
        upcoming_deadlines: 5
      }
    });
  } catch (error) {
    console.error('Quick actions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity feed
router.get('/activity', async (req, res) => {
  try {
    const { limit = '10' } = req.query;

    // Get recent document activities
    const documentActivities = await getAll(`
      SELECT
        'document_uploaded' as type,
        title as description,
        author as user,
        upload_date as timestamp,
        department
      FROM documents
      ORDER BY upload_date DESC
      LIMIT ?
    `, [parseInt(limit as string) / 2]);

    // Get recent compliance activities
    const complianceActivities = await getAll(`
      SELECT
        'compliance_updated' as type,
        title as description,
        assigned_to as user,
        last_update as timestamp,
        'Compliance' as department
      FROM compliance_items
      WHERE last_update IS NOT NULL
      ORDER BY last_update DESC
      LIMIT ?
    `, [parseInt(limit as string) / 2]);

    // Combine and sort activities
    const allActivities = [...documentActivities, ...complianceActivities]
      .sort((a, b) => new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime())
      .slice(0, parseInt(limit as string));

    // Process activities
    const processedActivities = allActivities.map(activity => ({
      ...activity,
      time_ago: formatTimeAgo(activity.timestamp as string),
      icon: getActivityIcon(activity.type as string)
    }));

    res.json({
      activities: processedActivities,
      total: processedActivities.length
    });
  } catch (error) {
    console.error('Activity feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'gray';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'urgent': return 'red';
    case 'warning': return 'orange';
    case 'normal': return 'green';
    default: return 'gray';
  }
}

function getActivityIcon(type: string): string {
  switch (type) {
    case 'document_uploaded': return 'file-text';
    case 'compliance_updated': return 'shield';
    default: return 'activity';
  }
}

export default router;
