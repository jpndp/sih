import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  Alert,
  Box, 
  Typography, 
  CircularProgress,
  useTheme,
  Tooltip,
  IconButton,
  Paper,
  alpha
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  Refresh as RetryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface FileStatus {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  result?: UploadResult;
}

interface UploadResult {
  filename?: string;
  size?: number;
  message?: string;
  error?: string;
  saved_path?: string;
}

interface AuthState {
  token: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];
const UPLOAD_TIMEOUT = 30000; // 30 seconds

const FileUpload: React.FC = () => {
  const theme = useTheme();
  const auth = useSelector((state: RootState) => state.auth as AuthState);
  const token = auth.token;
  
  // State
  const [fileQueue, setFileQueue] = useState<FileStatus[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File validation
  const validateFile = useCallback((file: File): string | null => {
    if (!file) return 'No file selected';
    
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File ${file.name}: Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only`;
    }
    
    return null;
  }, []);

  // File upload helpers
  const updateFileStatus = useCallback((
    fileId: string, 
    updates: Partial<FileStatus>
  ) => {
    setFileQueue(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, ...updates } 
          : f
      )
    );
  }, []);

  const uploadFile = useCallback(async (fileStatus: FileStatus): Promise<void> => {
    if (!token) {
      updateFileStatus(fileStatus.id, {
        status: 'error',
        result: { error: "Authentication required. Please log in first." }
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', fileStatus.file);

    try {
      updateFileStatus(fileStatus.id, { status: 'uploading', progress: 0 });
      setIsUploading(true);

      const response = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Set up upload timeout
        const timeoutId = setTimeout(() => {
          xhr.abort();
          reject(new Error('Upload timed out. Please try again.'));
        }, UPLOAD_TIMEOUT);

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            updateFileStatus(fileStatus.id, { progress });
          }
        });

        xhr.addEventListener('load', () => {
          clearTimeout(timeoutId);
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch {
              reject(new Error('Invalid server response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.response);
              reject(new Error(errorData.detail || 'Upload failed with status ' + xhr.status));
            } catch {
              reject(new Error('Upload failed with status ' + xhr.status));
            }
          }
        });

        xhr.addEventListener('error', () => {
          clearTimeout(timeoutId);
          reject(new Error('Network error'));
        });

        xhr.addEventListener('timeout', () => {
          clearTimeout(timeoutId);
          reject(new Error('Upload timeout'));
        });

        xhr.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new Error('Upload cancelled'));
        });

        xhr.open('POST', 'http://localhost:8000/api/upload', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.timeout = UPLOAD_TIMEOUT;
        xhr.send(formData);
      });

      updateFileStatus(fileStatus.id, {
        status: 'success',
        progress: 100,
        result: response
      });
    } catch (error: unknown) {
      updateFileStatus(fileStatus.id, {
        status: 'error',
        result: { 
          error: error instanceof Error ? error.message : 'Upload failed'
        }
      });
    } finally {
      const remainingUploads = fileQueue.filter(f => 
        f.id !== fileStatus.id && f.status === 'uploading'
      );
      if (remainingUploads.length === 0) {
        setIsUploading(false);
      }
    }
  }, [token, fileQueue, updateFileStatus]);
  
  // Event handlers
  const handleFilesAdded = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: FileStatus[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
      progress: 0
    }));

    const validFiles = newFiles.filter(fileStatus => !validateFile(fileStatus.file));
    if (validFiles.length > 0) {
      setFileQueue(prev => [...prev, ...validFiles]);
      setIsUploading(true);
      validFiles.forEach(fileStatus => uploadFile(fileStatus));
    }
  }, [uploadFile, validateFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (token) {
      handleFilesAdded(e.dataTransfer.files);
    }
  }, [token, handleFilesAdded]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (token) {
      setDragActive(true);
    }
  }, [token]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (token && e.target.files?.length) {
      handleFilesAdded(e.target.files);
    }
  }, [token, handleFilesAdded]);

  const retryUpload = useCallback((fileId: string) => {
    const fileStatus = fileQueue.find(f => f.id === fileId);
    if (fileStatus) {
      uploadFile({ ...fileStatus, status: 'pending', progress: 0 });
    }
  }, [fileQueue, uploadFile]);

  return (
    <Box p={4}>
      {!token && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          Please log in to upload files.
        </Alert>
      )}
      <Paper
        elevation={dragActive ? 4 : 1}
        component={motion.div}
        initial={{ scale: 1 }}
        whileHover={{ scale: token && !isUploading ? 1.02 : 1 }}
        whileTap={{ scale: token && !isUploading ? 0.98 : 1 }}
        animate={{
          scale: dragActive ? 1.05 : 1,
          borderColor: dragActive ? theme.palette.primary.main : theme.palette.grey[300],
          backgroundColor: dragActive ? alpha(theme.palette.primary.main, 0.08) : theme.palette.background.default
        }}
        sx={{
          maxWidth: 600,
          minHeight: 200,
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: token && !isUploading ? 'pointer' : 'not-allowed',
          opacity: !token ? 0.6 : 1,
          mb: 2,
          transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        }}
        onDrop={token ? handleDrop : undefined}
        onDragOver={token ? handleDragOver : undefined}
        onDragLeave={token ? handleDragLeave : undefined}
      >
        <Box
          component="label"
          htmlFor="file-upload"
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'inherit'
          }}
        >
          <Box
            component={motion.div}
            animate={{
              y: dragActive ? [-10, 0, -10] : 0
            }}
            transition={{
              repeat: dragActive ? Infinity : 0,
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <UploadIcon
              sx={{
                fontSize: 48,
                mb: 2,
                color: token ? 'primary.main' : 'grey.400'
              }}
            />
          </Box>
          <Typography variant="h6" color={token ? 'primary.main' : 'text.disabled'}>
            {isUploading ? "Uploading files..." : "Drop files here or click to upload"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Supports PDF, DOC, DOCX, and TXT files up to {MAX_FILE_SIZE / (1024 * 1024)}MB
          </Typography>
          <input
            id="file-upload"
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={!token}
            accept=".pdf,.doc,.docx,.txt"
          />
        </Box>
      </Paper>
      
      <AnimatePresence>
        {fileQueue.length > 0 && (
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            sx={{ mt: 2, p: 2 }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload Queue ({fileQueue.filter(f => f.status === 'success').length}/{fileQueue.length} completed)
            </Typography>
            
            {fileQueue.map((fileStatus) => (
              <Box
                key={fileStatus.id}
                component={motion.div}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  border: '1px solid',
                  borderColor: fileStatus.status === 'error' 
                    ? 'error.light'
                    : fileStatus.status === 'success'
                      ? 'success.light'
                      : 'divider'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                    {fileStatus.file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(fileStatus.file.size / 1024)}KB
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    {fileStatus.status === 'uploading' && (
                      <CircularProgress
                        variant="determinate"
                        value={fileStatus.progress}
                        size={24}
                        thickness={6}
                        sx={{ mr: 1 }}
                      />
                    )}
                    {fileStatus.status === 'error' && (
                      <Typography variant="caption" color="error">
                        {fileStatus.result?.error}
                      </Typography>
                    )}
                    {fileStatus.status === 'success' && (
                      <Typography variant="caption" color="success.main">
                        Upload complete
                      </Typography>
                    )}
                  </Box>
                  
                  {fileStatus.status === 'error' && (
                    <Tooltip title="Retry Upload">
                      <IconButton
                        size="small"
                        onClick={() => retryUpload(fileStatus.id)}
                      >
                        <RetryIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            ))}
          </Paper>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default FileUpload;