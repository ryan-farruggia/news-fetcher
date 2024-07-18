const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL('http://localhost:5500'); // Load the server URL
}

app.whenReady().then(() => {
  // Start the server
  serverProcess = exec('node server.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Server error: ${error}`);
      return;
    }
    console.log(`Server stdout: ${stdout}`);
    console.error(`Server stderr: ${stderr}`);
  });

  // Wait for the server to start before creating the window
  setTimeout(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  }, 5000); // Adjust this timeout as needed
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
