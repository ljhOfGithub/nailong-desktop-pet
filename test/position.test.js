const test = require('node:test');
const assert = require('node:assert/strict');
const { clampWindowPosition, getDefaultPosition } = require('../src/lib/position');

const workArea = { x: 10, y: 20, width: 1200, height: 800 };
const windowSize = { width: 300, height: 380 };

test('默认位置位于屏幕右下角并保留边距', () => {
  assert.deepEqual(getDefaultPosition(workArea, windowSize, 24), { x: 886, y: 416 });
});

test('拖动位置被限制在当前显示器可见区域', () => {
  assert.deepEqual(clampWindowPosition({ x: -999, y: 9999 }, workArea, windowSize), { x: 10, y: 440 });
});

test('小于窗口的工作区也不会产生反向边界', () => {
  assert.deepEqual(
    clampWindowPosition({ x: 500, y: 500 }, { x: 4, y: 8, width: 100, height: 100 }, windowSize),
    { x: 4, y: 8 }
  );
});
