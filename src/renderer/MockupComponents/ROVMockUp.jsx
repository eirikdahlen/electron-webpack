import React, { useState, useEffect } from 'react';
import modeEnum from '../constants/modeEnum';
import ModeAvailableToggles from './ModeAvailableToggles';
import FromROV from './FromROV';
import NFView from './NFView';

import './css/ROVMockUp.css';

const { ipcRenderer } = require('electron');

export default function ROVMockUp() {
  const [mode, setMode] = useState(modeEnum.MANUAL);
  const [recievedData, setRecievedData] = useState(null);
  const [isServerRunning, setIsServerRunning] = useState(false);

  // TODO: add this functionality in TCPServerMockUp
  function startServer() {
    if (!isServerRunning) {
      ipcRenderer.send('startROVMockupServer');
      setIsServerRunning(true);
    }
  }

  function modeToName(mode) {
    switch (mode) {
      case 0:
        return 'MANUAL';
      case 1:
        return 'DYNAMIC POSITIONING';
      case 2:
        return 'NET FOLLOWING';
      default:
        break;
    }
  }

  useEffect(() => {
    window.ipcRenderer.on('rov-mock-up-send-mode', (event, arg) => {
      setMode(arg);
      console.log(`Recieved data ${arg}`);
    });
    window.ipcRenderer.on('rov-mock-up-send-data', (event, arg) => {
      console.log(`Recieved data ${arg}`);
      setRecievedData(arg);
    });
  }, []);

  return (
    <div className="mockupBox" style={{ backgroundColor: 'white' }}>
      <div className="startServer" onClick={() => startServer()}>
        {!isServerRunning ? 'Start Server' : 'Server is running...'}
      </div>
      <div className="mode">Mode: {modeToName(mode)}</div>
      <FromROV />
      <ModeAvailableToggles />
      <NFView />
      <div>
        Revieced data:
        <div>
          <pre>{JSON.stringify(recievedData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
