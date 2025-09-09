import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'environmental' | 'regulatory' | 'operational';
  priority: 'critical' | 'high' | 'normal' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string[];
  deadline: string;
  createdDate: string;
  lastUpdated: string;
  documents: string[];
  progress: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceScore: number;
  auditTrail: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
    details: string;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    uploadDate: string;
  }>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  outcome: 'success' | 'failure' | 'warning';
}

interface ComplianceState {
  items: ComplianceItem[];
  filteredItems: ComplianceItem[];
  auditLogs: AuditLog[];
  loading: boolean;
  filters: {
    status: string[];
    priority: string[];
    category: string[];
    assignedTo: string[];
    riskLevel: string[];
    dateRange: [string, string] | null;
  };
  selectedItems: string[];
  complianceOverview: {
    totalItems: number;
    completionRate: number;
    overdueCount: number;
    riskDistribution: Record<string, number>;
  } | null;
  error: string | null;
}

const initialState: ComplianceState = {
  items: [],
  filteredItems: [],
  auditLogs: [],
  loading: false,
  filters: {
    status: [],
    priority: [],
    category: [],
    assignedTo: [],
    riskLevel: [],
    dateRange: null,
  },
  selectedItems: [],
  complianceOverview: null,
  error: null,
};

// Mock data for demo
const mockComplianceItems: ComplianceItem[] = [
  {
    id: '1',
    title: 'Annual Safety Certification Renewal',
    description: 'Renew safety certification for metro operations as per CMRS guidelines',
    category: 'safety',
    priority: 'critical',
    status: 'in_progress',
    assignedTo: ['safety@kmrl.co.in', 'compliance@kmrl.co.in'],
    deadline: '2024-02-15T23:59:59Z',
    createdDate: '2024-01-01T00:00:00Z',
    lastUpdated: '2024-01-15T10:30:00Z',
    documents: ['safety-cert-2023.pdf', 'audit-report-2024.pdf'],
    progress: 65,
    riskLevel: 'high',
    complianceScore: 78,
    auditTrail: [
      {
        id: '1',
        action: 'Created compliance item',
        user: 'system@kmrl.co.in',
        timestamp: '2024-01-01T00:00:00Z',
        details: 'Automatic creation based on regulatory schedule',
      },
      {
        id: '2',
        action: 'Updated status',
        user: 'compliance@kmrl.co.in',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Marked as in progress - initial documentation submitted',
      },
    ],
    attachments: [
      {
        id: '1',
        name: 'safety-certification-form.pdf',
        type: 'application/pdf',
        size: 2048000,
        uploadDate: '2024-01-15T10:30:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Environmental Impact Assessment Update',
    description: 'Annual update of environmental impact assessment for metro corridor',
    category: 'environmental',
    priority: 'high',
    status: 'pending',
    assignedTo: ['env@kmrl.co.in'],
    deadline: '2024-03-01T23:59:59Z',
    createdDate: '2024-01-10T00:00:00Z',
    lastUpdated: '2024-01-10T00:00:00Z',
    documents: [],
    progress: 0,
    riskLevel: 'medium',
    complianceScore: 85,
    auditTrail: [
      {
        id: '3',
        action: 'Created compliance item',
        user: 'env@kmrl.co.in',
        timestamp: '2024-01-10T00:00:00Z',
        details: 'Created based on regulatory requirement',
      },
    ],
    attachments: [],
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T14:30:00Z',
    user: 'admin@kmrl.co.in',
    action: 'document_upload',
    resource: 'document_1',
    details: 'Uploaded safety audit report',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    outcome: 'success',
  },
  {
    id: '2',
    timestamp: '2024-01-15T13:45:00Z',
    user: 'compliance@kmrl.co.in',
    action: 'compliance_update',
    resource: 'compliance_1',
    details: 'Updated compliance status to in_progress',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    outcome: 'success',
  },
];

export const fetchComplianceData = createAsyncThunk('compliance/fetchData', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const complianceOverview = {
    totalItems: mockComplianceItems.length,
    completionRate: 65,
    overdueCount: 0,
    riskDistribution: {
      low: 0,
      medium: 1,
      high: 1,
      critical: 0,
    },
  };
  
  return {
    items: mockComplianceItems,
    auditLogs: mockAuditLogs,
    complianceOverview,
  };
});

export const updateComplianceItem = createAsyncThunk(
  'compliance/updateItem',
  async ({ id, updates }: { id: string; updates: Partial<ComplianceItem> }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, updates };
  }
);

export const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ComplianceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredItems = applyFilters(state.items, state.filters);
    },
    setSelectedItems: (state, action: PayloadAction<string[]>) => {
      state.selectedItems = action.payload;
    },
    addAuditLog: (state, action: PayloadAction<Omit<AuditLog, 'id' | 'timestamp'>>) => {
      const newLog: AuditLog = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.auditLogs.unshift(newLog);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplianceData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.auditLogs = action.payload.auditLogs;
        state.complianceOverview = action.payload.complianceOverview;
        state.filteredItems = applyFilters(action.payload.items, state.filters);
      })
      .addCase(fetchComplianceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch compliance data';
      })
      .addCase(updateComplianceItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.updates };
          state.filteredItems = applyFilters(state.items, state.filters);
        }
      });
  },
});

function applyFilters(items: ComplianceItem[], filters: ComplianceState['filters']): ComplianceItem[] {
  return items.filter(item => {
    if (filters.status.length > 0 && !filters.status.includes(item.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(item.priority)) return false;
    if (filters.category.length > 0 && !filters.category.includes(item.category)) return false;
    if (filters.riskLevel.length > 0 && !filters.riskLevel.includes(item.riskLevel)) return false;
    if (filters.assignedTo.length > 0 && !item.assignedTo.some(user => filters.assignedTo.includes(user))) return false;
    
    if (filters.dateRange) {
      const deadline = new Date(item.deadline);
      const [startDate, endDate] = filters.dateRange;
      if (deadline < new Date(startDate) || deadline > new Date(endDate)) return false;
    }
    
    return true;
  });
}

export const { setFilters, setSelectedItems, addAuditLog } = complianceSlice.actions;