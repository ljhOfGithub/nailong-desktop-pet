function clamp(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function clampWindowPosition(position, workArea, windowSize) {
  return {
    x: clamp(Math.round(position.x), workArea.x, workArea.x + workArea.width - windowSize.width),
    y: clamp(Math.round(position.y), workArea.y, workArea.y + workArea.height - windowSize.height)
  };
}

function getDefaultPosition(workArea, windowSize, margin = 24) {
  return clampWindowPosition(
    {
      x: workArea.x + workArea.width - windowSize.width - margin,
      y: workArea.y + workArea.height - windowSize.height - margin
    },
    workArea,
    windowSize
  );
}

module.exports = { clampWindowPosition, getDefaultPosition };
