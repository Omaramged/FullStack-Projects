# Compiler Code — Frontend

Next.js (App Router) + Tailwind CSS frontend for the Compiler Code workspace.

## Scripts

```bash
npm install    # install dependencies
npm run dev    # development server on http://localhost:3000
npm run build  # production build
npm start      # serve the production build
```

## Environment variables

Create `.env.local` (an `.env.example` is included):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

`NEXT_PUBLIC_API_URL` must point at the Express API from the `backend` folder.

## Pages

| Route           | What it does                                                      |
| --------------- | ----------------------------------------------------------------- |
| `/`             | Landing page: hero, features, how it works, supported languages    |
| `/login`        | Sign in                                                           |
| `/register`     | Create an account                                                 |
| `/dashboard`    | Project list with search, filters, sorting and project actions     |
| `/editor/[id]`  | The workspace: file explorer, editor tabs, console                |

## Workspace

- **File explorer** (left): create files and folders, rename and delete, open files.
- **Tabs** (top of the editor): switch between open files, close them, unsaved dot indicator.
- **Editor**: Monaco with syntax highlighting, folding, bracket matching and search.
- **Console** (bottom): output, errors, exit code, duration, clear and copy.

Toolbar actions: back to dashboard, explorer toggle, save status, Save, Run, theme toggle,
editor settings. The explorer becomes a drawer on small screens.

## Keyboard shortcuts

| Shortcut      | Action                     |
| ------------- | -------------------------- |
| `Ctrl+S`      | Save all changed files     |
| `Ctrl+Enter`  | Save and run the code      |

## How data flows

`lib/api.js` holds the small `api()` helper. It reads `NEXT_PUBLIC_API_URL`, attaches the
stored token as `Authorization: Bearer ...` and turns failed responses into thrown errors with
the server message. Pages catch those errors and show them (form errors, banners, alerts, or in
the console panel).

Session data (`token` and the current `user`) is kept in `localStorage`. If the API answers
`401`, the helper clears it and sends you back to `/login`.

## Running code

The Run button does not call the API. `lib/runner.js` starts the Web Worker in
`public/runner-worker.js` for each run:

- JavaScript is executed in the worker with `console.log`/`error` sent back as output.
- Python is executed with Pyodide, which is downloaded from a CDN on the first Python run.
- Every run is stopped after 15 seconds and the worker is closed, so nothing is left running.

## Notes

- Monaco is loaded per visit to a `/editor` page only, not on the landing page.
- Theme is stored under the `theme` key, editor preferences under `editorSettings`.
- Editor settings: font size, word wrap, minimap, line numbers.
- The first Python run needs internet access to load the Pyodide runtime.
