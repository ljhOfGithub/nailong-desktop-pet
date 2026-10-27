const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { sanitizeSettings } = require('./lib/settings');
const { clampWindowPosition, getDefaultPosition } = require('./lib/position');
const { WINDOW_SIZE } = require('./lib/window-size');

let mainWindow;
let settings;

function settingsPath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

function loadSettings() {
  try {
    return sanitizeSettings(JSON.parse(fs.readFileSync(settingsPath(), 'utf8')));
  } catch {
    return sanitizeSettings();
  }
}

function saveSettings() {
  fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
  fs.writeFileSync(settingsPath(), `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
}

function applyAlwaysOnTop(value) {
  settings.alwaysOnTop = value;
  mainWindow.setAlwaysOnTop(value, value ? 'floating' : 'normal');
  saveSettings();
}

function applyLaunchAtLogin(value) {
  settings.launchAtLogin = value;
  app.setLoginItemSettings({ openAtLogin: value });
  saveSettings();
}

function changeCharacter(character) {
  settings.character = character;
  saveSettings();
  mainWindow.webContents.send('character:change', character);
}

function resetPosition() {
  const display = screen.getPrimaryDisplay();
  const position = getDefaultPosition(display.workArea, WINDOW_SIZE);
  mainWindow.setPosition(position.x, position.y, true);
}

function createWindow() {
  const position = getDefaultPosition(screen.getPrimaryDisplay().workArea, WINDOW_SIZE);

  mainWindow = new BrowserWindow({
    ...WINDOW_SIZE,
    ...position,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: settings.alwaysOnTop,
    skipTaskbar: true,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.setAlwaysOnTop(settings.alwaysOnTop, settings.alwaysOnTop ? 'floating' : 'normal');
  if (process.platform === 'darwin') mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.once('ready-to-show', () => mainWindow.showInactive());
}

function showContextMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: '切换形态',
      submenu: [
        { label: '奶龙', type: 'radio', checked: settings.character === 'nailong', click: () => changeCharacter('nailong') },
        { label: '奶娃（奶蛙）', type: 'radio', checked: settings.character === 'naiwa', click: () => changeCharacter('naiwa') }
      ]
    },
    { type: 'separator' },
    { label: '保持置顶', type: 'checkbox', checked: settings.alwaysOnTop, click: (item) => applyAlwaysOnTop(item.checked) },
    { label: '开机启动', type: 'checkbox', checked: settings.launchAtLogin, click: (item) => applyLaunchAtLogin(item.checked) },
    {
      label: '互动音效',
      type: 'checkbox',
      checked: settings.soundEnabled,
      click: (item) => {
        settings.soundEnabled = item.checked;
        saveSettings();
        mainWindow.webContents.send('sound:change', item.checked);
      }
    },
    { label: '回到右下角', click: resetPosition },
    { type: 'separator' },
    { label: '退出桌宠', click: () => app.quit() }
  ]);

  menu.popup({ window: mainWindow });
}

function registerIpc() {
  ipcMain.handle('desktop:get-state', () => ({ ...settings }));
  ipcMain.on('desktop:show-menu', showContextMenu);
  ipcMain.on('desktop:move', (_event, requested) => {
    if (!requested || !Number.isFinite(requested.x) || !Number.isFinite(requested.y)) return;
    const display = screen.getDisplayNearestPoint({ x: Math.round(requested.x), y: Math.round(requested.y) });
    const position = clampWindowPosition(requested, display.workArea, WINDOW_SIZE);
    mainWindow.setPosition(position.x, position.y);
  });
}

app.whenReady().then(() => {
  settings = loadSettings();
  registerIpc();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
