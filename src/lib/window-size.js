const BASE_WINDOW_SIZE = Object.freeze({ width: 300, height: 380 });
const PET_SCALE = 1 / 3;
const WINDOW_SIZE = Object.freeze({
  width: Math.round(BASE_WINDOW_SIZE.width * PET_SCALE),
  height: Math.round(BASE_WINDOW_SIZE.height * PET_SCALE)
});

module.exports = { BASE_WINDOW_SIZE, PET_SCALE, WINDOW_SIZE };
