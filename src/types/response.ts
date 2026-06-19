export interface HttpResponseData {
  status: number;
  statusText: string;
  body: string;
  headers: Record<string, string>;
  durationMs: number;
  sizeBytes: number;
}

export type RequestErrorType =
  | "validation"
  | "network"
  | "cors"
  | "timeout"
  | "abort"
  | "unknown";

export interface RequestError {
  type: RequestErrorType;
  message: string;
}

export interface TabResponseState {
  loading: boolean;
  response: HttpResponseData | null;
  error: RequestError | null;
}

export type StatusCategory = "success" | "redirect" | "client" | "server" | "unknown";
