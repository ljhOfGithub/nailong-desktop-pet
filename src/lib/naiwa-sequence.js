(function exposeNaiwaSequence(root) {
  const NAIWA_PHASES = Object.freeze([
    Object.freeze({ name: 'laugh', at: 0 }),
    Object.freeze({ name: 'freeze', at: 1500 }),
    Object.freeze({ name: 'battle', at: 1680 })
  ]);
  const NAIWA_SEQUENCE_END = 4200;

  function getNaiwaPhaseAt(elapsedMs) {
    if (!Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs >= NAIWA_SEQUENCE_END) {
      return 'idle';
    }

    return NAIWA_PHASES.reduce(
      (current, phase) => (elapsedMs >= phase.at ? phase.name : current),
      'idle'
    );
  }

  const api = Object.freeze({ NAIWA_PHASES, NAIWA_SEQUENCE_END, getNaiwaPhaseAt });

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.naiwaSequence = api;
  }
})(typeof window === 'undefined' ? undefined : window);
