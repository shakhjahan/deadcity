// Dead City — Game with menu, pause, and basic sounds + high score
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', ()=>{ W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

// DOM
const overlayMenu = document.getElementById('overlayMenu');
const overlayPause = document.getElementById('overlayPause');
const startBtn = document.getElementById('startBtn');
const resumeBtn = document.getElementById('resumeBtn');
const restartBtn = document.getElementById('restartBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const highScoreEl = document.getElementById('highScore');
const scoreEl = document.getElementById('score');
const healthEl = document.getElementById('health');
const waveEl = document.getElementById('wave');

// Assets
const assets = { player: 'assets/player.png', zombie: 'assets/zombie.png', bg: 'assets/bg.png', bullet: 'assets/bullet.png' };
const images = {};
for(const k in assets){ images[k] = new Image(); images[k].src = assets[k]; }

// Audio (WebAudio simple effects)
let audioCtx = null;
function ensureAudio(){ if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } }
function playBeep(freq=440, time=0.06, type='sine', gain=0.06){ if(!audioCtx) return; const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = type; o.frequency.value = freq; g.gain.value = gain; o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + time); }
function playShootSound(){ playBeep(880, 0.04, 'square', 0.07); }
function playHitSound(){ playBeep(160, 0.12, 'sawtooth', 0.05); }

// Game state
let gameState = 'menu'; // 'menu' | 'playing' | 'paused' | 'gameover'
const player = {x: W/2, y: H/2, r: 20, speed: 250, health:100, angle:0};
const keys = {};
const bullets = [];
const zombies = [];
let lastTime = performance.now(); let spawnTimer = 0; let spawnInterval = 2000; let wave = 1; let score = 0;

// High score
const HS_KEY = 'deadcity_highscore';
function getHighScore(){ return Number(localStorage.getItem(HS_KEY) || 0); }
function setHighScore(v){ localStorage.setItem(HS_KEY, String(v)); }
highScoreEl.textContent = getHighScore();

// Input
window.addEventListener('keydown', e=>{
  keys[e.key.toLowerCase()] = true;
  if(e.key === 'Escape'){
    if(gameState === 'playing') pauseGame();
    else if(gameState === 'paused') resumeGame();
  }
});
window.addEventListener('keyup', e=>{ keys[e.key.toLowerCase()] = false; });
canvas.addEventListener('mousemove', e=>{ const rect = canvas.getBoundingClientRect(); const mx = e.clientX - rect.left; const my = e.clientY - rect.top; player.angle = Math.atan2(my-player.y, mx-player.x); });
canvas.addEventListener('click', e=>{ if(gameState==='menu'){ startGame(); } else if(gameState==='playing'){ shoot(); } });

// Touch
canvas.addEventListener('touchstart', e=>{ e.preventDefault(); ensureAudio(); if(gameState==='menu'){ startGame(); } else if(gameState==='playing'){ const t=e.touches[0]; player.x = t.clientX; player.y = t.clientY; shoot(); } });
canvas.addEventListener('touchmove', e=>{ e.preventDefault(); const t=e.touches[0]; player.x = t.clientX; player.y = t.clientY; });

// Buttons
startBtn.addEventListener('click', ()=>{ ensureAudio(); startGame(); });
resumeBtn.addEventListener('click', ()=>{ resumeGame(); });
restartBtn.addEventListener('click', ()=>{ startGame(); });
fullscreenBtn.addEventListener('click', ()=>{ if(!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); });

function shoot(){ if(gameState!=='playing') return; // play sound
  if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  playShootSound();
  const speed = 700; bullets.push({x:player.x + Math.cos(player.angle)*player.r, y:player.y + Math.sin(player.angle)*player.r, vx:Math.cos(player.angle)*speed, vy:Math.sin(player.angle)*speed, r:6, life:1.5}); }

function spawnZombie(){ const edge = Math.floor(Math.random()*4); let x,y; if(edge===0){ x=-60; y=Math.random()*H } if(edge===1){ x=W+60; y=Math.random()*H } if(edge===2){ x=Math.random()*W; y=-60 } if(edge===3){ x=Math.random()*W; y=H+60 } const speed = 40 + Math.random()*30 + wave*5; zombies.push({x,y, r:22, speed, hp:1 + Math.floor(wave/2)}); }

function resetGame(){ player.x = W/2; player.y = H/2; player.health = 100; player.angle = 0; bullets.length = 0; zombies.length = 0; lastTime = performance.now(); spawnTimer = 0; spawnInterval = 2000; wave = 1; score = 0; }

function startGame(){ resetGame(); gameState = 'playing'; overlayMenu.classList.add('hidden'); overlayPause.classList.add('hidden'); if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); requestAnimationFrame(gameLoop); }
function pauseGame(){ if(gameState!=='playing') return; gameState='paused'; overlayPause.classList.remove('hidden'); }
function resumeGame(){ if(gameState!=='paused') return; gameState='playing'; overlayPause.classList.add('hidden'); lastTime = performance.now(); requestAnimationFrame(gameLoop); }

function endGame(){ gameState='gameover'; overlayMenu.classList.remove('hidden'); overlayPause.classList.add('hidden'); // show score + highscore
  const hs = getHighScore(); if(score > hs) { setHighScore(Math.floor(score)); highScoreEl.textContent = Math.floor(score); } // When in menu, show current highscore element updated
}

function update(dt){ if(gameState!=='playing') return;
  // player movement
  let vx=0, vy=0; if(keys['w']||keys['arrowup']) vy-=1; if(keys['s']||keys['arrowdown']) vy+=1; if(keys['a']||keys['arrowleft']) vx-=1; if(keys['d']||keys['arrowright']) vx+=1; const len = Math.hypot(vx,vy) || 1; player.x += (vx/len)*player.speed*dt; player.y += (vy/len)*player.speed*dt; player.x = Math.max(20, Math.min(W-20, player.x)); player.y = Math.max(20, Math.min(H-20, player.y));

  // bullets
  for(let i=bullets.length-1;i>=0;i--){ const b=bullets[i]; b.x += b.vx*dt; b.y += b.vy*dt; b.life -= dt; if(b.life<=0 || b.x< -50 || b.x>W+50 || b.y<-50 || b.y>H+50) bullets.splice(i,1); }

  // zombies
  for(let i=zombies.length-1;i>=0;i--){ const z=zombies[i]; const ang = Math.atan2(player.y - z.y, player.x - z.x); z.x += Math.cos(ang)*z.speed*dt; z.y += Math.sin(ang)*z.speed*dt; const dist = Math.hypot(player.x - z.x, player.y - z.y); if(dist < (player.r + z.r - 4)){ player.health -= 10 * dt; if(player.health <=0){ player.health = 0; playHitSound(); endGame(); } }
    for(let j=bullets.length-1;j>=0;j--){ const b=bullets[j]; const d = Math.hypot(b.x - z.x, b.y - z.y); if(d < (b.r + z.r)){ bullets.splice(j,1); z.hp -=1; playHitSound(); if(z.hp<=0){ zombies.splice(i,1); score += 10; break; } } }
  }

  // spawn
  spawnTimer += dt*1000; if(spawnTimer > spawnInterval){ spawnTimer = 0; const count = 1 + Math.min(6, Math.floor(wave*0.8)); for(let i=0;i<count;i++) spawnZombie(); }
  if(zombies.length===0 && spawnInterval>500){ wave++; spawnInterval = Math.max(600, spawnInterval - 120); }
}

function draw(){ // background
  ctx.fillStyle = '#071018'; ctx.fillRect(0,0,W,H);
  if(images.bg && images.bg.complete){ const pat = ctx.createPattern(images.bg, 'repeat'); ctx.fillStyle = pat; ctx.globalAlpha = 0.08; ctx.fillRect(0,0,W,H); ctx.globalAlpha=1; }
  // zombies
  for(const z of zombies){ ctx.save(); ctx.translate(z.x,z.y); if(images.zombie && images.zombie.complete){ ctx.drawImage(images.zombie, -z.r, -z.r, z.r*2, z.r*2); } else { ctx.fillStyle = '#7f2b2b'; ctx.beginPath(); ctx.arc(0,0,z.r,0,Math.PI*2); ctx.fill(); } ctx.restore(); }
  // bullets
  for(const b of bullets){ if(images.bullet && images.bullet.complete){ ctx.drawImage(images.bullet, b.x-b.r, b.y-b.r, b.r*2, b.r*2); } else { ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); } }
  // player
  ctx.save(); ctx.translate(player.x, player.y); ctx.rotate(player.angle); if(images.player && images.player.complete){ ctx.drawImage(images.player, -player.r, -player.r, player.r*2, player.r*2); } else { ctx.fillStyle = '#00d1b2'; ctx.beginPath(); ctx.arc(0,0,player.r,0,Math.PI*2); ctx.fill(); } ctx.restore();
}

function gameLoop(t){ const dt = Math.min(0.05, (t - lastTime)/1000); lastTime = t; if(gameState==='playing'){ update(dt); draw(); scoreEl.textContent = 'Score: '+Math.floor(score); healthEl.textContent = 'Health: '+Math.max(0,Math.floor(player.health)); waveEl.textContent = 'Wave: '+wave; } else if(gameState==='menu'){ /* subtle background animation could go here */ draw(); }
  if(gameState==='gameover'){ // draw final overlay
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='48px system-ui'; ctx.fillText('Game Over', W/2, H/2 - 20); ctx.font='20px system-ui'; ctx.fillText('Refresh or Start to try again', W/2, H/2 + 20);
  }
  if(gameState!=='gameover' && gameState!=='paused'){ requestAnimationFrame(gameLoop); }
}

// Initialize menu and set high score
function initMenu(){ highScoreEl.textContent = getHighScore(); overlayMenu.classList.remove('hidden'); overlayPause.classList.add('hidden'); }

initMenu();

// Expose a resume on user gesture for audio on some mobile browsers
window.addEventListener('pointerdown', ()=>{ if(!audioCtx) return; if(audioCtx.state === 'suspended') audioCtx.resume(); });
