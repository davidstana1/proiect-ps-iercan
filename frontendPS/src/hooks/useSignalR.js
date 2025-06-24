import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export function useSignalR() {
  const [data, setData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5195/hub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Conectat la SignalR");
      setConnectionStatus("Connected");
      
      connection.on("ReceiveUpdate", (update) => {
        console.log("Actualizare primită:", update);
        setData(update);
      });
    }).catch(err => {
      console.error("Eroare conexiune SignalR:", err);
      setConnectionStatus("Connection Failed");
    });

    connection.onclose(() => {
      setConnectionStatus("Disconnected");
    });

    connection.onreconnecting(() => {
      setConnectionStatus("Reconnecting...");
    });

    connection.onreconnected(() => {
      setConnectionStatus("Reconnected");
    });

    return () => {
      connection.stop();
    };
  }, []);

  return { data, connectionStatus };
}