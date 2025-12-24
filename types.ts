
export enum SystemStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  OCR_LOCAL = 'OCR_LOCAL',
  AI_ANALYSIS = 'AI_ANALYSIS',
  RPA_ENTRY = 'RPA_ENTRY',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface DocumentData {
  administration: string;
  department: string;
  docType: string;
  securityLevel: 'عادي' | 'سري' | 'سري للغاية';
  subject: string;
  entryNumber: string;
  date: string;
  idsNames: string[];
}

export interface ProcessingLog {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  fileName?: string;
}

export interface FileEntry {
  id: string;
  name: string;
  path: string;
  status: 'pending' | 'processing' | 'done';
  data?: DocumentData;
}
