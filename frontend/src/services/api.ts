import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status
    };

    if (error.response?.data) {
      apiError.message = error.response.data.detail || 
                        error.response.data.message || 
                        'Server error';
      apiError.code = error.response.data.code;
    } else if (error.request) {
      apiError.message = 'No response from server';
      apiError.code = 'NETWORK_ERROR';
    }

    throw apiError;
  }
);

export interface UploadResponse {
  filename: string;
  size: number;
  message: string;
  saved_path?: string;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<UploadResponse>('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

  return data;
};

export default apiClient;