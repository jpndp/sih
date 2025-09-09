import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Document {
  id: string;
  title: string;
  type: 'engineering_drawing' | 'maintenance_card' | 'incident_report' | 'invoice' | 'regulatory_directive';
  category: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'review_required';
  source: 'manual' | 'email' | 'sharepoint' | 'whatsapp' | 'maximo';
  uploadedBy: string;
  assignedTo?: string[];
  uploadDate: string;
  lastModified: string;
  fileSize: number;
  fileType: string;
  confidenceScore?: number;
  tags: string[];
  metadata: Record<string, any>;
  complianceDeadline?: string;
  processingTime?: number;
  thumbnailUrl?: string;
}

interface DocumentsState {
  documents: Document[];
  filteredDocuments: Document[];
  loading: boolean;
  uploadProgress: Record<string, number>;
  filters: {
    status: string[];
    priority: string[];
    type: string[];
    dateRange: [string, string] | null;
    assignedTo: string[];
    search: string;
  };
  sortBy: 'uploadDate' | 'priority' | 'status' | 'title';
  sortOrder: 'asc' | 'desc';
  selectedDocuments: string[];
  error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  filteredDocuments: [],
  loading: false,
  uploadProgress: {},
  filters: {
    status: [],
    priority: [],
    type: [],
    dateRange: null,
    assignedTo: [],
    search: '',
  },
  sortBy: 'uploadDate',
  sortOrder: 'desc',
  selectedDocuments: [],
  error: null,
};

// Mock data for demo
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Metro Station Platform Drawing - Aluva',
    type: 'engineering_drawing',
    category: 'Infrastructure',
    priority: 'high',
    status: 'completed',
    source: 'manual',
    uploadedBy: 'engineer@kmrl.co.in',
    assignedTo: ['team-lead@kmrl.co.in', 'architect@kmrl.co.in'],
    uploadDate: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T14:45:00Z',
    fileSize: 2457600,
    fileType: 'PDF',
    confidenceScore: 0.95,
    tags: ['station', 'platform', 'aluva', 'infrastructure'],
    metadata: {
      stationCode: 'ALV',
      drawingNumber: 'KMRL-ALV-PLT-001',
      revision: 'Rev-03',
    },
    processingTime: 45,
    thumbnailUrl: '/thumbnails/drawing1.jpg',
  },
  {
    id: '2',
    title: 'Monthly Maintenance Report - Rolling Stock',
    type: 'maintenance_card',
    category: 'Rolling Stock',
    priority: 'normal',
    status: 'review_required',
    source: 'email',
    uploadedBy: 'maintenance@kmrl.co.in',
    assignedTo: ['supervisor@kmrl.co.in'],
    uploadDate: '2024-01-14T09:15:00Z',
    lastModified: '2024-01-14T09:15:00Z',
    fileSize: 1024000,
    fileType: 'PDF',
    confidenceScore: 0.88,
    tags: ['maintenance', 'rolling-stock', 'monthly', 'report'],
    metadata: {
      reportPeriod: '2024-01',
      trainSet: 'KMRL-TS-001',
      maintenanceType: 'Preventive',
    },
    complianceDeadline: '2024-02-15T23:59:59Z',
    processingTime: 120,
  },
];

export const fetchDocuments = createAsyncThunk('documents/fetch', async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockDocuments;
});

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (file: File, { dispatch }) => {
    // Simulate file upload with progress
    const formData = new FormData();
    formData.append('file', file);
    
    // Mock upload progress
    const uploadId = Date.now().toString();
    dispatch(setUploadProgress({ fileId: uploadId, progress: 0 }));
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch(setUploadProgress({ fileId: uploadId, progress: i }));
    }
    
    // Mock successful upload response
    const newDocument: Document = {
      id: uploadId,
      title: file.name,
      type: 'engineering_drawing',
      category: 'Uncategorized',
      priority: 'normal',
      status: 'processing',
      source: 'manual',
      uploadedBy: 'current-user@kmrl.co.in',
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      fileSize: file.size,
      fileType: file.type,
      tags: [],
      metadata: {},
      processingTime: 0,
    };
    
    dispatch(clearUploadProgress(uploadId));
    return newDocument;
  }
);

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<DocumentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredDocuments = applyFilters(state.documents, state.filters);
    },
    setSorting: (state, action: PayloadAction<{ sortBy: DocumentsState['sortBy']; sortOrder: DocumentsState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.filteredDocuments = sortDocuments(state.filteredDocuments, action.payload.sortBy, action.payload.sortOrder);
    },
    setSelectedDocuments: (state, action: PayloadAction<string[]>) => {
      state.selectedDocuments = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<{ fileId: string; progress: number }>) => {
      state.uploadProgress[action.payload.fileId] = action.payload.progress;
    },
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload];
    },
    updateDocument: (state, action: PayloadAction<{ id: string; updates: Partial<Document> }>) => {
      const index = state.documents.findIndex(doc => doc.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...action.payload.updates };
        state.filteredDocuments = applyFilters(state.documents, state.filters);
      }
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
      state.filteredDocuments = applyFilters(state.documents, state.filters);
      state.selectedDocuments = state.selectedDocuments.filter(id => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
        state.filteredDocuments = applyFilters(action.payload, state.filters);
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch documents';
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.documents.unshift(action.payload);
        state.filteredDocuments = applyFilters(state.documents, state.filters);
      });
  },
});

// Helper functions
function applyFilters(documents: Document[], filters: DocumentsState['filters']): Document[] {
  return documents.filter(doc => {
    if (filters.status.length > 0 && !filters.status.includes(doc.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(doc.priority)) return false;
    if (filters.type.length > 0 && !filters.type.includes(doc.type)) return false;
    if (filters.search && !doc.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.assignedTo.length > 0 && !doc.assignedTo?.some(user => filters.assignedTo.includes(user))) return false;
    
    if (filters.dateRange) {
      const uploadDate = new Date(doc.uploadDate);
      const [startDate, endDate] = filters.dateRange;
      if (uploadDate < new Date(startDate) || uploadDate > new Date(endDate)) return false;
    }
    
    return true;
  });
}

function sortDocuments(documents: Document[], sortBy: DocumentsState['sortBy'], sortOrder: DocumentsState['sortOrder']): Document[] {
  return [...documents].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'uploadDate':
        comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

export const {
  setFilters,
  setSorting,
  setSelectedDocuments,
  setUploadProgress,
  clearUploadProgress,
  updateDocument,
  deleteDocument,
} = documentsSlice.actions;