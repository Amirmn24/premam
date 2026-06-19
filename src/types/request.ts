export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type BodyType = "json" | "raw";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestTab {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
  bodyType: BodyType;
}

export interface UrlValidationResult {
  valid: boolean;
  error?: string;
}

export type RequestSectionTab = "params" | "headers" | "body";
