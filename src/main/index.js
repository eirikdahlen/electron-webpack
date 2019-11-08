'use strict'

const setupEvents = require('../../installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  setTimeout(1000);
}
const electron = require('electron');
const { app, Menu } = electron;
const isDev = require('electron-is-dev');

const { menuTemplate } = require('./utils/menuTemplate');
const { createWindows, setWidthAndHeight } = require('./utils/windows');
const { setIPCListeners } = require('./utils/IPC');
const { closeSimulator } = require('./launch/closeSimulator');
const { initGlobals } = require('./utils/globals');

let controlWindow;
let videoWindow;

// Creates the global variables and sets their default values
initGlobals();

// Functions that are run when the app is ready
app.on('ready', () => {
  // Define the size of the windows, and create them
  setWidthAndHeight();
  [videoWindow, controlWindow] = createWindows();

  // Sets menu for controlVindow (from public/menuTemplate.js) and removes menu from videoWindow
  const controlMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(controlMenu);

  setIPCListeners();

  if (isDev) {
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    controlWindow.webContents.openDevTools();
    // videoWindow.webContents.openDevTools(); // Must be off for transparancy
  }

  // Close all windows when closing one of then
  controlWindow.on('closed', quitAll);
  videoWindow.on('closed', quitAll);
});

// Function for quitting the entire application also the simulator
function quitAll() {
  closeSimulator('FhRtVis.exe');
  // Dereferences the windows when the app is closed, to save resources.
  controlWindow = null;
  videoWindow = null;

  // Quits the app
  app.quit();
}

// Boilerplate code - probably just quits the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quitAll();
  }
});

// Boilerplate code - probably just opens windows when app is launched
app.on('activate', () => {
  if (controlWindow === null) {
    createWindows();
  }
});


if (module.hot) {
  module.hot.accept()
}
