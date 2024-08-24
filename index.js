const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray = null;
let win = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    win.loadURL('https://www.duolingo.com');
    win.removeMenu();

    win.on('minimize', function (event) {
        event.preventDefault();
        win.hide();
    });

    win.on('close', function (event) {
        if (!app.isQuiting) {
            event.preventDefault();
            win.hide();
        }

        return false;
    });

    // Criação do Tray com o ícone SVG
    tray = new Tray(path.join(__dirname, 'icons8-logotipo-duolingo-64.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Abrir Duolingo', click: function () {
                win.show();
            }
        },
        {
            label: 'Sair', click: function () {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    tray.setToolTip('Duolingo WebView');
    tray.setContextMenu(contextMenu);

    tray.on('click', function () {
        win.show();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
