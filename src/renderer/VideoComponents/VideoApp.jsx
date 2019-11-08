// The App for the VideoWindow. This is where every video-component should go.

import React, { useState, useEffect } from 'react';
import BiasWidget from './BiasWidget';
import HeadingWidget from './HeadingWidget';
import DepthWidget from './DepthWidget';
import './css/VideoApp.css';
import VideoFeed from './VideoFeed';
import ModeWidget from './ModeWidget';
import MiniMapWidget from './MiniMapWidget';
import GamepadWrapper from './GamepadWrapper';
import KeyboardWrapper from './KeyboardWrapper';
import VideoMenu from './VideoMenu';
import AvailabilityWidget from './AvailabilityWidget';

const { remote } = window.require('electron');

function VideoApp() {
  const [settingsValues, settingsUpdate] = useState(remote.getGlobal('toROV'));
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));
  const [biasValues, biasUpdate] = useState(remote.getGlobal('bias'));
  const [transparent, toggleTransparent] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    window.ipcRenderer.on('data-received', () => {
      settingsUpdate(remote.getGlobal('toROV'));
      sensorUpdate(remote.getGlobal('fromROV'));
      biasUpdate(remote.getGlobal('bias'));
    });
  }, []);

  return (
    <div className={transparent ? 'transparentVideoApp' : 'VideoApp'}>
      <VideoMenu
        toggleTransparent={toggleTransparent}
        transparent={transparent}
        deviceId={deviceId}
        setDeviceId={setDeviceId}
      />
      <BiasWidget
        u={biasValues['surge']}
        v={biasValues['sway']}
        w={biasValues['heave']}
      />
      <HeadingWidget
        heading={sensorValues['yaw']}
        isLocked={settingsValues['autoheading']}
        lockedValue={settingsValues['yaw']}
      />
      <DepthWidget
        depth={sensorValues['down']}
        isLocked={settingsValues['autodepth']}
        lockedValue={parseFloat(settingsValues['heave']).toFixed(2)}
      />
      <AvailabilityWidget
        nfAvailable={remote.getGlobal('mode')['nfAvailable']}
        dpAvailable={remote.getGlobal('mode')['dpAvailable']}
      />
      <ModeWidget
        currentMode={remote.getGlobal('mode')['currentMode']}
        nfAvailable={remote.getGlobal('mode')['nfAvailable']}
      />
      <MiniMapWidget
        north={sensorValues['north']}
        east={sensorValues['east']}
        yaw={sensorValues['yaw']}
        boatHeading={
          remote.getGlobal('settings')['useManualHeading']
            ? remote.getGlobal('settings')['manualBoatHeading']
            : remote.getGlobal('boat')['heading']
        }
        maxDistance={5}
      />
      <GamepadWrapper className="GamepadWrapper" />
      <KeyboardWrapper className="KeyboardInput" />
      <VideoFeed deviceId={deviceId} hidden={transparent} />
    </div>
  );
}

export default VideoApp;
