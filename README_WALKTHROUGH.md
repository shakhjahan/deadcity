# Dead City — Walkthrough & Guide

This repository contains a simple modern 2D zombie survival game built with HTML, CSS, and JavaScript. The game is playable locally by opening `index.html` in a browser.

New features added:
- Main menu with Start and Fullscreen buttons
- Pause overlay (Esc or Pause menu)
- High score saved in localStorage and shown in the menu
- Simple generated sounds using WebAudio (no external audio files required)

Files added/updated:
- index.html — game container, HUD, and overlay/menu/pause markup (updated)
- css/style.css — HUD, overlay and button styling (updated)
- js/game.js — game logic updated: menu, pause, high score, sound
- README_WALKTHROUGH.md — updated notes

Quick start
1. Clone the repo: `git clone https://github.com/shakhjahan/deadcity.git`
2. Serve the folder (recommended so images load consistently):
   - Python 3: `python -m http.server 8000`
   - Then open: `http://localhost:8000`

Controls
- Move: WASD or arrow keys
- Aim: move the mouse
- Shoot: left-click or tap (mobile)
- Pause: Esc

Walkthrough / Tips
- Start the game from the main menu. The high score (if any) is shown there.
- During play press Esc to pause. Resume or Restart from the pause menu.
- Early waves: conserve bullets and kite zombies. Score is stored locally across sessions.

Extending the game
- Replace placeholder PNGs in `assets/` with sprite sheets and animated frames.
- Add sound files for music and richer SFX; currently the game uses generated beeps.
- Improve mobile input: add on-screen joystick and separate fire button for better touch play.

