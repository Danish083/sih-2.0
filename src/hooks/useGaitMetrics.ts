import { useState, useEffect, useRef } from 'react';
import { GaitDataEntry } from '@/types';
import { API_BASE, WS_URL } from '@/lib/apiConfig';

interface GaitMetricsState {
  data: GaitDataEntry[] | null;
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
}

export const useGaitMetrics = (): GaitMetricsState => {
  const [state, setState] = useState<GaitMetricsState>({
    data: null,
    loading: true,
    error: null,
    isConnected: false,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const historicalData = useRef<GaitDataEntry[]>([]);

  useEffect(() => {
    // Initialize WebSocket connection
    const connectWebSocket = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to backend WebSocket');
        setState(prev => ({ ...prev, isConnected: true, loading: false }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'connection') {
            console.log(data.message);
            return;
          }

          // Map backend data to frontend type
          const gaitEntry: GaitDataEntry = {
            cadence: data.cadence || 0,
            equilibriumScore: data.equilibrium || 0,
            frequency: data.frequency || 0,
            gaitCyclePhaseMean: 0, // Not available in backend, default to 0
            posturalSway: data.posturalSway || 0,
            sensors: [], // Not available in backend
            stepWidth: 0, // Not available in backend, default to 0
            steps: data.stepCount || 0,
            strideLength: data.strideLength || 0,
            timestamp: new Date(data.timestamp).getTime(),
            walkingSpeed: data.walkingSpeed || 0,
          };

          // Add to historical data (keep last 20)
          historicalData.current.unshift(gaitEntry);
          if (historicalData.current.length > 20) {
            historicalData.current.pop();
          }

          setState(prev => ({ ...prev, data: historicalData.current, loading: false }));
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from backend WebSocket');
        setState(prev => ({ ...prev, isConnected: false }));
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ ...prev, error: new Error('WebSocket connection failed') }));
      };
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Fetch initial historical data from API
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/data/historical`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Map backend historical data to frontend type
            const mappedData: GaitDataEntry[] = result.data.map((item: Record<string, any>) => ({
              cadence: item.cadence || 0,
              equilibriumScore: item.equilibrium || 0,
              frequency: item.frequency || 0,
              gaitCyclePhaseMean: 0,
              posturalSway: item.posturalSway || 0,
              sensors: [],
              stepWidth: 0,
              steps: item.stepCount || 0,
              strideLength: item.strideLength || 0,
              timestamp: new Date(item.timestamp).getTime(),
              walkingSpeed: item.walkingSpeed || 0,
            })).reverse(); // Reverse to have latest first

            historicalData.current = mappedData.slice(-20); // Keep last 20
            setState(prev => ({ ...prev, data: historicalData.current, loading: false }));
          }
        }
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setState(prev => ({ ...prev, error: error as Error, loading: false }));
      }
    };

    fetchHistoricalData();
  }, []);

  return state;
};
