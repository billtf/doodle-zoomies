# Doodle Zoomies

A customizable doodle has the zoomies. Run down the block, dodge neighborhood obstacles, and collect treats in this keyboard-only Canvas game.

## Play

Open `index.html` in Chrome and press Space.

| Key | Action |
| --- | --- |
| Space or Up | Jump (hold for a higher jump) |
| Down | Duck / slide; fast-fall in the air |
| Left / Right | Move and change the world speed |
| P or Esc | Pause / resume |
| M | Mute / unmute |
| C | Customize the dog (title screen) |
| H | How to play (title screen) |
| R | Restart (pause or game over) |
| Backtick | Debug overlay |

The first time you start, type a dog name of up to 12 characters and use the arrow keys to choose from eight coat colors. Press Enter to save and play. Press C on the title screen to customize again. While naming the dog, typing is isolated from gameplay controls.

The game saves the name, coat, best score, best distance, and mute setting when browser storage is available. All storage access uses a safe fallback, so it still plays when storage is blocked or cleared.

## Host on GitHub Pages

1. Put these files at the root of the repository's `main` branch.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main**, select **/(root)**, and click **Save**.
5. After GitHub finishes publishing, open `https://<account>.github.io/doodle-zoomies/`.

No Actions workflow, build command, package installation, server, or external service is required.

## Download ZIP fallback

If GitHub Pages is blocked, click **Code → Download ZIP** on GitHub. Unzip the download, then double-click `index.html`. The game uses classic scripts, generated art, and synthesized sound, so it works directly from `file://` with no network connection.

## Tests

Open `tests/tests.html` in Chrome. The dependency-free browser suite checks collisions, jump physics, speed, profile sanitization and persistence, cached coat rendering, storage fallback, all obstacle definitions, 40,000 fairness selections, and a 20,000-tick simulation. Add `?bot=1` to the game URL for the automated play mode.

## Tweak the game

All gameplay tuning values live in `js/config.js`. To add an obstacle:

1. Add its data to `DZ.obstacleTypes` in `js/entities/obstacle.js`.
2. Add its procedural drawing case in `js/art/obstacles.js`.
3. Add its name to one or more patterns in `js/world/spawner.js`.
4. Extend the browser tests with its unlock and fairness expectations.

The game is vanilla ES2020 JavaScript and Canvas 2D. It intentionally has no modules, framework, bundler, runtime dependencies, remote fonts, analytics, or remote assets.

## License

MIT
