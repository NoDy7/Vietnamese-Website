const revealItems = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter');
const unitCards = document.querySelectorAll('.unit-card');
const toast = document.querySelector('.toast');
const unitModal = document.querySelector('.unit-modal');
const modalTitle = document.querySelector('#modal-title');
const modalRole = document.querySelector('#modal-role');
const modalCountry = document.querySelector('#modal-country');
const modalStats = document.querySelector('#modal-stats');
const missionModal = document.querySelector('.mission-modal');
const missionData = {
  storm: { tag: 'DA NANG // AIR', title: 'ГРОЗОВОЙ ФРОНТ', copy: 'Сопроводить ударную группу сквозь муссонный фронт и подавить зенитные позиции.', objective: 'Уничтожить 6 ЗРК', reward: '12 000 SL', risk: 'HIGH' },
  corridor: { tag: 'KHE SANH // GROUND', title: 'СТАЛЬНОЙ КОРИДОР', copy: 'Пробить блокаду на трассе 9 и вывести конвой до наступления темноты.', objective: 'Доставить 3 машины', reward: '9 500 SL', risk: 'MEDIUM' },
  perimeter: { tag: 'SAIGON // RECON', title: 'ТИХИЙ ПЕРИМЕТР', copy: 'Найти разведгруппу в плотной растительности. Радиомолчание обязательно.', objective: 'Обнаружить 4 точки', reward: '7 800 SL', risk: 'EXTREME' }
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
  observer.observe(item);
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    unitCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.type === filter;
      card.animate([
        { opacity: visible ? 0.25 : 1, transform: 'scale(.98)' },
        { opacity: visible ? 1 : 0.18, transform: 'scale(1)' }
      ], { duration: 260, easing: 'ease-out' });
      card.style.opacity = visible ? '1' : '.18';
    });
  });
});

unitCards.forEach((card) => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.unit;
    modalRole.textContent = card.dataset.role;
    modalCountry.textContent = card.dataset.country;
    modalStats.innerHTML = card.dataset.stats.split('|').reduce((html, value, index, stats) => index % 2 ? html : `${html}<div class="modal-stat"><span>${value}</span><strong>${stats[index + 1]}</strong></div>`, '');
    unitModal.classList.add('open');
    unitModal.setAttribute('aria-hidden', 'false');
  });
});

document.querySelectorAll('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', () => {
    unitModal.classList.remove('open');
    unitModal.setAttribute('aria-hidden', 'true');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    unitModal.classList.remove('open');
    unitModal.setAttribute('aria-hidden', 'true');
  }
});

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => document.querySelector(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' }));
});

document.querySelectorAll('[data-alert]').forEach((button) => {
  button.addEventListener('click', () => {
    toast.textContent = button.dataset.alert;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 3200);
  });
});

const preloader = document.querySelector('.preloader');
const loaderFill = document.querySelector('.loader-line span');
let progress = 0;
const loaderTimer = window.setInterval(() => {
  progress = Math.min(progress + Math.ceil(Math.random() * 13), 100);
  loaderFill.style.transform = `scaleX(${progress / 100})`;
  document.querySelector('.preloader p b').textContent = `${String(progress).padStart(2, '0')}%`;
  if (progress === 100) {
    window.clearInterval(loaderTimer);
    window.setTimeout(() => preloader.classList.add('done'), 250);
  }
}, 55);

const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => document.body.classList.remove('menu-open')));

let language = localStorage.getItem('monsoon-language') || 'ru';
document.documentElement.lang = language;
document.querySelector('.lang-toggle').addEventListener('click', (event) => {
  language = language === 'ru' ? 'en' : 'ru';
  localStorage.setItem('monsoon-language', language);
  document.documentElement.lang = language;
  document.querySelectorAll('[data-ru][data-en]').forEach((element) => { element.textContent = element.dataset[language]; });
  event.currentTarget.innerHTML = language === 'ru' ? 'RU <span>/</span> EN' : 'EN <span>/</span> RU';
});

const rainCanvas = document.querySelector('.rain-canvas');
const rainContext = rainCanvas.getContext('2d');
let rainDrops = [];
function resizeRain() {
  rainCanvas.width = window.innerWidth;
  rainCanvas.height = window.innerHeight;
  rainDrops = Array.from({ length: Math.min(130, Math.floor(window.innerWidth / 8)) }, () => ({ x: Math.random() * rainCanvas.width, y: Math.random() * rainCanvas.height, length: 8 + Math.random() * 15, speed: 5 + Math.random() * 5 }));
}
function drawRain() {
  rainContext.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainContext.strokeStyle = 'rgba(180, 205, 185, .18)';
  rainContext.lineWidth = 1;
  rainDrops.forEach((drop) => { rainContext.beginPath(); rainContext.moveTo(drop.x, drop.y); rainContext.lineTo(drop.x - 2, drop.y + drop.length); rainContext.stroke(); drop.y += drop.speed; if (drop.y > rainCanvas.height) { drop.y = -drop.length; drop.x = Math.random() * rainCanvas.width; } });
  window.requestAnimationFrame(drawRain);
}
window.addEventListener('resize', resizeRain);
resizeRain();
drawRain();

const soundToggle = document.querySelector('.sound-toggle');
const volumeSlider = document.querySelector('.volume-slider');
const audioTracks = {
  rain: new Audio('assets/rain.mp3'),
  radio: new Audio('assets/radio.mp3'),
  gunfire: new Audio('assets/gunfire.mp3'),
  explosion: new Audio('assets/explosion.mp3')
};
let explosionTimer;
Object.values(audioTracks).forEach((track) => { track.preload = 'auto'; track.volume = .28; });
function setVolume(value) { Object.values(audioTracks).forEach((track) => { track.volume = value / 100; }); }
volumeSlider.value = localStorage.getItem('monsoon-volume') || volumeSlider.value;
setVolume(volumeSlider.value);
volumeSlider.addEventListener('input', (event) => localStorage.setItem('monsoon-volume', event.currentTarget.value));
volumeSlider.addEventListener('input', (event) => setVolume(event.currentTarget.value));
audioTracks.rain.loop = true;
audioTracks.radio.loop = true;
function startSoundscape() {
  audioTracks.rain.volume = .22;
  audioTracks.radio.volume = .12;
  audioTracks.rain.play();
  audioTracks.radio.play();
  explosionTimer = window.setInterval(() => { if (Math.random() > .5) { audioTracks.explosion.currentTime = 0; audioTracks.explosion.play(); } }, 7000);
}
soundToggle.addEventListener('click', () => {
  if (soundToggle.getAttribute('aria-pressed') === 'true') { window.clearInterval(explosionTimer); Object.values(audioTracks).forEach((track) => { track.pause(); track.currentTime = 0; }); soundToggle.setAttribute('aria-pressed', 'false'); soundToggle.textContent = 'SOUND OFF'; soundToggle.classList.remove('is-on'); return; }
  startSoundscape(); soundToggle.setAttribute('aria-pressed', 'true'); soundToggle.textContent = 'SOUND ON'; soundToggle.classList.add('is-on');
});

document.querySelectorAll('.mission-button').forEach((button) => button.addEventListener('click', () => {
  const mission = missionData[button.dataset.mission];
  document.querySelector('#mission-modal-tag').textContent = mission.tag;
  document.querySelector('#mission-modal-title').textContent = mission.title;
  document.querySelector('#mission-modal-copy').textContent = mission.copy;
  document.querySelector('#mission-objective').textContent = mission.objective;
  document.querySelector('#mission-reward').textContent = mission.reward;
  document.querySelector('#mission-risk').textContent = mission.risk;
  missionModal.classList.add('open'); missionModal.setAttribute('aria-hidden', 'false');
  if (soundToggle.getAttribute('aria-pressed') === 'true') { audioTracks.gunfire.currentTime = 0; audioTracks.gunfire.play(); }
}));

document.querySelectorAll('[data-close-mission]').forEach((element) => element.addEventListener('click', () => { missionModal.classList.remove('open'); missionModal.setAttribute('aria-hidden', 'true'); }));
document.querySelector('.deploy-button').addEventListener('click', () => { missionModal.classList.remove('open'); missionModal.setAttribute('aria-hidden', 'true'); const route = document.querySelector('[data-stat="route"]'); const targets = document.querySelector('[data-stat="targets"]'); route.textContent = Math.min(100, Number(route.textContent) + 8); targets.textContent = Number(targets.textContent) + 3; document.querySelector('[data-stat="status"]').textContent = 'DEPLOYED'; });

document.querySelectorAll('.time-toggle').forEach((button) => button.addEventListener('click', () => { document.body.dataset.time = button.dataset.time; document.querySelectorAll('.time-toggle').forEach((item) => item.classList.remove('active')); button.classList.add('active'); localStorage.setItem('monsoon-time', button.dataset.time); }));
document.querySelector('.weather-select').addEventListener('change', (event) => { document.body.dataset.weather = event.currentTarget.value; localStorage.setItem('monsoon-weather', event.currentTarget.value); });
document.body.dataset.time = localStorage.getItem('monsoon-time') || 'day';
document.body.dataset.weather = localStorage.getItem('monsoon-weather') || 'rain';
document.querySelectorAll('.time-toggle').forEach((button) => button.classList.toggle('active', button.dataset.time === document.body.dataset.time));
document.querySelector('.weather-select').value = document.body.dataset.weather;

let mapScale = 1;
document.querySelectorAll('[data-map-zoom]').forEach((button) => button.addEventListener('click', () => { const action = button.dataset.mapZoom; mapScale = action === 'reset' ? 1 : Math.max(.8, Math.min(1.8, mapScale + (action === 'in' ? .2 : -.2))); document.querySelector('.theater-map').style.setProperty('--map-scale', mapScale); }));

