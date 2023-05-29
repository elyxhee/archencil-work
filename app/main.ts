import { app, BrowserWindow, screen, globalShortcut, ipcMain, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { enable } from '@electron/remote/main';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
    try {
        require('@electron/remote/main').initialize();
    } catch (e) {
        console.error(e);
    }

    // eslint-disable-next-line no-unused-vars
    const size = screen.getPrimaryDisplay().workAreaSize;

    //console.log(path.join(__dirname, "/favicon.png"));
    const icon = nativeImage.createFromPath(path.join(__dirname, '/favicon/favicon32x32.png'));

    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        resizable: true,
        backgroundColor: '#2e82d6',
        icon: icon,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serve,
            contextIsolation: false // false if you want to run e2e test with Spectron
        }
    });

    // Only works after BrowserWindow is created
    enable(win.webContents);

    if (serve) {
        const debug = require('electron-debug');
        debug();

        require('electron-reloader')(module);
        win.loadURL('http://localhost:4200');
    } else {
        // Path when running electron executable
        let pathIndex = './index.html';

        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            // Path when running electron in local folder
            pathIndex = '../dist/index.html';
        }

        const url = new URL(path.join('file:', __dirname, pathIndex));
        win.loadURL(url.href);
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    // Disable the PageUp and PageDown
    /*globalShortcut.register('PageUp', () => {
    win.webContents.send('keyboard-handler', {'key': 'PageUp'});
    return false;
  });
  globalShortcut.register('PageDown', () => {
    win.webContents.send('keyboard-handler', {'key': 'PageDown'});
    return false;
  });

  // Disable the arrow keys
  globalShortcut.register('Up', () => {
    win.webContents.send('keyboard-handler', {'key': 'Up'});
    return false;
  });
  globalShortcut.register('Down', () => {
    win.webContents.send('keyboard-handler', {'key': 'Down'});
    return false;
  });
  globalShortcut.register('Left', () => {
    win.webContents.send('keyboard-handler', {'key': 'Left'});
    return false;
  });
  globalShortcut.register('Right', () => {
    win.webContents.send('keyboard-handler', {'key': 'Right'});
    return false;
  });*/

    return win;
}

try {
    // Event handler for asynchronous incoming messages
    ipcMain.on('asynchronous-message', (event, arg) => {
        //console.log(arg);
        // Event emitter for sending asynchronous messages
        //event.sender.send('asynchronous-reply', 'async pong');
    });

    // Event handler for synchronous incoming messages
    ipcMain.on('synchronous-message', (event, arg) => {
        //console.log(arg);
        // Synchronous event emmision
        //event.returnValue = 'sync pong';
    });

    // Place the ipcMain.on snippet here
    ipcMain.on('get-user-data-path', (event) => {
        event.returnValue = app.getPath('userData');
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => setTimeout(createWindow, 400));

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
} catch (e) {
    // Catch Error
    console.log('error');
    throw e;
}
