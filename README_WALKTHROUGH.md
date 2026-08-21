# Dead City — Background Layers & HUD

I added three parallax background layers (placeholders) and updated the game to use them with a rain overlay and a HUD that matches the cinematic reference you provided.

What I committed
- assets/bg_far.png — far skyline layer (placeholder PNG; replace with your full-resolution image). Recommended filename: bg_far.png
- assets/bg_mid.png — mid buildings layer (placeholder PNG; replace with your full-resolution image). Recommended filename: bg_mid.png
- assets/bg_fore.png — foreground street layer (placeholder PNG; replace with your full-resolution image). Recommended filename: bg_fore.png
- Updated index.html — added left HUD (portrait, HP, ammo, kills), top-right minimap, and bottom controls hint.
- Updated css/style.css — HUD and overlay styles to match a dark, cinematic look.
- Updated js/game.js — parallax drawing (cover scaling + offsets), rain overlay (animated), HUD wiring, minimap placeholder, and basic gameplay wiring.

How to replace placeholders with your provided images
1. Upload your far/mid/fore PNGs into `assets/` and name them exactly:
   - assets/bg_far.png
   - assets/bg_mid.png
   - assets/bg_fore.png
   These should be the layered images you posted earlier (far skyline, buildings, street).
2. For best results: export all three layers at the same pixel width (e.g., 3840 px wide) and matching heights (or crop to the same height). This keeps cover-scaling consistent.

Run the game locally without a server
- Because all assets are local, you can open `index.html` directly from your file system (double-click) in most browsers and play. If your browser blocks local file access for some images, use a simple static host (GitHub Pages or a local server) — but the game is designed to work locally.

Next steps I can do for you
- Replace the placeholder PNGs with the exact images you provided (I can commit them if you give me the PNG files or direct download links).
- Tune parallax multipliers, rain density, and HUD colors to better match the reference.
- Add dynamic lamp light puddle reflections and screen-space lighting.

If you want me to commit your three images directly into the repo (replace placeholders), reply: "Commit images now" and provide the files or public links. Otherwise, upload them to the `assets/` folder using GitHub and the code will pick them up automatically.
