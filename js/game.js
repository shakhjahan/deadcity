// Dead City — Parallax backgrounds, rain overlay, and HUD wiring
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', ()=>{ W = canvas.width = innerWidth; H = canvas.height = innerHeight; initRain(); });

// DOM HUD
const hpFill = document.getElementById('hpFill');
const hpVal = document.getElementById('hpVal');
const ammoFill = document.getElementById('ammoFill');
const ammoVal = document.getElementById('ammoVal');
const killsVal = document.getElementById('killsVal');
const minimapCanvas = document.getElementById('minimapCanvas');
const minimapCtx = minimapCanvas.getContext('2d');

// Load local parallax layers (replace these assets with your high-res files)
const images = {
  bgFar: new Image(),
  bgMid: new Image(),
  bgFore: new Image(),
  player: new Image(),
  zombie: new Image(),
  bullet: new Image()
};
images.bgFar.src = 'assets/bg_far.png';
images.bgMid.src = 'assets/bg_mid.png';
images.bgFore.src = 'assets/bg_fore.png';
images.player.src = 'assets/player.png';
images.zombie.src = 'assets/zombie.png';
images.bullet.src = 'assets/bullet.png';

// Animation class (kept for sprites)
class Animation{constructor(img,frameCount=4,fps=10){this.img=img;this.frameCount=frameCount;this.fps=fps;this.frame=0;this.time=0;this.frameW=null;this.frameH=null;}update(dt){if(!this.img.complete||this.img.naturalWidth===0)return;if(!this.frameW)this.frameW=Math.floor(this.img.width/this.frameCount)||this.img.width;if(!this.frameH)this.frameH=this.img.height;this.time+=dt;const interval=1/this.fps;while(this.time>interval){this.time-=interval;this.frame=(this.frame+1)%this.frameCount;}}draw(ctx,x,y,w,h,rotation=0){if(!this.img.complete||this.img.naturalWidth===0)return false;const sx=this.frame*this.frameW;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(this.img,sx,0,this.frameW,this.frameH,-w/2,-h/2,w,h);ctx.restore();return true;}}

// Keep simple placeholders for animated sprites (optional)
const playerAnim = new Animation(images.player,4,12);
const zombieAnim = new Animation(images.zombie,4,8);

// Game state (simplified, reusing previous logic)
const player = {x: W/2, y: H/2, r:28, speed:280, health:100, angle:0, ammo:30, ammoMax:120, kills:0};
const bullets = [];
const zombies = [];
let lastTime = performance.now(); let spawnTimer=0, spawnInterval=2000, wave=1, score=0;
const keys = {};

// Input (basic)
window.addEventListener('keydown', e=>{ keys[e.key.toLowerCase()] = true; if(e.key==='Escape'){ /* pause/resume handled elsewhere */ } });
window.addEventListener('keyup', e=>{ keys[e.key.toLowerCase()] = false; });
canvas.addEventListener('mousemove', e=>{ const r = canvas.getBoundingClientRect(); player.angle = Math.atan2(e.clientY - r.top - player.y, e.clientX - r.left - player.x); });
canvas.addEventListener('click', ()=>{ shoot(); });

function shoot(){ if(player.ammo<=0) return; player.ammo--; bullets.push({x:player.x + Math.cos(player.angle)*player.r, y:player.y + Math.sin(player.angle)*player.r, vx:Math.cos(player.angle)*900, vy:Math.sin(player.angle)*900, r:6, life:1.2}); updateHUD(); }

// Parallax helpers
function coverDrawImage(img, offsetX){ if(!img.complete || img.naturalWidth===0) return; const scale = Math.max(W / img.width, H / img.height); const w = img.width * scale; const h = img.height * scale; // center vertically
  const x = Math.round(- (w - W)/2 + offsetX); ctx.drawImage(img, x, Math.round((H - h)/2), w, h);
}

// Rain overlay (simple particle streaks)
let rainCanvas, rainCtx, raindrops=[];
function initRain(){ rainCanvas = document.createElement('canvas'); rainCanvas.width = W; rainCanvas.height = H; rainCtx = rainCanvas.getContext('2d'); raindrops = []; const count = Math.floor((W*H)/70000); for(let i=0;i<count;i++){ raindrops.push({x:Math.random()*W, y:Math.random()*H, l:8+Math.random()*16, s:200+Math.random()*200}); } }
initRain();
function updateRain(dt){ for(const d of raindrops){ d.y += d.s * dt; d.x += -50*dt; if(d.y > H + d.l){ d.y = -10 - Math.random()*50; d.x = Math.random()*W; } } // draw to rainCanvas
  rainCtx.clearRect(0,0,W,H); rainCtx.strokeStyle = 'rgba(200,220,255,0.06)'; rainCtx.lineWidth = 1; rainCtx.beginPath(); for(const d of raindrops){ rainCtx.moveTo(d.x, d.y); rainCtx.lineTo(d.x + 6, d.y + d.l); } rainCtx.stroke(); // add subtle splashes on ground
  rainCtx.fillStyle = 'rgba(255,255,255,0.014)'; for(let i=0;i<30;i++){ const rx = (i*137)%W; const ry = (i*199)%H; rainCtx.fillRect(rx, ry, 1, 1); }
}

// HUD update
function updateHUD(){ const hpPct = Math.max(0, Math.min(1, player.health/100)); hpFill.style.width = (hpPct*100)+'%'; hpVal.textContent = Math.floor(player.health) + '/100'; const ammoPct = Math.max(0, Math.min(1, player.ammo/player.ammoMax)); ammoFill.style.width = (ammoPct*100)+'%'; ammoVal.textContent = player.ammo + '/' + player.ammoMax; killsVal.textContent = player.kills; }
updateHUD();

// Simple spawn / update logic for demonstration
function spawnZombie(){ const edge = Math.floor(Math.random()*4); let x,y; if(edge===0){ x=-120; y=Math.random()*H } else if(edge===1){ x=W+120; y=Math.random()*H } else if(edge===2){ x=Math.random()*W; y=-120 } else { x=Math.random()*W; y=H+120 } zombies.push({x,y,r:30,speed:50 + Math.random()*40,hp:1 + Math.floor(wave/2)}); }

function update(dt){ // movement (WASD)
  let vx=0, vy=0; if(keys['w']||keys['arrowup']) vy-=1; if(keys['s']||keys['arrowdown']) vy+=1; if(keys['a']||keys['arrowleft']) vx-=1; if(keys['d']||keys['arrowright']) vx+=1; const len = Math.hypot(vx,vy)||1; player.x += (vx/len)*player.speed*dt; player.y += (vy/len)*player.speed*dt; player.x = Math.max(40, Math.min(W-40, player.x)); player.y = Math.max(40, Math.min(H-80, player.y));
  // bullets
  for(let i=bullets.length-1;i>=0;i--){ const b=bullets[i]; b.x += b.vx*dt; b.y += b.vy*dt; b.life -= dt; if(b.life<=0) bullets.splice(i,1); }
  // zombies
  for(let i=zombies.length-1;i>=0;i--){ const z=zombies[i]; const ang = Math.atan2(player.y - z.y, player.x - z.x); z.x += Math.cos(ang)*z.speed*dt; z.y += Math.sin(ang)*z.speed*dt; const dist = Math.hypot(player.x - z.x, player.y - z.y); if(dist < player.r + z.r - 6){ player.health -= 10*dt; if(player.health<=0) player.health=0; }
    for(let j=bullets.length-1;j>=0;j--){ const b=bullets[j]; const d = Math.hypot(b.x - z.x, b.y - z.y); if(d < b.r + z.r){ bullets.splice(j,1); z.hp -=1; if(z.hp<=0){ zombies.splice(i,1); player.kills++; score += 10; updateHUD(); break; } } }
  }
  spawnTimer += dt*1000; if(spawnTimer > spawnInterval){ spawnTimer = 0; const count = 1 + Math.min(8, Math.floor(wave*1.0)); for(let i=0;i<count;i++) spawnZombie(); }
  if(zombies.length===0 && spawnInterval>400){ wave++; spawnInterval = Math.max(400, spawnInterval - 100); }
  updateRain(dt);
}

// Draw: parallax layers, player, zombies, bullets, rain, HUD overlays
function draw(){ // base clear
  ctx.fillStyle = '#071018'; ctx.fillRect(0,0,W,H);
  const cameraX = player.x - W/2; // camera world X
  // parallax offsets
  const farOffset = -cameraX * 0.06;
  const midOffset = -cameraX * 0.25;
  const foreOffset = -cameraX * 1.0;
  // draw far / mid / fore using cover scaling
  coverDrawImage(images.bgFar, farOffset);
  coverDrawImage(images.bgMid, midOffset);
  coverDrawImage(images.bgFore, foreOffset);
  // draw ground shadow / vignette (subtle)
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, H - 120, W, 120);
  // zombies
  for(const z of zombies){ // simple circle or sprite
    if(images.zombie.complete && images.zombie.naturalWidth>8){ ctx.drawImage(images.zombie, z.x - z.r, z.y - z.r, z.r*2, z.r*2); } else { ctx.fillStyle='#7f2b2b'; ctx.beginPath(); ctx.arc(z.x,z.y,z.r,0,Math.PI*2); ctx.fill(); } }
  // bullets
  for(const b of bullets){ ctx.fillStyle='#ffd166'; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); }
  // player
  if(images.player.complete && images.player.naturalWidth>8){ ctx.save(); ctx.translate(player.x, player.y); ctx.rotate(player.angle); ctx.drawImage(images.player, -player.r, -player.r, player.r*2, player.r*2); ctx.restore(); } else { ctx.save(); ctx.translate(player.x, player.y); ctx.rotate(player.angle); ctx.fillStyle='#00d1b2'; ctx.beginPath(); ctx.arc(0,0,player.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  // rain overlay
  ctx.drawImage(rainCanvas, 0, 0);
}

function gameLoop(t){ const dt = Math.min(0.05, (t - lastTime)/1000); lastTime = t; update(dt); draw(); requestAnimationFrame(gameLoop); }
requestAnimationFrame(gameLoop);

// simple minimap (placeholder) — draws player and zombies scaled down
function updateMinimap(){ minimapCtx.clearRect(0,0,minimapCanvas.width,minimapCanvas.height); minimapCtx.fillStyle='rgba(0,0,0,0.4)'; minimapCtx.fillRect(0,0,minimapCanvas.width,minimapCanvas.height); const scale = 0.05; // this is arbitrary for demo
  // draw player
  minimapCtx.fillStyle='#00d1b2'; minimapCtx.fillRect((minimapCanvas.width/2)-3,(minimapCanvas.height/2)-3,6,6);
  // zombies relative positions
  minimapCtx.fillStyle='#ff6b6b'; for(const z of zombies){ const dx = (z.x - player.x) * scale; const dy = (z.y - player.y) * scale; const px = minimapCanvas.width/2 + dx; const py = minimapCanvas.height/2 + dy; minimapCtx.fillRect(px-2, py-2, 4, 4); }
}
setInterval(updateMinimap, 300);

// initialize HUD values and ensure rain ready
updateHUD(); initRain();
