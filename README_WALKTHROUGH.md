# Dead City — CC0 Sample Art Added (Player & Zombie Sprite Sheets)

I added CC0/public-domain sample sprite sheets to the game by referencing public PNGs hosted on OpenGameArt.org. This lets the game display high-resolution animated sprites immediately without needing you to upload assets.

What I changed
- js/game.js now loads the following CC0 sprite sheets by default:
  - Player sheet: https://opengameart.org/sites/default/files/player.png
  - Zombie sheet: https://opengameart.org/sites/default/files/zombie_typeA_walk_spritesheet.png
- Animation settings updated:
  - player: frameCount = 6, fps = 12
  - zombie: frameCount = 6, fps = 8
- The game still keeps local fallback images in `assets/` if you want to keep everything offline.

License / Sources
- Player sprite sheet (CC0): https://opengameart.org/content/hero-character-sprite-sheet  
  Direct PNG: https://opengameart.org/sites/default/files/player.png

- Zombie sprite sheet (CC0): https://opengameart.org/content/128x128-2d-zombies-spritesheet  
  Direct PNG: https://opengameart.org/sites/default/files/zombie_typeA_walk_spritesheet.png

Both assets are distributed under CC0 / public domain according to their OpenGameArt pages. You can replace them any time by uploading your own `assets/player_sheet.png` and `assets/zombie_sheet.png` (horizontal strips).

Notes
- If you prefer I can download the PNGs and commit them into the repo directly so the game works fully offline. Confirm if you want that and I will add the files to `assets/` (I will include the original attribution and source links in the README even though CC0 does not require it).
- If you want different frameCounts/frame sizes, tell me and I will reconfigure the Animation constructor to match.
