# Code Type

Code Type is a typing practice app for people who write code. Instead of typing ordinary sentences, you practice with code snippets in Python, JavaScript, C, C++, and Java.

Choose a language, difficulty, and practice mode. The app shows your typing speed and accuracy while you type. It can run without the backend; starting the backend adds shared snippets and a global leaderboard.

## Features

- Practice with five programming languages and five difficulty levels, or choose English typing and custom text.
- Paste or upload plain-text/code files in any language, then repeat the same text as often as you like.
- Choose a short English sentence or paragraph, or edit the sample before practicing.
- Adjust difficulty for all practice types: code difficulty selects snippet complexity, while higher levels make any target text fainter without changing its content.
- Choose Single Snippet, Timed (60 seconds), or Marathon (three snippets) mode.
- See your words per minute (WPM), accuracy, elapsed time, and errors.
- View your personal statistics and recent test history.
- Choose from nine themes and customize the typing display.
- Save settings and personal history in your browser.
- Use the optional backend to save scores and view a global leaderboard.
- Keep practicing if the backend is unavailable; the app has a local collection of snippets.

## Technology stack

| Part | Technologies | Purpose |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | The web page, design, typing practice, and browser storage |
| Backend | Node.js, Express.js | Provides the API for snippets, scores, and the leaderboard |
| Data storage | JSON files and browser `localStorage` | The backend saves scores in a JSON file; the browser saves personal settings and history |
| Other backend package | CORS | Allows the frontend to make requests to the backend during local development |

The frontend does not need a build step or frontend packages. The backend uses Express and CORS; Nodemon is available for development.

## Requirements

- A modern web browser
- Node.js 16 or later and npm (only needed to run the backend)

## Run the app

### 1. Start the backend (optional)

Open a terminal in the project folder and run:

```bash
cd backend
npm install
npm start
```

The API runs at `http://localhost:5000`. Keep this terminal open while using the backend features.

To restart the backend automatically when you change its code, run `npm run dev` instead of `npm start`.

### 2. Open the frontend

In another terminal, from the project folder, run:

```bash
cd frontend
npx serve .
```

Open the local address printed in the terminal. You can also use another static file server or open `frontend/index.html` directly in a browser.

The app works without starting the backend. Without it, snippets come from the browser's bundled collection, and global score saving and the leaderboard are unavailable. Your personal settings and history remain stored in your browser.

If your backend uses a different address, open **Settings** in the app and change **Backend URL**.

## How to practice

1. Choose **Code snippets**, **English typing**, or **My text or code** in the Practice selector.
2. For custom practice, paste text or upload a plain-text/code file. For English, select a sentence or paragraph; either text can be edited.
3. Select a practice mode and choose **New Test**.
4. Adjust **Difficulty** as desired. For pasted/uploaded text and English, higher difficulty fades the target more while keeping the same text.
5. Click the typing area or start typing the displayed text. Choose **Repeat this text** (or press Tab) to practice the same custom text again.
6. Check your speed, accuracy, time, and errors as you type.
7. When the test ends, review your results. Save the score if the backend is running.
8. Open **Stats** to view your personal history, or **Leaderboard** for saved scores.

Custom text is kept in browser storage and is not uploaded to the backend. No application-level length limit is imposed; extremely large files may still be limited by available browser memory.

Use **Settings** to change the theme and typing display. The app also includes keyboard shortcuts shown below the typing area.

## API overview

The backend provides these endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Check that the API is running |
| `GET` | `/api/languages` | List supported languages and difficulty levels |
| `GET` | `/api/snippets?language=python&difficulty=3&count=1` | Get snippets for a language and difficulty |
| `GET` | `/api/snippets/random?difficulty=3` | Get a snippet from a randomly selected language |
| `POST` | `/api/results` | Save a score; `wpm` and `accuracy` are required numbers |
| `GET` | `/api/results?username=Alex&limit=20` | Get recent scores, optionally filtered by username |
| `GET` | `/api/leaderboard?language=python&difficulty=3&limit=10` | Get top scores, optionally filtered by language and difficulty |

Saved backend scores are stored in `backend/data/results.json`. The backend creates this file when it saves the first score and keeps up to 500 recent scores.

## Project structure

```text
Code Type/
├── frontend/
│   ├── index.html             # Main web page
│   ├── css/                   # Layout, styles, and themes
│   └── js/                    # Typing app, animation, and offline snippets
├── backend/
│   ├── server.js              # Starts the API server
│   ├── routes/                # API endpoint definitions
│   ├── controllers/           # API request handling
│   └── data/                  # Snippet collections and saved scores
└── README.md
```

## Adding snippets

Snippet collections are in `backend/data/`, grouped by language and difficulty. Add a snippet to the appropriate difficulty list. The frontend also has local fallback snippets in `frontend/js/snippets.js` for offline use.
