// runMain.js  –  universal, re-entrant, crash-safe
const { execSync } = require("child_process");
const fs   = require("fs");
const path = require("path");

const OUT_DIR = "out";
const SRC_DIR = "src";

// ---------- helpers ----------
const clear = () =>
  process.stdout.write(
    process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
  );

const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

// ---------- start ----------
clear();

// 1.  kill any previous java process we launched
try {
  execSync(
    process.platform === "win32"
      ? `taskkill /F /IM java.exe 2>NUL`
      : `pkill -f "java -cp.*${OUT_DIR}" || true`,
    { shell: true }
  );
} catch { /* ignore if nothing to kill */ }

// 2.  clean build folder
if (fs.existsSync(OUT_DIR))
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// 3.  collect source files
const javaFiles = [];
(function collect(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) collect(full);
    else if (ent.name.endsWith(".java")) javaFiles.push(full);
  }
})(SRC_DIR);

if (javaFiles.length === 0) die("No .java files found in src/");

// 4.  compile
const relFiles = javaFiles.map(f => path.relative(SRC_DIR, f));
try {
  execSync(`javac -d "${path.resolve(OUT_DIR)}" ${relFiles.join(" ")}`, {
    cwd: SRC_DIR,
    stdio: "inherit",
    shell: true,
  });
} catch { die("Compilation failed!"); }

// 5.  locate main class
let mainClass = null;
(function find(dir, prefix = "") {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      find(full, path.join(prefix, ent.name));
    } else if (ent.name.endsWith(".class")) {
      const base = ent.name.replace(/\.class$/, "");
      const fqcn = prefix ? `${prefix.replace(/\\/g, ".")}.${base}` : base;
      const bytecode = fs.readFileSync(full);
      if (bytecode.includes("main") &&
          bytecode.includes("([Ljava/lang/String;)V")) {
        mainClass = fqcn;
      }
    }
  }
})(OUT_DIR);

if (!mainClass) die("No main method found in compiled classes!");

// 6.  run (stdio inherited so interactive apps work)
try {
  execSync(`java -cp ${OUT_DIR} ${mainClass}`, { stdio: "inherit" });
} catch {
  // swallow the exit code so the watcher does not die on user-induced exits
  process.exit(0);
}
