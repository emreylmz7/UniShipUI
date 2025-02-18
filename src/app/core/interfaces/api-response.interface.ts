export interface ApiResponse<T> {
  isSuccessful: boolean;
  data?: T;
  error?: {
    message: string;
    details: string[];
  };
} 