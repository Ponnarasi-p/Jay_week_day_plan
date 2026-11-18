/**
 * Real-time (Socket.IO) contract between the API and the web app.
 * Rooms: "global" for everyone, `week:<YYYY-MM-DD Monday>` for people viewing that week's plans.
 */
import type { IsoDate } from './domain';

export const GLOBAL_ROOM = 'global';
export const weekRoom = (weekStart: IsoDate) => `week:${weekStart}`;

export interface PresenceUser {
  id: string;
  name: string;
}

export interface ServerToClientEvents {
  'weekplan.run.started': (p: { runId: number; weekStart: IsoDate; trigger: string }) => void;
  'weekplan.run.finished': (p: { runId: number; weekStart: IsoDate; lines: number; issues: number }) => void;
  'weekplan.run.failed': (p: { weekStart: IsoDate; error: string }) => void;
  'upload.finished': (p: { kind: string; imported: number; errorCount: number }) => void;
  'masters.updated': (p: { entity: 'workCenter' | 'machine' | 'item'; id?: number }) => void;
  'dayplan.updated': (p: { runId: number; weekStart: IsoDate; version: number }) => void;
  'actual.recorded': (p: {
    weekStart: IsoDate;
    shift: number;
    workCenter: string;
    machineNo: string;
    item: string;
    by: string;
  }) => void;
  presence: (p: { room: string; users: PresenceUser[] }) => void;
}

export interface ClientToServerEvents {
  'week.join': (weekStart: IsoDate) => void;
  'week.leave': (weekStart: IsoDate) => void;
}
