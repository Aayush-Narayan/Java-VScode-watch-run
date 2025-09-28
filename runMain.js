// runMain.js  –  Windows-safe version
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

// wipe / create output folder
if (fs.existsSync(OUT_DIR))
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// collect every .java file under src/
const javaFiles = [];
(function collect(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) collect(full);
    else if (ent.name.endsWith(".java")) javaFiles.push(full);
  }
})(SRC_DIR);

if (javaFiles.length === 0) die("No .java files found in src/");

// ---------- compile (classes land directly in <project>/out) ----------
const relFiles = javaFiles.map(f => path.relative(SRC_DIR, f));   // e.g. ["FirstProgram.java"]
try {
  execSync(`javac -d "${path.resolve(OUT_DIR)}" ${relFiles.join(" ")}`, {
    cwd: SRC_DIR,          // <-- compile FROM src
    stdio: "inherit",
    shell: true,
  });
} catch { die("Compilation failed!"); }


// find class that contains main
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
      if (bytecode.includes("main") && bytecode.includes("([Ljava/lang/String;)V")) {
        mainClass = fqcn;
      }
    }
  }
})(OUT_DIR);

if (!mainClass) die("No main method found in compiled classes!");

// run
try {
  execSync(`java -cp ${OUT_DIR} ${mainClass}`, { stdio: "inherit" });
} catch {
  die("Runtime error!");
}