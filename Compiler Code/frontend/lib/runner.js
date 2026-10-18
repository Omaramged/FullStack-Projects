const RUN_TIMEOUT_MS = 15000;

export function runInBrowser(language, code, onStatus) {
  return new Promise((resolve) => {
    const worker = new Worker("/runner-worker.js");
    const stdout = [];
    const stderr = [];
    let finished = false;

    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      worker.terminate();

      resolve({
        output: stdout.join("\n"),
        stderr: stderr.join("\n"),
        exitCode: null,
        durationMs: RUN_TIMEOUT_MS,
        timedOut: true,
      });
    }, RUN_TIMEOUT_MS);

    function finish(result) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();

      resolve({
        output: stdout.join("\n"),
        stderr: stderr.join("\n"),
        exitCode: result.exitCode === undefined ? 0 : result.exitCode,
        durationMs: result.durationMs || 0,
        timedOut: false,
      });
    }

    worker.onmessage = (event) => {
      const message = event.data;

      if (message.type === "stdout") {
        stdout.push(message.text);
      } else if (message.type === "stderr") {
        stderr.push(message.text);
      } else if (message.type === "status") {
        if (onStatus) onStatus(message.text);
      } else if (message.type === "done") {
        finish(message);
      }
    };

    worker.onerror = (event) => {
      stderr.push(
        event.message ||
          "Could not start the code runner. Check that frontend/public/runner-worker.js exists and reload the page."
      );
      finish({ exitCode: 1, durationMs: 0 });
    };

    worker.postMessage({ language, code });
  });
}
