export interface UploadResponse {
  filename: string;
  size: number;
  message: string;
  saved_path?: string;
  error?: string;
}

export interface APIError {
  detail: string;
}

export type ProgressCallback = (progress: number) => void;