export interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  actionDone?: string;
  savedTime?: string;
  timestamp: string;
}

export interface UserRequest {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  statusText: string;
  date: string;
  assignedTo: string;
  estimatedTime?: string;
  cost?: string;
  receiptDownloaded?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  plan: string;
  conciergeName: string;
  activeRequestsCount: number;
  totalTimeSavedHours: number;
  verified: boolean;
}
