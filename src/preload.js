const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopPet', {
  getState: () => ipcRenderer.invoke('desktop:get-state'),
  moveWindow: (position) => ipcRenderer.send('desktop:move', position),
  showContextMenu: () => ipcRenderer.send('desktop:show-menu'),
  onCharacterChange: (callback) => {
    const listener = (_event, character) => callback(character);
    ipcRenderer.on('character:change', listener);
    return () => ipcRenderer.removeListener('character:change', listener);
  },
  onSoundChange: (callback) => {
    const listener = (_event, enabled) => callback(enabled);
    ipcRenderer.on('sound:change', listener);
    return () => ipcRenderer.removeListener('sound:change', listener);
  }
});
