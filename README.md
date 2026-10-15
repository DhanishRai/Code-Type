# ⌨️ Code Type

**Type real code. Not random words.**

Code Type is a MonkeyType/Keybr-style typing practice platform — but instead of typing plain English words, you type **real, working code** in Python, JavaScript, C, C++, and Java. It's built for developers, students, and anyone who wants their typing speed to actually translate into faster, more accurate coding.

The interface is fully themeable (9 built-in "ultra" visual themes with animated glowing backgrounds and a drifting particle field of code glyphs), highly customizable (fonts, cursor styles, sounds, line numbers, and more), and works completely standalone in the browser — or connected to its own backend for persistent history and a global leaderboard.

---

## ✨ Features

- **Real code, not gibberish** — every snippet is valid, runnable code covering common patterns: loops, functions, classes, recursion, data structures, decorators, regex, generics, async/await, templates, and more.
- **5 languages** — Python 🐍, JavaScript 🟨, C 🔧, C++ ➕, Java ☕.
- **Adjustable difficulty slider (1–5)** — as difficulty rises, snippets get longer and denser with special characters: more brackets, operators, decorators, generics, lambdas, regex, and nested logic. Difficulty 1 ("Novice") is beginner-friendly; Difficulty 5 ("Hacker") throws real production-grade complexity at you.
- **3 practice modes**
  - 📄 **Single Snippet** — one snippet, start to finish.
  - ⏱️ **Timed (60s)** — type as much code as you can in 60 seconds.
  - 🏃 **Marathon** — three snippets back-to-back.
- **Live stats** — WPM, raw WPM, accuracy, elapsed time, and error count update in real time as you type.
- **Post-test results screen** with a WPM-over-time graph, and the option to save your score to the leaderboard.
- **9 wild built-in themes** — Cyberpunk, Synthwave, Matrix, Dracula, Sunset, Ocean, Galaxy, Lava, and a calmer Daylight mode. Each theme re-skins the entire UI: gradients, glows, particle colors, and syntax feedback colors.
- **Deep customization** — font family & size, cursor style (block / line / underline), smooth caret animation, blinking cursor, toggleable line numbers, toggleable syntax coloring, toggleable background particles, screen-shake on error, and optional keystroke/error sounds (generated live with the Web Audio API — no audio files needed).
- **Smart indentation** — press `Tab` to auto-fill a run of indentation spaces at once, just like a real code editor.
- **Local-first & resilient** — all settings and test history are saved to `localStorage`. If the backend isn't running, the app automatically falls back to a bundled local snippet bank so it's *always* fully functional.
- **Personal stats dashboard** — best WPM, average WPM, average accuracy, and your last 30 tests.
- **Global leaderboard** (when connected to the backend) — filterable by language and difficulty.
- **Fully responsive** — works on desktop and mobile.

---

## 📁 Project Structure

```
Code Type/
├── frontend/                  # Static frontend — no build step required
│   ├── index.html
│   ├── css/
│   │   ├── style.css          # Layout, components, animations
│   │   └── themes.css         # All 9 theme color palettes (CSS variables)
│   └── js/
│       ├── app.js             # Core app logic: typing engine, stats, settings, API calls
│       ├── particles.js       # Animated canvas particle background
│       └── snippets.js        # Local fallback snippet bank (offline mode)
│
├── backend/                   # Express.js REST API
│   ├── server.js              # App entry point
│   ├── package.json
│   ├── routes/
│   │   ├── snippets.js
│   │   └── results.js
│   ├── controllers/
│   │   ├── snippetController.js
│   │   └── resultController.js
│   └── data/
│       ├── python.js          # Snippet bank, difficulty 1–5
│       ├── javascript.js
│       ├── c.js
│       ├── cpp.js
│       ├── java.js
│       ├── index.js           # Aggregates all languages
│       └── results.json       # Auto-created — stores saved test results
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Run the backend (optional, but enables the leaderboard + shared snippet bank)

```bash
cd backend
npm install
npm start
```

The API will start at **http://localhost:5000**. You should see:

```
🚀 Code Type API server running at http://localhost:5000
```

### 2. Open the frontend

The frontend is plain HTML/CSS/JS — no build step, no bundler. Just open it:

```bash
cd frontend
# Easiest: open index.html directly in your browser, OR serve it locally:
npx serve .
# or
python3 -m http.server 8080
```

Then visit the printed URL (e.g. `http://localhost:8080` or `http://localhost:3000`).

> **Note:** The frontend works fine even if you skip step 1 — it automatically detects that the backend is unreachable and switches to its bundled offline snippet bank. You'll just miss out on the global leaderboard and won't be able to persist scores server-side.

### 3. Point the frontend at your backend (if needed)

If your backend isn't running on `http://localhost:5000`, open the **Settings** tab in the app and update the **Backend URL** field, then click **Save Settings**.

---

## 🎮 How to Use

1. Pick a **language** and drag the **difficulty slider** (1 = Novice, 5 = Hacker).
2. Choose a **mode**: Single Snippet, Timed, or Marathon.
3. Click into the code area (or just start typing) and type the code exactly as shown.
4. Watch your **WPM, accuracy, time, and errors** update live.
5. Press `Tab` to auto-fill indentation spaces, `Backspace` to correct mistakes, `Esc` to refocus the input.
6. When you finish, check your **results screen** — save your score to the leaderboard if you're connected to the backend.
7. Visit **Stats** to see your personal history, or **Leaderboard** to see how you stack up.
8. Head to **Settings** to pick a theme, tweak fonts/cursor/sound, and set your display name.

---

## 🔌 Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/languages` | List all supported languages and their difficulty levels |
| `GET` | `/api/snippets?language=python&difficulty=3&count=1` | Fetch one or more snippets |
| `GET` | `/api/snippets/random?difficulty=3` | Fetch one random snippet from a random language |
| `POST` | `/api/results` | Save a completed test result (`username`, `wpm`, `accuracy`, `language`, `difficulty`, `time`, `errors`, `rawWpm`) |
| `GET` | `/api/results?username=&limit=` | Fetch recent results, optionally filtered by user |
| `GET` | `/api/leaderboard?language=&difficulty=&limit=` | Fetch the top scores, optionally filtered |

Results are persisted to `backend/data/results.json` (auto-created, capped at the most recent 500 entries).

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3 (custom properties for theming), and JavaScript (ES6+) — zero build tooling, zero frontend dependencies. Visuals powered by a hand-rolled `<canvas>` particle system and the Web Audio API for sound effects.
- **Backend:** Node.js + Express, with a simple JSON-file-backed results store. CORS-enabled for easy local development.

---

## 🧩 Extending Code Type

- **Add a new language:** create `backend/data/<language>.js` following the existing files' shape (`{ 1: [...], 2: [...], ..., 5: [...] }`), register it in `backend/data/index.js`, then add a matching `<option>` in the frontend's language `<select>` elements and an entry in `FILE_EXT` inside `frontend/js/app.js`.
- **Add a new theme:** add a new `[data-theme="yourtheme"] { ... }` block to `frontend/css/themes.css` (copy an existing block as a template) and register it in the `THEMES` array at the top of `frontend/js/app.js`.
- **Add more snippets:** just append more strings to any difficulty array in the `backend/data/*.js` files.

---

## 📄 License

MIT — do whatever you'd like with it. Have fun, and type fast. ⚡
