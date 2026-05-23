import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

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

export interface CampaignEvent {
  id: string;
  event: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
  channel: string;
  impact: number;
}

export interface Alert {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success' | 'error';
}

interface UseRealtimeDataOptions {
  subscribeToMetrics?: boolean;
  subscribeToAgents?: boolean;
  subscribeToCampaigns?: boolean;
  subscribeToGitHub?: boolean;
}

export function useRealtimeData(options: UseRealtimeDataOptions = {}) {
  const {
    subscribeToMetrics = true,
    subscribeToAgents = true,
    subscribeToCampaigns = true,
    subscribeToGitHub = false,
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [agents, setAgents] = useState<Map<string, AgentStatus>>(new Map());
  const [campaigns, setCampaigns] = useState<CampaignEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Get the correct WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    const newSocket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('[WebSocket] Connected');
      setIsConnected(true);
      setConnectionError(null);

      // Subscribe to channels
      if (subscribeToMetrics) newSocket.emit('subscribe:metrics');
      if (subscribeToAgents) newSocket.emit('subscribe:agents');
      if (subscribeToCampaigns) newSocket.emit('subscribe:campaigns');
      if (subscribeToGitHub) newSocket.emit('subscribe:github');
    });

    newSocket.on('disconnect', () => {
      console.log('[WebSocket] Disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      setConnectionError(error.message);
    });

    // Metrics updates
    newSocket.on('metrics:update', (data) => {
      setMetrics(data.data);
    });

    // Agent status updates
    newSocket.on('agent:status', (data) => {
      setAgents((prev) => {
        const updated = new Map(prev);
        updated.set(data.data.id, data.data);
        return updated;
      });
    });

    // Campaign events
    newSocket.on('campaign:event', (data) => {
      setCampaigns((prev) => {
        const updated = [data.data, ...prev];
        return updated.slice(0, 100); // Keep last 100 events
      });
    });

    // Alerts
    newSocket.on('alert', (data) => {
      setAlerts((prev) => {
        const updated = [data.data, ...prev];
        return updated.slice(0, 50); // Keep last 50 alerts
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [subscribeToMetrics, subscribeToAgents, subscribeToCampaigns, subscribeToGitHub]);

  const subscribe = useCallback(
    (channel: 'metrics' | 'agents' | 'campaigns' | 'github') => {
      if (socket?.connected) {
        socket.emit(`subscribe:${channel}`);
      }
    },
    [socket]
  );

  const unsubscribe = useCallback(
    (channel: 'metrics' | 'agents' | 'campaigns' | 'github') => {
      if (socket?.connected) {
        socket.emit(`unsubscribe:${channel}`);
      }
    },
    [socket]
  );

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const clearCampaignEvents = useCallback(() => {
    setCampaigns([]);
  }, []);

  return {
    socket,
    metrics,
    agents: Array.from(agents.values()),
    campaigns,
    alerts,
    isConnected,
    connectionError,
    subscribe,
    unsubscribe,
    clearAlerts,
    clearCampaignEvents,
  };
}
