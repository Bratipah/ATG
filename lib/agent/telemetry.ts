import fs from 'fs/promises';
import path from 'path';

// Use a writable location for serverless (e.g. /tmp on Vercel) and fall back to in-memory.
const ACTIVITY_FILE = path.join('/tmp', 'activity.json');
let memoryLogs: ActivityLog[] = [];

export interface ActivityLog {
  timestamp: number;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'ACTION' | 'PROPOSAL' | 'NARRATIVE';
  message: string;
  details?: Record<string, any>;
}

export async function logActivity(
  type: ActivityLog['type'],
  message: string,
  details?: Record<string, any>
) {
  const entry: ActivityLog = {
    timestamp: Date.now(),
    type,
    message,
    details,
  };

  console.log(`[ATG AGENT] [${type}] ${message}`, details ? JSON.stringify(details) : '');

  try {
    // Ensure directory exists
    const dir = path.dirname(ACTIVITY_FILE);
    await fs.mkdir(dir, { recursive: true });

    let logs: ActivityLog[] = [];
    try {
      const content = await fs.readFile(ACTIVITY_FILE, 'utf-8');
      logs = JSON.parse(content);
    } catch (e) {
      // File likely doesn't exist or is empty
    }

    // Append new log (keep last 100 entries)
    logs.unshift(entry);
    if (logs.length > 100) logs = logs.slice(0, 100);

    await fs.writeFile(ACTIVITY_FILE, JSON.stringify(logs, null, 2));
    memoryLogs = logs;
  } catch (error) {
    console.error('Failed to persist activity log:', error);
    // Keep in memory so API/status still returns something in readonly FS environments.
    memoryLogs.unshift(entry);
    if (memoryLogs.length > 100) memoryLogs = memoryLogs.slice(0, 100);
  }

  return entry;
}

export async function getRecentActivity(limit: number = 50): Promise<ActivityLog[]> {
  try {
    const content = await fs.readFile(ACTIVITY_FILE, 'utf-8');
    const logs: ActivityLog[] = JSON.parse(content);
    return logs.slice(0, limit);
  } catch (e) {
    return memoryLogs.slice(0, limit);
  }
}
