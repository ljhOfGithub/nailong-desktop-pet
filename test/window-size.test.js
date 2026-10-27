const test = require('node:test');
const assert = require('node:assert/strict');
const {
  BASE_WINDOW_SIZE,
  PET_SCALE,
  WINDOW_SIZE
} = require('../src/lib/window-size');

test('桌宠窗口按线性尺寸缩小为原来的约三分之一', () => {
  assert.equal(PET_SCALE, 1 / 3);
  assert.deepEqual(WINDOW_SIZE, { width: 100, height: 127 });
  assert.equal(WINDOW_SIZE.width, Math.round(BASE_WINDOW_SIZE.width / 3));
  assert.equal(WINDOW_SIZE.height, Math.round(BASE_WINDOW_SIZE.height / 3));
});
