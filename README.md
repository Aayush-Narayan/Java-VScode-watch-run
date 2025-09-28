# Java-VScode-watch-run
🚀 Java-in-Seconds for VS Code Save your file → see the result instantly. No clicks, no extensions, no Maven—just Ctrl + Shift + B and watch your code run like magic!

# Install it once, inside the project folder on your root depository:
npm init -y                # creates package.json (optional but handy)
npm install chokidar       # installs the watcher

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

# Folder PATH:
root:

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
