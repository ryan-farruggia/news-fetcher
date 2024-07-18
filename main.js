const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const net = require('net');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional
      nodeIntegration: true,
      contextIsolation: false, // Ensure context isolation is disabled if you want to access nodeIntegration
    },
  });

  mainWindow.loadURL('http://localhost:5500'); // Load the server URL

  // Hide the default menu bar
  mainWindow.setMenuBarVisibility(false);

  // Optionally, remove the menu completely
  // Menu.setApplicationMenu(null);

  // Open links in external browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Instruct the default browser to open the URL
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

function startServer() {
  serverProcess = exec('node server.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Server error: ${error}`);
      return;
    }
    console.log(`Server stdout: ${stdout}`);
    console.error(`Server stderr: ${stderr}`);
  });
}

function checkServerReady(callback) {
  const client = net.createConnection({ port: 5500 }, () => {
    client.end();
    callback(true);
  });

  client.on('error', () => {
    callback(false);
  });
}

function waitForServerToBeReady(callback) {
  const interval = setInterval(() => {
    checkServerReady((ready) => {
      if (ready) {
        clearInterval(interval);
        callback();
      }
    });
  }, 500); // Check every 500ms
}

app.whenReady().then(() => {
  startServer();

  waitForServerToBeReady(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
