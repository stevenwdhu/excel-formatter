const {app, BrowserWindow} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create a browser window.
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    // Then load the application's index.html.
    win.loadFile('index.html');

    // Open the developer tools
    // win.webContents.openDevTools();

    // When the window is closed, this event will be triggered.
    win.on('closed', () => {
        // Dereference the window object, if your application supports multiple windows,
        // usually multiple window objects are stored in an array,
        // at the same time, you should delete the corresponding elements.
        win = null;
    });
}

// Electron will after initialization and preparation
// call this function when creating a browser window.
// Some APIs can only be used after the ready event is triggered.
app.on('ready', createWindow);

// Exit when all windows are closed.
// app.on('window-all-closed', () => {
//     // On macOS, unless the user exits with Cmd + Q,
//     // otherwise, most applications and their menu bars will remain active.
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// })

app.on('activate', () => {
    // On macOS, when you click the dock icon and no other windows are open,
    // usually a new window is recreated in the application.
    if (win === null) {
        createWindow();
    }
});

// In this file, you can continue to write the remaining main process code of the application.
// It can also be split into several files and then imported with require.