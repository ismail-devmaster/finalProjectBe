// hook.js

const os = require("os");
const fs = require("fs");
const { exec, execSync } = require("child_process");
const readline = require("readline");
const path = require("path");

let serverProcess = null;
let isRestarting = false;
const PORT = process.env.PORT || 4000;
const restartFlagPath = path.join(__dirname, "restart.flag");

const killPort = async (port) => {
  try {
    const platform = os.platform();
    let command = "";
    let pid = "";

    if (platform === "win32") {
      command = `netstat -ano | findstr :${port}`;
      const result = execSync(command).toString();
      pid = result.match(/\d+$/)?.[0];
      if (pid) {
        console.log(`[Hook] Killing process on port ${port} (PID: ${pid})...`);
        execSync(`taskkill /PID ${pid} /F`);
      }
    } else {
      command = `lsof -ti :${port}`;
      pid = execSync(command).toString().trim();
      if (pid) {
        console.log(`[Hook] Killing process on port ${port} (PID: ${pid})...`);
        execSync(`kill -9 ${pid}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`[Hook] Port ${port} is now free.`);
  } catch (err) {
    console.log(`[Hook] No process found on port ${port}, continuing...`);
  }
};

const startServer = async () => {
  if (isRestarting) return;
  isRestarting = true;

  fs.writeFileSync(restartFlagPath, "restart");
  await killPort(PORT);

  if (serverProcess) {
    console.log("[Hook] Stopping previous server...");
    serverProcess.kill();
    serverProcess = null;
  }

  serverProcess = exec("node server.js", (error, stdout, stderr) => {
    if (error) console.error(`Error: ${error.message}`);
    if (stderr) console.error(`Stderr: ${stderr}`);
    console.log(stdout);
  });

  serverProcess.stdout.on("data", (data) => console.log(data));
  serverProcess.stderr.on("data", (data) => console.error(data));

  setTimeout(() => {
    isRestarting = false;
  }, 2000);
};

startServer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ignoredFiles = [".git", "node_modules"];
const ignoredExtensions = ["~", "lock"];
let pendingRestart = false;

fs.watch(".", { recursive: true }, (eventType, filename) => {
  if (!filename || isRestarting || pendingRestart) return;
  if (ignoredFiles.some((dir) => filename.startsWith(dir))) return;
  if (ignoredExtensions.some((ext) => filename.endsWith(ext))) return;

  console.log(`\n[Hook] Detected change in: ${filename}`);
  pendingRestart = true;
  rl.question("Do you want to restart the server? (y/n): ", (answer) => {
    if (answer.toLowerCase() === "y") {
      console.log("[Hook] Restarting server...\n");
      startServer();
    } else {
      console.log("[Hook] Restart canceled. Continuing...");
    }
    pendingRestart = false;
  });
});
