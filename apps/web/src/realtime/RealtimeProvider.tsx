import type { ClientToServerEvents, PresenceUser, ServerToClientEvents } from '@autoplan/shared';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface RealtimeState {
  socket: AppSocket | null;
  connected: boolean;
}

const RealtimeContext = createContext<RealtimeState>({ socket: null, connected: false });

/** One Socket.IO connection for the whole app; it reconnects by itself after network drops. */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RealtimeState>({ socket: null, connected: false });

  useEffect(() => {
    // Until login exists (phase 2), a display name identifies the person for presence.
    const name = localStorageGet('autoplan.name') ?? 'Guest';
    const socket: AppSocket = io({ path: '/socket.io', auth: { name } });
    const update = () => setState({ socket, connected: socket.connected });
    socket.on('connect', update);
    socket.on('disconnect', update);
    update();
    return () => {
      socket.disconnect();
    };
  }, []);

  return <RealtimeContext.Provider value={state}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  return useContext(RealtimeContext);
}

/** Join the room of one production week and track who else is viewing it. */
export function useLiveWeek(weekStart: string | null) {
  const { socket, connected } = useRealtime();
  const [viewers, setViewers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!socket || !connected || !weekStart) return;
    const room = `week:${weekStart}`;
    const onPresence = (p: { room: string; users: PresenceUser[] }) => {
      if (p.room === room) setViewers(p.users);
    };
    socket.on('presence', onPresence);
    socket.emit('week.join', weekStart);
    return () => {
      socket.emit('week.leave', weekStart);
      socket.off('presence', onPresence);
    };
  }, [socket, connected, weekStart]);

  return { viewers };
}

function localStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
