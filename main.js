const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let overlayWindow;


function createMainWindow() {
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

function createOverlayWindow() {
    overlayWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    overlayWindow.loadFile('overlay.html');

    overlayWindow.on('closed', function () {
        overlayWindow = null;
    });
}


app.on('ready', () => {
    const serverPath = path.join(__dirname, 'server.js');
    const server = spawn('node', ['server.js']);

    server.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    server.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    createMainWindow();
    createOverlayWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createMainWindow();
    }
});