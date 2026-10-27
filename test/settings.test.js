const test = require('node:test');
const assert = require('node:assert/strict');
const { DEFAULT_SETTINGS, sanitizeSettings } = require('../src/lib/settings');

test('空设置使用安全默认值', () => {
  assert.deepEqual(sanitizeSettings(), DEFAULT_SETTINGS);
});

test('只接受已知角色与严格布尔值', () => {
  assert.deepEqual(
    sanitizeSettings({
      character: 'unknown',
      alwaysOnTop: 0,
      launchAtLogin: 'yes',
      soundEnabled: false
    }),
    {
      character: 'nailong',
      alwaysOnTop: true,
      launchAtLogin: false,
      soundEnabled: false
    }
  );
});

test('奶娃形态可以持久化', () => {
  assert.equal(sanitizeSettings({ character: 'naiwa' }).character, 'naiwa');
});
