import React from 'react';

const ConveyorDiagram = ({ data }) => {
  const isActive = (band) => data?.[band] || false;
  const sensorActive = (sensor) => data?.[sensor] || false;
  const isAlarmActive = data?.alarm || false;
  
  // Determine flap position
  const flapPosition = data?.clapeta || "S7 - Mijloc";
  const getFlap = () => {
    if (flapPosition.includes("S6")) return "left";
    if (flapPosition.includes("S8")) return "right";
    return "center";
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
      {/* Main Conveyor System Diagram */}
      <div style={{ flex: 2 }}>
        <svg width="600" height="500" viewBox="0 0 600 500" style={{ border: '2px solid #333', backgroundColor: 'white' }}>
          {/* Title */}
          <text x="50" y="30" fontSize="18" fontWeight="bold" fill="#333">Masca procesului</text>
          
          {/* Hopper at top */}
          <polygon points="250,50 280,50 290,80 240,80" fill="#ddd" stroke="#333" strokeWidth="2"/>
          <polygon points="245,80 285,80 275,100 255,100" fill="#ddd" stroke="#333" strokeWidth="2"/>
          
          {/* Band 1 (Conveyor 1) */}
          <rect x="100" y="120" width="150" height="25" rx="12" fill={isActive('P1') ? '#4CAF50' : '#ccc'} stroke="#333" strokeWidth="2"/>
          <circle cx="110" cy="132" r="8" fill="#666"/>
          <circle cx="240" cy="132" r="8" fill="#666"/>
          <text x="120" y="110" fontSize="12" fill="#333">Band 1</text>
          <text x="115" y="100" fontSize="12" fill="#333">Conveyor 1</text>
          
          {/* Motor M1 */}
          <circle cx="80" cy="160" r="15" fill={isActive('P1') ? '#FF9800' : '#ccc'} stroke="#333" strokeWidth="2"/>
          <text x="75" y="165" fontSize="10" fill="white" fontWeight="bold">M</text>
          <text x="60" y="180" fontSize="10" fill="#333">M1</text>

          {/* Band 2 (Conveyor 2) */}
          <rect x="350" y="120" width="150" height="25" rx="12" fill={isActive('P2') ? '#4CAF50' : '#ccc'} stroke="#333" strokeWidth="2"/>
          <circle cx="360" cy="132" r="8" fill="#666"/>
          <circle cx="490" cy="132" r="8" fill="#666"/>
          <text x="370" y="110" fontSize="12" fill="#333">Band 2</text>
          <text x="365" y="100" fontSize="12" fill="#333">Conveyor 2</text>
          
          {/* Motor M2 */}
          <circle cx="520" cy="160" r="15" fill={isActive('P2') ? '#FF9800' : '#ccc'} stroke="#333" strokeWidth="2"/>
          <text x="515" y="165" fontSize="10" fill="white" fontWeight="bold">M</text>
          <text x="525" y="180" fontSize="10" fill="#333">M2</text>

          {/* Central sorting mechanism with flap */}
          <g transform="translate(300,200)">
            {/* Flap mechanism */}
            <g>
              {/* S7 center position indicator */}
              <line x1="-20" y1="0" x2="20" y2="0" stroke="#333" strokeWidth="2"/>
              <text x="-10" y="-10" fontSize="10" fill="#333">S7</text>
              
              {/* Flap */}
              <g transform={
                getFlap() === "left" ? "rotate(-30)" : 
                getFlap() === "right" ? "rotate(30)" : "rotate(0)"
              }>
                <rect x="-25" y="-3" width="50" height="6" fill={isAlarmActive ? '#f44336' : '#2196F3'} stroke="#333" strokeWidth="1"/>
              </g>
              
              {/* S6 and S8 position indicators */}
              <text x="-35" y="15" fontSize="10" fill="#333">S6</text>
              <text x="25" y="15" fontSize="10" fill="#333">S8</text>
            </g>
            
            {/* Sorting paths */}
            <path d="M-30,-20 L-80,50" stroke="#333" strokeWidth="2" fill="none"/>
            <path d="M30,-20 L80,50" stroke="#333" strokeWidth="2" fill="none"/>
          </g>

          {/* Band 3 (Conveyor 3) */}
          <rect x="100" y="300" width="150" height="25" rx="12" fill={isActive('P3') ? '#4CAF50' : '#ccc'} stroke="#333" strokeWidth="2"/>
          <circle cx="110" cy="312" r="8" fill="#666"/>
          <circle cx="240" cy="312" r="8" fill="#666"/>
          <text x="120" y="290" fontSize="12" fill="#333">Band 3</text>
          <text x="115" y="280" fontSize="12" fill="#333">Conveyor 3</text>
          
          {/* Motor M3 */}
          <circle cx="80" cy="340" r="15" fill={isActive('P3') ? '#FF9800' : '#ccc'} stroke="#333" strokeWidth="2"/>
          <text x="75" y="345" fontSize="10" fill="white" fontWeight="bold">M</text>
          <text x="60" y="360" fontSize="10" fill="#333">M3</text>

          {/* Band 4 (Conveyor 4) */}
          <rect x="350" y="380" width="150" height="25" rx="12" fill={isActive('P4') ? '#4CAF50' : '#ccc'} stroke="#333" strokeWidth="2"/>
          <circle cx="360" cy="392" r="8" fill="#666"/>
          <circle cx="490" cy="392" r="8" fill="#666"/>
          <text x="370" y="370" fontSize="12" fill="#333">Band 4</text>
          <text x="365" y="360" fontSize="12" fill="#333">Conveyor 4</text>
          
          {/* Motor M4 */}
          <circle cx="520" cy="420" r="15" fill={isActive('P4') ? '#FF9800' : '#ccc'} stroke="#333" strokeWidth="2"/>
          <text x="515" y="425" fontSize="10" fill="white" fontWeight="bold">M</text>
          <text x="525" y="440" fontSize="10" fill="#333">M4</text>

          {/* Sensors */}
          <g>
            {/* Sensor 1 */}
            <rect x="50" y="200" width="15" height="20" fill={sensorActive('sensor1') ? '#ff4444' : '#ddd'} stroke="#333" strokeWidth="1"/>
            <text x="25" y="215" fontSize="10" fill="#333">Senzor 1</text>
            
            {/* Sensor 2 */}
            <rect x="535" y="200" width="15" height="20" fill={sensorActive('sensor2') ? '#ff4444' : '#ddd'} stroke="#333" strokeWidth="1"/>
            <text x="510" y="235" fontSize="10" fill="#333">Senzor 2</text>
          </g>

          {/* Flow arrows */}
          {isActive('P1') && (
            <>
              <defs>
                <marker id="arrowhead1" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#4CAF50"/>
                </marker>
              </defs>
              <line x1="120" y1="125" x2="140" y2="125" stroke="#4CAF50" strokeWidth="3" markerEnd="url(#arrowhead1)">
                <animate attributeName="x1" values="120;140;120" dur="1s" repeatCount="indefinite"/>
                <animate attributeName="x2" values="140;160;140" dur="1s" repeatCount="indefinite"/>
              </line>
            </>
          )}

          {isActive('P2') && (
            <>
              <defs>
                <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#4CAF50"/>
                </marker>
              </defs>
              <line x1="370" y1="125" x2="390" y2="125" stroke="#4CAF50" strokeWidth="3" markerEnd="url(#arrowhead2)">
                <animate attributeName="x1" values="370;390;370" dur="1s" repeatCount="indefinite"/>
                <animate attributeName="x2" values="390;410;390" dur="1s" repeatCount="indefinite"/>
              </line>
            </>
          )}

          {/* Alarm indicator */}
          {isAlarmActive && (
            <g>
              <circle cx="300" cy="450" r="20" fill="#ff4444" stroke="#cc0000" strokeWidth="3">
                <animate attributeName="fill" values="#ff4444;#cc0000;#ff4444" dur="0.5s" repeatCount="indefinite"/>
              </circle>
              <text x="285" y="455" fontSize="12" fill="white" fontWeight="bold">⚠</text>
              <text x="270" y="475" fontSize="12" fill="#cc0000" fontWeight="bold">ALARMĂ</text>
            </g>
          )}
        </svg>
      </div>

      {/* Control Panel */}
      <div style={{ flex: 1, minWidth: '250px' }}>
        <div style={{ 
          border: '2px solid #333', 
          borderRadius: '10px', 
          padding: '20px', 
          backgroundColor: '#2c3e50',
          color: 'white',
          minHeight: '500px'
        }}>
          {/* Main switches */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                backgroundColor: isAlarmActive ? '#ff4444' : '#444',
                marginRight: '10px',
                border: '2px solid #666'
              }}></div>
              <span style={{ fontSize: '12px' }}>S0 AUS</span>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                backgroundColor: isAlarmActive ? '#ff4444' : '#444',
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #666'
              }}>
                <div style={{ fontSize: '10px' }}>Off</div>
              </div>
            </div>
          </div>

          {/* Band controls */}
          {['P1', 'P2', 'P3', 'P4'].map((band, index) => (
            <div key={band} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ 
                width: '15px', 
                height: '15px', 
                borderRadius: '50%', 
                backgroundColor: '#444',
                marginRight: '8px',
                border: '1px solid #666'
              }}></div>
              <span style={{ fontSize: '10px', marginRight: '8px' }}>H{index + 1}</span>
              <div style={{ 
                width: '15px', 
                height: '15px', 
                borderRadius: '50%', 
                backgroundColor: '#444',
                marginRight: '8px',
                border: '1px solid #666'
              }}></div>
              <span style={{ fontSize: '10px', marginRight: '8px' }}>S{index + 1}</span>
              <div style={{ 
                width: '25px', 
                height: '25px', 
                borderRadius: '50%', 
                backgroundColor: isActive(band) ? '#4CAF50' : '#444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #666'
              }}>
                <div style={{ fontSize: '8px' }}>
                  {isActive(band) ? 'ON' : 'OFF'}
                </div>
              </div>
              <span style={{ fontSize: '9px', marginLeft: '8px' }}>
                Band {index + 1} ein<br/>Conveyor {index + 1} on
              </span>
            </div>
          ))}

          {/* Band 4-2 control */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '25px', 
              height: '25px', 
              borderRadius: '50%', 
              backgroundColor: (isActive('P3') || isActive('P4')) ? '#4CAF50' : '#444',
              marginRight: '10px',
              border: '2px solid #666'
            }}></div>
            <span style={{ fontSize: '9px' }}>
              S5 Band 4-2 aus<br/>Conveyor<br/>1-2 off
            </span>
          </div>

          {/* Flap controls */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '10px', marginBottom: '10px' }}>Weichenstellung</div>
            <div style={{ fontSize: '10px', marginBottom: '5px' }}>Switch setting</div>
            <div style={{ fontSize: '10px', marginBottom: '10px' }}>mechanism</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {['S6', 'S7', 'S8'].map((pos, index) => (
                <div key={pos} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: flapPosition.includes(pos) ? '#2196F3' : '#444',
                    margin: '0 auto 5px',
                    border: '2px solid #666'
                  }}></div>
                  <div style={{ fontSize: '8px' }}>{pos}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status indicators */}
          <div style={{ marginTop: '30px', fontSize: '10px' }}>
            <div style={{ marginBottom: '5px' }}>
              Senzor 1: <span style={{ color: sensorActive('sensor1') ? '#ff4444' : '#888' }}>
                {sensorActive('sensor1') ? '●' : '○'}
              </span>
            </div>
            <div style={{ marginBottom: '5px' }}>
              Senzor 2: <span style={{ color: sensorActive('sensor2') ? '#ff4444' : '#888' }}>
                {sensorActive('sensor2') ? '●' : '○'}
              </span>
            </div>
            {isAlarmActive && (
              <div style={{ 
                marginTop: '10px', 
                padding: '5px', 
                backgroundColor: '#ff4444', 
                borderRadius: '3px',
                textAlign: 'center',
                animation: 'blink 1s infinite'
              }}>
                🚨 SISTEM OPRIT!
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default ConveyorDiagram;