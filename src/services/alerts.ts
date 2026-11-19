import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const HUB_URL = 'https://localhost:7272/hubs/alerts';

export type Alert = {
  type: 'WaterLevel';
  level: string | null;
  distanceCm: number | null;
  createdAt: string;
};

type AlertHandlers = {
  onAlert: (alert: Alert) => void;
  onCleared: () => void;
};

export function connectToAlerts({ onAlert, onCleared }: AlertHandlers) {
  const connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, { withCredentials: false })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();

  connection.on('NewAlert', onAlert);
  connection.on('AlertCleared', onCleared);

  connection.start().catch((error) => {
    console.warn('Não foi possível conectar aos alertas:', error);
  });

  return () => {
    connection.stop();
  };
}