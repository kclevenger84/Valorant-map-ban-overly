const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('controller.html'); // Load the controller initially

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    const server = spawn('node', ['server.js']);

    server.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    server.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});