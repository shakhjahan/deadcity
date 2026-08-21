# Dead City — Sprite Sheet Animation Support

I added a simple Animation class and loader to render horizontal sprite sheets for the player and zombies. The repository now contains two new files:

- assets/player_sheet.png — placeholder sprite-sheet (replace with your art)
- assets/zombie_sheet.png — placeholder sprite-sheet (replace with your art)

How the sprite sheets should be formatted
- Frames laid out horizontally in a single row.
- All frames the same width & height.
- Example: a 4-frame, 128×128 per-frame sheet → image size: 512×128
- Default frame count used by the code is 4 for both player and zombies. If you supply a different frame count, update the Animation construction in `js/game.js`.

How to replace with your art
1. Create a sprite sheet for player: width = frameWidth * frameCount, height = frameHeight.
2. Name it `assets/player_sheet.png` and push it to the repository (or upload via GitHub).
3. Do the same for `assets/zombie_sheet.png`.
4. Edit `js/game.js` if you want to change frameCount or fps for the animations.

Notes
- If sprite sheets are not present, the game falls back to the single-image placeholders (`assets/player.png`, `assets/zombie.png`) or simple circle drawings.
- I included tiny placeholder PNGs so the repo structure is ready; replace them with real PNGs for visible animation.
