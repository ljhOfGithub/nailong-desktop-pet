const test = require('node:test');
const assert = require('node:assert/strict');
const {
  NAIWA_PHASES,
  NAIWA_SEQUENCE_END,
  getNaiwaPhaseAt
} = require('../src/lib/naiwa-sequence');

test('奶娃互动按大笑、急停、假正经顺序播放', () => {
  assert.deepEqual(
    NAIWA_PHASES.map((phase) => phase.name),
    ['laugh', 'freeze', 'battle']
  );
  assert.ok(NAIWA_PHASES.every((phase, index) => index === 0 || phase.at > NAIWA_PHASES[index - 1].at));
});

test('奶娃互动在边界时间切换正确状态', () => {
  assert.equal(getNaiwaPhaseAt(0), 'laugh');
  assert.equal(getNaiwaPhaseAt(1499), 'laugh');
  assert.equal(getNaiwaPhaseAt(1500), 'freeze');
  assert.equal(getNaiwaPhaseAt(1680), 'battle');
  assert.equal(getNaiwaPhaseAt(NAIWA_SEQUENCE_END), 'idle');
  assert.equal(getNaiwaPhaseAt(-1), 'idle');
});

test('假正经姿态保持至少两秒', () => {
  const battle = NAIWA_PHASES.find((phase) => phase.name === 'battle');
  assert.ok(battle);
  assert.ok(NAIWA_SEQUENCE_END - battle.at >= 2000);
});
