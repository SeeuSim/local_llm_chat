export interface IAPIChatRoomCreateResponse {
  id: string;

  message?: string;
  rooms?: Array<{ id: string; summary?: string }>;
  error?: unknown;
}
