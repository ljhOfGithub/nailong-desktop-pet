const DEFAULT_SETTINGS = Object.freeze({
  character: 'nailong',
  alwaysOnTop: true,
  launchAtLogin: false,
  soundEnabled: true
});

function sanitizeSettings(value = {}) {
  const character = value.character === 'naiwa' ? 'naiwa' : 'nailong';

  return {
    character,
    alwaysOnTop: value.alwaysOnTop !== false,
    launchAtLogin: value.launchAtLogin === true,
    soundEnabled: value.soundEnabled !== false
  };
}

module.exports = { DEFAULT_SETTINGS, sanitizeSettings };
