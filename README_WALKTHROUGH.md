# Dead City — Walkthrough & Guide

This repository contains a simple modern 2D zombie survival game built with HTML, CSS, and JavaScript. The game is playable locally by opening `index.html` in a browser.

Files added:
- index.html — game container and canvas
- css/style.css — HUD and visual styling
- js/game.js — game logic (player, zombies, bullets, wave system)
- assets/* — PNG sprite placeholders

Quick start
1. Clone the repo: `git clone https://github.com/shakhjahan/deadcity.git`
2. Open `index.html` in a modern browser (Chrome, Firefox, Edge).

Controls
- Move: WASD or arrow keys
- Aim: move the mouse
- Shoot: left-click or tap (mobile)

Walkthrough / Tips
1. Early waves: conserve bullets by aiming carefully. Zombies are slow at first — kite them and pick them off.
2. Movement: diagonal movement preserves speed; use strafing to avoid getting surrounded.
3. Health: you slowly lose health when touched; focus on clearing nearby zombies before advancing.
4. Wave progression: after clearing currently spawned zombies, the wave increases and more/faster zombies spawn.
5. Score: earn points by killing zombies. Higher waves give more points.

Extending the game (ideas)
- Add player animation & directional sprites.
- Add sound effects (shooting, zombie groans, hits).
- Add pickups: medkits, ammo, temporary speed boost.
- Add levels / safe zones / procedural maps.

Assets
The `assets/` folder contains placeholder PNGs. Replace them with high-resolution modern PNGs for better visuals. Keep sizes power-of-two (32x32, 64x64, 128x128) for crisp scaling.

License
You can use and modify this code freely. If you add third-party art or audio, ensure compliance with their licenses.
