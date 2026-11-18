import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  GLOBAL_ROOM,
  IsoDateSchema,
  weekRoom,
  type ClientToServerEvents,
  type PresenceUser,
  type ServerToClientEvents,
} from '@autoplan/shared';
import type { Server, Socket } from 'socket.io';

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/**
 * Socket.IO gateway. Services call `emitGlobal` / `emitWeek` after they change data, and every
 * browser in the room updates. Login (JWT in the handshake) and the Redis adapter for several
 * API instances are added in phase 5.
 */
@WebSocketGateway({ cors: { origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173', credentials: true } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: AppServer;
  private readonly log = new Logger(RealtimeGateway.name);

  handleConnection(socket: AppSocket) {
    socket.data.user = this.userOf(socket);
    void socket.join(GLOBAL_ROOM);
    this.log.debug(`connected ${socket.id}`);
  }

  async handleDisconnect(socket: AppSocket) {
    // Socket.IO has already removed the socket from its rooms; refresh presence of week rooms.
    for (const room of this.server.sockets.adapter.rooms.keys()) {
      if (room.startsWith('week:')) await this.broadcastPresence(room);
    }
    this.log.debug(`disconnected ${socket.id}`);
  }

  @SubscribeMessage('week.join')
  async joinWeek(@ConnectedSocket() socket: AppSocket, @MessageBody() weekStart: string) {
    if (!IsoDateSchema.safeParse(weekStart).success) return;
    const room = weekRoom(weekStart);
    await socket.join(room);
    await this.broadcastPresence(room);
  }

  @SubscribeMessage('week.leave')
  async leaveWeek(@ConnectedSocket() socket: AppSocket, @MessageBody() weekStart: string) {
    if (!IsoDateSchema.safeParse(weekStart).success) return;
    const room = weekRoom(weekStart);
    await socket.leave(room);
    await this.broadcastPresence(room);
  }

  emitGlobal<E extends keyof ServerToClientEvents>(event: E, ...args: Parameters<ServerToClientEvents[E]>) {
    this.server.to(GLOBAL_ROOM).emit(event, ...args);
  }

  emitWeek<E extends keyof ServerToClientEvents>(
    weekStart: string,
    event: E,
    ...args: Parameters<ServerToClientEvents[E]>
  ) {
    this.server.to(weekRoom(weekStart)).emit(event, ...args);
  }

  private async broadcastPresence(room: string) {
    const sockets = await this.server.in(room).fetchSockets();
    const seen = new Map<string, PresenceUser>();
    for (const s of sockets) {
      const u = s.data.user as PresenceUser | undefined;
      if (u) seen.set(u.id, u);
    }
    this.server.to(room).emit('presence', { room, users: [...seen.values()] });
  }

  /** Until login exists, the browser sends a display name in the handshake. */
  private userOf(socket: AppSocket): PresenceUser {
    const name = String(socket.handshake.auth?.name ?? '').slice(0, 60) || 'Guest';
    return { id: socket.id, name };
  }
}
