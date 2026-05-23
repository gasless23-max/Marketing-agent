import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export interface RealtimeMetrics {
  campaignsLaunched: number;
  engagementScore: number;
  walletTargets: number;
  trendSignals: number;
  adImpressions: number;
  conversionRate: number;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing';
  lastUpdate: number;
  tasksCompleted: number;
  currentTask?: string;
}

export interface StreamEvent {
  type: 'metric_update' | 'agent_status' | 'campaign_event' | 'alert' | 'github_update';
  timestamp: number;
  data: any;
}

// Initialize Socket.IO server
export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.VITE_FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      // Allow unauthenticated connections for demo
      return next();
    }
    // TODO: Validate token here
    next();
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Join room for real-time updates
    socket.on('subscribe:metrics', () => {
      socket.join('metrics');
      console.log(`[WebSocket] Client ${socket.id} subscribed to metrics`);
    });

    socket.on('subscribe:agents', () => {
      socket.join('agents');
      console.log(`[WebSocket] Client ${socket.id} subscribed to agents`);
    });

    socket.on('subscribe:campaigns', () => {
      socket.join('campaigns');
      console.log(`[WebSocket] Client ${socket.id} subscribed to campaigns`);
    });

    socket.on('subscribe:github', () => {
      socket.join('github');
      console.log(`[WebSocket] Client ${socket.id} subscribed to github`);
    });

    // Unsubscribe handlers
    socket.on('unsubscribe:metrics', () => {
      socket.leave('metrics');
    });

    socket.on('unsubscribe:agents', () => {
      socket.leave('agents');
    });

    socket.on('unsubscribe:campaigns', () => {
      socket.leave('campaigns');
    });

    socket.on('unsubscribe:github', () => {
      socket.leave('github');
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });

    // Error handler
    socket.on('error', (error) => {
      console.error(`[WebSocket] Error for client ${socket.id}:`, error);
    });
  });

  return io;
}

// Broadcast functions
export function broadcastMetricsUpdate(io: SocketIOServer, metrics: RealtimeMetrics) {
  io.to('metrics').emit('metrics:update', {
    type: 'metric_update',
    timestamp: Date.now(),
    data: metrics,
  });
}

export function broadcastAgentStatus(io: SocketIOServer, agent: AgentStatus) {
  io.to('agents').emit('agent:status', {
    type: 'agent_status',
    timestamp: Date.now(),
    data: agent,
  });
}

export function broadcastCampaignEvent(io: SocketIOServer, event: any) {
  io.to('campaigns').emit('campaign:event', {
    type: 'campaign_event',
    timestamp: Date.now(),
    data: event,
  });
}

export function broadcastGitHubUpdate(io: SocketIOServer, update: any) {
  io.to('github').emit('github:update', {
    type: 'github_update',
    timestamp: Date.now(),
    data: update,
  });
}

export function broadcastAlert(io: SocketIOServer, alert: any) {
  io.emit('alert', {
    type: 'alert',
    timestamp: Date.now(),
    data: alert,
  });
}

// Get connected clients count
export function getConnectedClientsCount(io: SocketIOServer): number {
  return io.engine.clientsCount;
}

// Get room size
export function getRoomSize(io: SocketIOServer, room: string): number {
  return io.sockets.adapter.rooms.get(room)?.size || 0;
}
