const PISTON_API_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston";

const SUPPORTED_LANGUAGES = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
};

async function runCode(req, res) {
  const { language, code } = req.body;

  const config = SUPPORTED_LANGUAGES[language];

  if (!config) {
    return res.status(400).json({ error: "This language is not supported" });
  }

  if (!code && code !== "") {
    return res.status(400).json({ error: "There is no code to run" });
  }

  if (code.length > 100000) {
    return res.status(400).json({ error: "Code is too big to run (100KB max)" });
  }

  try {
    const start = Date.now();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(PISTON_API_URL + "/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [{ content: code }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (response.status === 401 || response.status === 403) {
      return res.status(503).json({
        error:
          "Code execution is not configured. The public runner now requires a whitelist. " +
          "Start your own Piston instance and set PISTON_API_URL in backend/.env.",
      });
    }

    if (!response.ok) {
      if (response.status === 429) {
        return res
          .status(429)
          .json({ error: "Too many requests right now, please wait a few seconds and run again" });
      }

      return res.status(502).json({ error: "The code runner is not available right now" });
    }

    const result = await response.json();

    const output = result.run ? result.run.output : "";
    const stderr = result.run ? result.run.stderr : "";
    const exitCode = result.run ? result.run.code : null;
    const compileError = result.compile ? result.compile.output : "";

    res.json({
      output,
      stderr,
      compileError,
      exitCode,
      durationMs: Date.now() - start,
      timeout: false,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      return res.status(504).json({
        error: "The code took too long and was stopped after 15 seconds",
        timeout: true,
      });
    }

    res.status(502).json({
      error: "Could not reach the code runner. Check that it is running and that PISTON_API_URL is correct.",
    });
  }
}

module.exports = { runCode };
