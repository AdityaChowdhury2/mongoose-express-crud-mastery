export interface Error {
  code: number;
  message: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: Error | unknown;
}
