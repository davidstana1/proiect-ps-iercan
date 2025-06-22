import React from "react";
import { useSignalR } from "./hooks/useSignalR";
import ConveyorDiagram from "./components/ConveyorDiagram";

function App() {
  const { data, connectionStatus } = useSignalR();

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🛠️ Sistem M23 - Status Live</h1>
      
      {/* Connection Status */}
      <div style={{ 
        padding: "1rem", 
        marginBottom: "1rem", 
        backgroundColor: connectionStatus === "Connected" ? "#d4edda" : "#f8d7da",
        border: `1px solid ${connectionStatus === "Connected" ? "#c3e6cb" : "#f5c6cb"}`,
        borderRadius: "4px"
      }}>
        <strong>Status Conexiune:</strong> {connectionStatus}
      </div>

      {!data ? (
        <p>Se așteaptă date de la simulator...</p>
      ) : (
        <>
          {/* Visual Diagram */}
          <ConveyorDiagram data={data} />
          
          {/* Detailed Status */}
          <div style={{ marginTop: '2rem' }}>
            <h2>📊 Date Detaliate:</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ padding: "0.5rem", margin: "0.25rem 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
              <strong>P1 (Banda 1):</strong> {data.P1 ? "✅ Activ" : "❌ Inactiv"}
            </li>
            <li style={{ padding: "0.5rem", margin: "0.25rem 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
              <strong>P2 (Banda 2):</strong> {data.P2 ? "✅ Activ" : "❌ Inactiv"}
            </li>
            <li style={{ padding: "0.5rem", margin: "0.25rem 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
              <strong>P3 (Banda 3):</strong> {data.P3 ? "✅ Activ" : "❌ Inactiv"}
            </li>
            <li style={{ padding: "0.5rem", margin: "0.25rem 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
              <strong>P4 (Banda 4):</strong> {data.P4 ? "✅ Activ" : "❌ Inactiv"}
            </li>
            <li style={{ padding: "0.5rem", margin: "0.25rem 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
              <strong>Clapetă:</strong> {data.clapeta}
            </li>
            <li style={{ padding: "0.5rem", margin: "0.25rem 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
              <strong>Senzor 1:</strong> {data.sensor1 ? "🟢 Activ" : "⚪ Inactiv"}
            </li>
            <li style={{ padding: "0.5rem", margin: "0.25rem 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
              <strong>Senzor 2:</strong> {data.sensor2 ? "🟢 Activ" : "⚪ Inactiv"}
            </li>
            <li style={{ 
              padding: "0.5rem", 
              margin: "0.25rem 0", 
              backgroundColor: data.alarm ? "#ffebee" : "#e8f5e8", 
              borderRadius: "4px",
              border: data.alarm ? "2px solid #f44336" : "1px solid #4caf50"
            }}>
              <strong>Alarmă:</strong> {data.alarm ? "🚨 ACTIVATĂ" : "🟩 Oprită"}
            </li>
          </ul>
          
          {/* Raw JSON for debugging */}
          <details style={{ marginTop: "2rem" }}>
            <summary>🔍 Date Raw (pentru debugging)</summary>
            <pre style={{ backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
          </div>
        </>
      )}
    </div>
  );
}

export default App;