# Java-VScode-watch-run
🚀 Java-in-Seconds for VS Code Save your file → see the result instantly. No clicks, no extensions, no Maven—just Ctrl + Shift + B and watch your code run like magic!

## ✨ Features

| # | Feature | How it helps you |
|---|---------|------------------|
| 1 | **Zero-config hit play** | One key-bind (`Ctrl + Shift + B`) and the loop is alive—no Gradle, no Maven, no VS Code Java extension pack. |
| 2 | **Hot-reload in <½ s** | Save any `.java` file → watcher fires → auto-compiles → instant re-run. |
| 3 | **Works on Win / Mac / Linux** | Uses Node + chokidar so the same repo runs everywhere; no platform-specific scripts. |
| 4 | **Default-package friendly** | Drop a single file, or grow into multiple classes—no package boiler-plate required. |
| 5 | **Main-class auto-detection** | Script scans bytecode and launches whichever class contains `public static void main`—you never edit a launch config. |
| 6 | **Clean build every run** | Old `out/` folder is wiped first, so you never chase stale `.class` ghosts. |
| 7 | **Portable & repo-ready** | Everything lives in the folder you opened; commit it, clone it, and `npm i` on the next machine—done. |


# Quick Start: Install it once, inside the project folder on your root depository:
 ### creates package.json (optional but handy)
- npm init -y
 ### installs the watcher
- npm install chokidar

## Usage
1. Clone repo.
2. `npm install`   (installs chokidar watcher).
3. Open folder in VS Code → `Ctrl+Shift+B`.
4. Edit any file under `src/` – it recompiles and reruns instantly.

## Structure
- `src/`            – Java sources (default package).
- `out/`            – compiled classes (git-ignored).
- `runMain.js`      – Node script that compiles & launches main class.
- `.vscode/tasks.json` – VS Code task that watches `src/**/*.java`.

# Repo Layout:
rootFolder:

      ├───.vscode
            └─── tasks.json
      ├───out
          └─── FileName.class
      └───src
          └─── FileName.java
      └─── runMain.js

# Note:
- After setup, just press `Ctrl + Shift + B` to run the task, then turn on the Auto Save feature in VS code.
- Every thing is now ready, Just make changes in the java code, and it will re-compile and show the output in real time.
- PRs welcome—please keep the default-package rule so the auto-launcher keeps working.

# 🛠 How It Works
- VS Code starts chokidar → watcher spawns node runMain.js on every save
- runMain.js
- wipes out/,
- javac -d out src/**/*.java,
- byte-code-scans for public static void main,
- java -cp out <MainClass>.

### How the file-watcher in this repo copes with OS limits

| OS      | Native API used by chokidar | Single file | Directory | Recursive dir | Survives overflow? | Network drives | Practical impact in *this* project |
|---------|-----------------------------|-------------|-----------|---------------|--------------------|---------------|-------------------------------------|
| Windows | ReadDirectoryChangesW       | ❌          | ✅        | ✅            | generic error      | mostly OK¹    | Can be chatty & may lock the folder; chokidar de-duplicates for us |
| Linux   | inotify                     | ✅          | ✅        | ❌            | generic error      | local only    | chokidar falls back to recursive polling via `fs.watchFile` when needed |
| macOS   | FSEvents (kqueue fallback)  | ✅          | ✅        | ✅            | generic error      | reported OK   | FSEvents works great; heavy I/O test-stress is handled by chokidar |

¹ Windows network shares: if the remote host does **not** support change notifications, chokidar silently switches to 5-second polling—no manual fix required.

# License
MIT – feel free to use / fork / share.
