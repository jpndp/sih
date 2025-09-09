import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface SystemHealth {
  ocrService: 'healthy' | 'warning' | 'error';
  aiProcessing: 'healthy' | 'warning' | 'error';
  integrations: 'healthy' | 'warning' | 'error';
  database: 'healthy' | 'warning' | 'error';
  lastUpdated: string;
}

export interface ProcessingMetrics {
  totalDocuments: number;
  processedToday: number;
  successRate: number;
  averageProcessingTime: number;
  queueLength: number;
  dailyTrend: Array<{ date: string; count: number; successRate: number }>;
  categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
}

export interface ComplianceAlerts {
  critical: number;
  warning: number;
  info: number;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    deadline: string;
    daysRemaining: number;
    priority: 'critical' | 'high' | 'normal';
  }>;
}

export interface IntegrationStatus {
  maximo: { status: 'connected' | 'disconnected' | 'error'; lastSync: string };
  sharepoint: { status: 'connected' | 'disconnected' | 'error'; lastSync: string };
  email: { status: 'connected' | 'disconnected' | 'error'; lastSync: string };
  whatsapp: { status: 'connected' | 'disconnected' | 'error'; lastSync: string };
}

interface DashboardState {
  systemHealth: SystemHealth | null;
  processingMetrics: ProcessingMetrics | null;
  complianceAlerts: ComplianceAlerts | null;
  integrationStatus: IntegrationStatus | null;
  loading: boolean;
  error: string | null;
  lastRefresh: string | null;
}

const initialState: DashboardState = {
  systemHealth: null,
  processingMetrics: null,
  complianceAlerts: null,
  integrationStatus: null,
  loading: false,
  error: null,
  lastRefresh: null,
};

// Mock data for demo
const mockSystemHealth: SystemHealth = {
  ocrService: 'healthy',
  aiProcessing: 'warning',
  integrations: 'healthy',
  database: 'healthy',
  lastUpdated: new Date().toISOString(),
};

const mockProcessingMetrics: ProcessingMetrics = {
  totalDocuments: 15420,
  processedToday: 127,
  successRate: 96.5,
  averageProcessingTime: 45,
  queueLength: 8,
  dailyTrend: [
    { date: '2024-01-10', count: 95, successRate: 94.2 },
    { date: '2024-01-11', count: 112, successRate: 95.8 },
    { date: '2024-01-12', count: 87, successRate: 97.1 },
    { date: '2024-01-13', count: 134, successRate: 96.3 },
    { date: '2024-01-14', count: 109, successRate: 95.4 },
    { date: '2024-01-15', count: 127, successRate: 96.5 },
  ],
  categoryDistribution: [
    { category: 'Engineering Drawings', count: 4520, percentage: 29.3 },
    { category: 'Maintenance Cards', count: 3890, percentage: 25.2 },
    { category: 'Incident Reports', count: 2340, percentage: 15.2 },
    { category: 'Invoices', count: 2980, percentage: 19.3 },
    { category: 'Regulatory Directives', count: 1690, percentage: 11.0 },
  ],
};

const mockComplianceAlerts: ComplianceAlerts = {
  critical: 2,
  warning: 5,
  info: 12,
  upcomingDeadlines: [
    {
      id: '1',
      title: 'Safety Audit Report Submission',
      deadline: '2024-01-25T23:59:59Z',
      daysRemaining: 10,
      priority: 'critical',
    },
    {
      id: '2',
      title: 'Monthly Maintenance Compliance Review',
      deadline: '2024-02-01T23:59:59Z',
      daysRemaining: 17,
      priority: 'high',
    },
    {
      id: '3',
      title: 'Environmental Impact Assessment Update',
      deadline: '2024-02-15T23:59:59Z',
      daysRemaining: 31,
      priority: 'normal',
    },
  ],
};

const mockIntegrationStatus: IntegrationStatus = {
  maximo: { status: 'connected', lastSync: '2024-01-15T14:30:00Z' },
  sharepoint: { status: 'connected', lastSync: '2024-01-15T14:25:00Z' },
  email: { status: 'connected', lastSync: '2024-01-15T14:35:00Z' },
  whatsapp: { status: 'error', lastSync: '2024-01-15T12:00:00Z' },
};

export const fetchDashboardData = createAsyncThunk('dashboard/fetchData', async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    systemHealth: mockSystemHealth,
    processingMetrics: mockProcessingMetrics,
    complianceAlerts: mockComplianceAlerts,
    integrationStatus: mockIntegrationStatus,
  };
});

export const refreshSystemHealth = createAsyncThunk('dashboard/refreshHealth', async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    ...mockSystemHealth,
    lastUpdated: new Date().toISOString(),
  };
});

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateMetric: (state, action: PayloadAction<{ metric: keyof ProcessingMetrics; value: any }>) => {
      if (state.processingMetrics) {
        (state.processingMetrics as any)[action.payload.metric] = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.systemHealth = action.payload.systemHealth;
        state.processingMetrics = action.payload.processingMetrics;
        state.complianceAlerts = action.payload.complianceAlerts;
        state.integrationStatus = action.payload.integrationStatus;
        state.lastRefresh = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      })
      .addCase(refreshSystemHealth.fulfilled, (state, action) => {
        state.systemHealth = action.payload;
      });
  },
});

export const { clearError, updateMetric } = dashboardSlice.actions;