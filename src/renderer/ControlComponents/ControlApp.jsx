import React, { useState, useEffect } from 'react';
import Values from './Values';
import ManualMode from './ManualMode';
import NetfollowingMode from './NetFollowingMode';
import DynamicPositioningMode from './DynamicPositioningMode';
import './css/ControlApp.css';

const { remote } = window.require('electron');

// The ControlApp is the main component for the controls-window
function ControlApp() {
  // Set the states to the global variables
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));
  const [controlValues, controlUpdate] = useState(remote.getGlobal('toROV'));
  const [mode, setMode] = useState(remote.getGlobal('mode'));
  const [IMCActive, setIMCActive] = useState(
    remote.getGlobal('settings').messageProtocol === 'IMC',
  );
  const [toIMC, setToIMC] = useState(remote.getGlobal('toROVIMC'));
  const [fromIMC, setFromIMC] = useState(remote.getGlobal('fromROVIMC'));
  const [settings, setSettings] = useState(remote.getGlobal('settings'));

  // make windows listen to ipc-msgs
  useEffect(() => {
    window.ipcRenderer.on('data-sent', () => {
      controlUpdate(remote.getGlobal('toROV'));
      setMode(remote.getGlobal('mode'));
      setToIMC(remote.getGlobal('toROVIMC'));
    });
    window.ipcRenderer.on('data-received', () => {
      sensorUpdate(remote.getGlobal('fromROV'));
      setFromIMC(remote.getGlobal('fromROVIMC'));
    });
    window.ipcRenderer.on('settings-updated', () => {
      const currentSettings = remote.getGlobal('settings');
      setIMCActive(currentSettings.messageProtocol === 'IMC');
      setSettings({ ...currentSettings });
    });
  }, []);

  return (
    <div className="ControlApp">
      <div className="controlFlex">
        <div className="topWindow">
          <ManualMode
            title="Manual Mode"
            toROV={controlValues}
            modeData={mode}
          ></ManualMode>
          <NetfollowingMode
            title="Net Following"
            modeData={mode}
            step={0.05}
          ></NetfollowingMode>
          <DynamicPositioningMode
            title="Dynamic Positioning"
            modeData={mode}
            step={0.5}
          ></DynamicPositioningMode>
        </div>
        <div className="bottomWindow">
          <div className="bottomLeft">
            <Values
              title="sensor values"
              values={IMCActive ? fromIMC : sensorValues}
              changeEffect={false}
              IMCActive={IMCActive}
            />
          </div>
          <div className="bottomRight">
            <Values
              IMCActive={IMCActive}
              title="Sent to ROV"
              values={IMCActive ? toIMC : controlValues}
              changeEffect={true}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlApp;
