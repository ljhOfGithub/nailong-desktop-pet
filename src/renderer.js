const stage = document.querySelector('#pet-stage');
const nailong = document.querySelector('#nailong');
const naiwa = document.querySelector('#naiwa');
const speech = document.querySelector('#speech');
const hearts = document.querySelector('#hearts');

const copy = {
  nailong: ['再摸一下！', '今天也要开心呀', '我闻到零食了', '嗷呜～', '陪你一会儿'],
  naiwa: ['齁齁齁齁！', '忍不住了！', '笑到肚子痛', '今天也很抽象', '先笑为敬']
};

let character = 'nailong';
let soundEnabled = true;
let dragState;
let bubbleTimer;
let moodTimer;
let pendingTapTimer;
let lastTapAt = 0;

function showBubble(text, duration = 1700) {
  clearTimeout(bubbleTimer);
  speech.textContent = text;
  speech.classList.add('is-visible');
  bubbleTimer = setTimeout(() => speech.classList.remove('is-visible'), duration);
}

function setMood(mood, duration = 1500) {
  clearTimeout(moodTimer);
  stage.dataset.mood = mood;
  moodTimer = setTimeout(() => {
    delete stage.dataset.mood;
  }, duration);
}

function sprinkleHearts() {
  for (let index = 0; index < 5; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = index % 2 ? '♥' : '❤';
    heart.style.left = `${36 + Math.random() * 28}%`;
    heart.style.setProperty('--drift', `${-34 + Math.random() * 68}px`);
    heart.style.animationDelay = `${index * 70}ms`;
    hearts.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
}

function playSyntheticLaugh() {
  if (!soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const now = context.currentTime;

  [0, .17, .34, .51].forEach((offset, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(145 + index * 9, now + offset);
    oscillator.frequency.exponentialRampToValueAtTime(105, now + offset + .11);
    gain.gain.setValueAtTime(.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(.055, now + offset + .02);
    gain.gain.exponentialRampToValueAtTime(.0001, now + offset + .13);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now + offset);
    oscillator.stop(now + offset + .14);
  });

  setTimeout(() => context.close(), 1000);
}

function interact() {
  const lines = copy[character];
  showBubble(lines[Math.floor(Math.random() * lines.length)]);

  if (character === 'naiwa') {
    setMood('laugh', 1800);
    playSyntheticLaugh();
  } else {
    setMood('happy', 1200);
    sprinkleHearts();
  }
}

function nap() {
  clearTimeout(pendingTapTimer);
  setMood('sleepy', 3600);
  showBubble(character === 'naiwa' ? '笑累了，歇会儿' : '呼……五分钟', 2500);
}

function switchCharacter(next) {
  character = next === 'naiwa' ? 'naiwa' : 'nailong';
  nailong.hidden = character !== 'nailong';
  naiwa.hidden = character !== 'naiwa';
  delete stage.dataset.mood;
  showBubble(character === 'naiwa' ? '奶娃登场，点我开笑' : '奶龙回来啦');
}

stage.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  dragState = {
    pointerId: event.pointerId,
    offsetX: event.clientX,
    offsetY: event.clientY,
    startX: event.screenX,
    startY: event.screenY,
    moved: false
  };
  stage.setPointerCapture(event.pointerId);
});

stage.addEventListener('pointermove', (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  if (Math.hypot(event.screenX - dragState.startX, event.screenY - dragState.startY) > 5) {
    dragState.moved = true;
    stage.classList.add('is-dragging');
  }
  if (dragState.moved) {
    window.desktopPet.moveWindow({
      x: event.screenX - dragState.offsetX,
      y: event.screenY - dragState.offsetY
    });
  }
});

stage.addEventListener('pointerup', (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  const wasMoved = dragState.moved;
  dragState = undefined;
  stage.classList.remove('is-dragging');
  stage.releasePointerCapture(event.pointerId);
  if (wasMoved) return;

  const now = Date.now();
  if (now - lastTapAt < 310) {
    clearTimeout(pendingTapTimer);
    lastTapAt = 0;
    nap();
    return;
  }
  lastTapAt = now;
  pendingTapTimer = setTimeout(interact, 230);
});

stage.addEventListener('pointercancel', () => {
  dragState = undefined;
  stage.classList.remove('is-dragging');
});

stage.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  window.desktopPet.showContextMenu();
});

window.desktopPet.onCharacterChange(switchCharacter);
window.desktopPet.onSoundChange((enabled) => {
  soundEnabled = enabled;
  showBubble(enabled ? '互动音效已打开' : '互动音效已关闭');
});

window.desktopPet.getState().then((state) => {
  soundEnabled = state.soundEnabled;
  switchCharacter(state.character);
  setTimeout(() => showBubble('拖动我，右键还能换形态'), 350);
});
