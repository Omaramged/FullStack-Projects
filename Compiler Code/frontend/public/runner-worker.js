const PYODIDE_VERSION = "0.28.0";
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/";

let pyodidePromise = null;

function format(value) {
  if (typeof value === "string") return value;
  if (value === undefined) return "undefined";

  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
}

async function runJavaScript(code) {
  const start = Date.now();

  console.log = (...args) => {
    self.postMessage({ type: "stdout", text: args.map(format).join(" ") });
  };
  console.error = (...args) => {
    self.postMessage({ type: "stderr", text: args.map(format).join(" ") });
  };
  console.warn = (...args) => {
    self.postMessage({ type: "stderr", text: args.map(format).join(" ") });
  };

  try {
    const fn = new Function(code);
    const result = fn();

    if (result && typeof result.then === "function") {
      await result;
    }

    self.postMessage({ type: "done", exitCode: 0, durationMs: Date.now() - start });
  } catch (err) {
    self.postMessage({
      type: "stderr",
      text: err && err.stack ? err.stack : String(err),
    });
    self.postMessage({ type: "done", exitCode: 1, durationMs: Date.now() - start });
  }
}

function loadPyodideOnce() {
  if (!pyodidePromise) {
    self.postMessage({
      type: "status",
      text: "Loading the Python runtime (the first run can take a few seconds)...",
    });

    importScripts(PYODIDE_URL + "pyodide.js");
    pyodidePromise = loadPyodide({ indexURL: PYODIDE_URL });
  }

  return pyodidePromise;
}

async function runPython(code) {
  const start = Date.now();

  try {
    const pyodide = await loadPyodideOnce();

    pyodide.setStdout({ batched: (text) => self.postMessage({ type: "stdout", text }) });
    pyodide.setStderr({ batched: (text) => self.postMessage({ type: "stderr", text }) });

    await pyodide.runPythonAsync(code);

    self.postMessage({ type: "done", exitCode: 0, durationMs: Date.now() - start });
  } catch (err) {
    self.postMessage({
      type: "stderr",
      text: err && err.message ? err.message : String(err),
    });
    self.postMessage({ type: "done", exitCode: 1, durationMs: Date.now() - start });
  }
}

self.onmessage = async (event) => {
  const { language, code } = event.data;

  if (language === "python") {
    await runPython(code);
  } else {
    await runJavaScript(code);
  }
};
