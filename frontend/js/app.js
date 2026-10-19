/* =========================================================
   CODE TYPE — main application script
   ========================================================= */

(function () {
  "use strict";
  /* ============ CONSTANTS ============ */
  const THEMES = [
    { key: "cyberpunk", name: "Cyberpunk", colors: ["#ff2e97", "#00f6ff"] },
    { key: "synthwave", name: "Synthwave", colors: ["#ff5fac", "#01e8e8"] },
    { key: "matrix", name: "Matrix", colors: ["#00ff6a", "#003c1a"] },
    { key: "dracula", name: "Dracula", colors: ["#ff79c6", "#8be9fd"] },
    { key: "sunset", name: "Sunset", colors: ["#ff7849", "#ff4e83"] },
    { key: "ocean", name: "Ocean", colors: ["#29e7cd", "#2b8fff"] },
    { key: "galaxy", name: "Galaxy", colors: ["#c77dff", "#7de8ff"] },
    { key: "lava", name: "Lava", colors: ["#ff4500", "#ffae00"] },
    { key: "daylight", name: "Daylight", colors: ["#4361ee", "#3a86ff"] }
  ];

  const DIFF_LABELS = {
    1: "Novice",
    2: "Apprentice",
    3: "Coder",
    4: "Engineer",
    5: "Hacker"
  };

  const FILE_EXT = { python: "py", javascript: "js", c: "c", cpp: "cpp", java: "java" };

  const DEFAULT_SETTINGS = {
    theme: "cyberpunk",
    font: "'JetBrains Mono', monospace",
    fontSize: 18,
    cursorStyle: "block",
    smoothCaret: true,
    blink: true,
    showLineNumbers: true,
    syntaxColors: true,
    particles: true,
    shakeOnError: true,
    keySound: false,
    errorSound: true,
    username: "",
    backendUrl: "http://localhost:5000"
  };

  const LS_SETTINGS = "codetype_settings_v1";
  const LS_HISTORY = "codetype_history_v1";

  /* ============ STATE ============ */
  let settings = loadSettings();
  let history = loadHistory();

  let currentLanguage = "python";
  let currentDifficulty = 1;
  let currentMode = "snippet";
  let currentPracticeType = "code";
  let customTextFilename = "custom.txt";

  let targetText = "";
  let charStates = []; // 'pending' | 'correct' | 'incorrect'
  let erroredOnce = []; // bool per index, so repeat mistakes at same pos don't double count
  let cursorIndex = 0;
  let charElements = [];

  let testActive = false;
  let testStartTime = null;
  let testEndTime = null;
  let totalKeystrokes = 0;
  let totalErrors = 0;
  let timerInterval = null;
  let wpmHistory = []; // {t, wpm}
  let elapsedSeconds = 0;

  let timedModeSecondsLeft = 60;
  let marathonSnippetsRemaining = 0;
  let audioCtx = null;

  /* ============ DOM REFS ============ */
  const $ = (id) => document.getElementById(id);

  const el = {
    body: document.body,
    navBtns: document.querySelectorAll(".nav-btn"),
    views: document.querySelectorAll(".view"),
    connDot: $("connection-dot"),
    themeToggleBtn: $("theme-toggle-btn"),

    languageSelect: $("language-select"),
    languageControl: $("language-control"),
    difficultySlider: $("difficulty-slider"),
    difficultyBadge: $("difficulty-badge"),
    difficultyControl: $("difficulty-control"),
    modeSelect: $("mode-select"),
    practiceTypeSelect: $("practice-type-select"),
    textSourcePanel: $("text-source-panel"),
    textSourceTitle: $("text-source-title"),
    textSourceHelp: $("text-source-help"),
    englishSampleControl: $("english-sample-control"),
    englishSampleSelect: $("english-sample-select"),
    practiceTextInput: $("practice-text-input"),
    practiceFileInput: $("practice-file-input"),
    practiceTextStatus: $("practice-text-status"),
    newTestBtn: $("new-test-btn"),
    restartBtn: $("restart-btn"),

    liveWpm: $("live-wpm"),
    liveAcc: $("live-acc"),
    liveTime: $("live-time"),
    liveErrors: $("live-errors"),

    arena: $("typing-arena"),
    chromeFilename: $("chrome-filename"),
    capsWarning: $("caps-warning"),
    codeScroll: $("code-scroll"),
    lineNumbers: $("line-numbers"),
    codeContent: $("code-content"),
    hiddenInput: $("hidden-input"),
    focusOverlay: $("focus-overlay"),

    resultsOverlay: $("results-overlay"),
    resWpm: $("res-wpm"),
    resRaw: $("res-raw"),
    resAcc: $("res-acc"),
    resTime: $("res-time"),
    resErrors: $("res-errors"),
    resLang: $("res-lang"),
    wpmGraph: $("wpm-graph"),
    saveResultBtn: $("save-result-btn"),
    nextTestBtn: $("next-test-btn"),
    closeResultsBtn: $("close-results-btn"),

    statsSummary: $("stats-summary"),
    historyBody: $("history-body"),
    clearHistoryBtn: $("clear-history-btn"),

    lbLanguageSelect: $("lb-language-select"),
    lbDifficultySelect: $("lb-difficulty-select"),
    refreshLbBtn: $("refresh-lb-btn"),
    leaderboardBody: $("leaderboard-body"),
    lbStatus: $("lb-status"),

    themeSwatches: $("theme-swatches"),
    fontSelect: $("font-select"),
    fontsizeSlider: $("fontsize-slider"),
    fontsizeValue: $("fontsize-value"),
    cursorSelect: $("cursor-select"),
    smoothCaretToggle: $("smooth-caret-toggle"),
    blinkToggle: $("blink-toggle"),
    linenumToggle: $("linenum-toggle"),
    syntaxToggle: $("syntax-toggle"),
    particlesToggle: $("particles-toggle"),
    shakeToggle: $("shake-toggle"),
    soundToggle: $("sound-toggle"),
    errorSoundToggle: $("error-sound-toggle"),
    usernameInput: $("username-input"),
    backendUrlInput: $("backend-url-input"),
    saveSettingsBtn: $("save-settings-btn"),

    toastContainer: $("toast-container")
  };

  /* ============ SETTINGS PERSISTENCE ============ */
  function loadSettings() {
    try {
      const raw = localStorage.getItem(LS_SETTINGS);
      if (!raw) return { ...DEFAULT_SETTINGS };
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function persistSettings() {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(LS_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function persistHistory() {
    localStorage.setItem(LS_HISTORY, JSON.stringify(history.slice(-200)));
  }

  /* ============ TOASTS ============ */
  function toast(msg, ms = 2600) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    el.toastContainer.appendChild(t);
    setTimeout(() => {
      t.classList.add("fade-out");
      setTimeout(() => t.remove(), 300);
    }, ms);
  }

  /* ============ VIEW NAVIGATION ============ */
  function switchView(viewName) {
    el.views.forEach((v) => v.classList.toggle("active", v.id === `view-${viewName}`));
    el.navBtns.forEach((b) => b.classList.toggle("active", b.dataset.view === viewName));
    if (viewName === "stats") renderStatsView();
    if (viewName === "leaderboard") fetchLeaderboard();
  }

  el.navBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  /* ============ THEME ============ */
  function applyTheme(themeKey) {
    settings.theme = themeKey;
    el.body.setAttribute("data-theme", themeKey);
    renderThemeSwatches();
  }

  function renderThemeSwatches() {
    el.themeSwatches.innerHTML = "";
    THEMES.forEach((t) => {
      const div = document.createElement("div");
      div.className = "theme-swatch" + (settings.theme === t.key ? " active" : "");
      div.style.background = `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})`;
      div.innerHTML = `<span>${t.name}</span>`;
      div.addEventListener("click", () => {
        applyTheme(t.key);
        persistSettings();
        toast(`Theme set to ${t.name}`);
      });
      el.themeSwatches.appendChild(div);
    });
  }

  el.themeToggleBtn.addEventListener("click", () => {
    const idx = THEMES.findIndex((t) => t.key === settings.theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next.key);
    persistSettings();
    toast(`Theme: ${next.name}`);
  });

  /* ============ SETTINGS UI SYNC ============ */
  function applySettingsToDOM() {
    document.documentElement.style.setProperty("--font-mono", settings.font);
    document.documentElement.style.setProperty("--font-size", settings.fontSize + "px");

    el.fontSelect.value = settings.font;
    el.fontsizeSlider.value = settings.fontSize;
    el.fontsizeValue.textContent = settings.fontSize + "px";
    el.cursorSelect.value = settings.cursorStyle;
    el.smoothCaretToggle.checked = settings.smoothCaret;
    el.blinkToggle.checked = settings.blink;
    el.linenumToggle.checked = settings.showLineNumbers;
    el.syntaxToggle.checked = settings.syntaxColors;
    el.particlesToggle.checked = settings.particles;
    el.shakeToggle.checked = settings.shakeOnError;
    el.soundToggle.checked = settings.keySound;
    el.errorSoundToggle.checked = settings.errorSound;
    el.usernameInput.value = settings.username;
    el.backendUrlInput.value = settings.backendUrl;

    el.lineNumbers.classList.toggle("hidden", !settings.showLineNumbers);
    if (window.CodeTypeParticles) window.CodeTypeParticles.setEnabled(settings.particles);

    applyTheme(settings.theme);
  }

  function bindSettingsEvents() {
    el.fontSelect.addEventListener("change", () => {
      settings.font = el.fontSelect.value;
      document.documentElement.style.setProperty("--font-mono", settings.font);
    });
    el.fontsizeSlider.addEventListener("input", () => {
      settings.fontSize = parseInt(el.fontsizeSlider.value, 10);
      el.fontsizeValue.textContent = settings.fontSize + "px";
      document.documentElement.style.setProperty("--font-size", settings.fontSize + "px");
    });
    el.cursorSelect.addEventListener("change", () => (settings.cursorStyle = el.cursorSelect.value));
    el.smoothCaretToggle.addEventListener("change", () => (settings.smoothCaret = el.smoothCaretToggle.checked));
    el.blinkToggle.addEventListener("change", () => (settings.blink = el.blinkToggle.checked));
    el.linenumToggle.addEventListener("change", () => {
      settings.showLineNumbers = el.linenumToggle.checked;
      el.lineNumbers.classList.toggle("hidden", !settings.showLineNumbers);
    });
    el.syntaxToggle.addEventListener("change", () => {
      settings.syntaxColors = el.syntaxToggle.checked;
      renderCode();
    });
    el.particlesToggle.addEventListener("change", () => {
      settings.particles = el.particlesToggle.checked;
      if (window.CodeTypeParticles) window.CodeTypeParticles.setEnabled(settings.particles);
    });
    el.shakeToggle.addEventListener("change", () => (settings.shakeOnError = el.shakeToggle.checked));
    el.soundToggle.addEventListener("change", () => (settings.keySound = el.soundToggle.checked));
    el.errorSoundToggle.addEventListener("change", () => (settings.errorSound = el.errorSoundToggle.checked));
    el.usernameInput.addEventListener("input", () => (settings.username = el.usernameInput.value));
    el.backendUrlInput.addEventListener("input", () => (settings.backendUrl = el.backendUrlInput.value.trim()));

    el.saveSettingsBtn.addEventListener("click", () => {
      persistSettings();
      toast("Settings saved ✔");
      checkBackendConnection();
    });
  }

  /* ============ SOUND ============ */
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function playBeep(freq, duration, volume) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  }

  function playKeySound() {
    if (settings.keySound) playBeep(320 + Math.random() * 60, 0.05, 0.03);
  }
  function playErrorSound() {
    if (settings.errorSound) playBeep(120, 0.12, 0.05);
  }

  /* ============ BACKEND API ============ */
  function apiBase() {
    return (settings.backendUrl || DEFAULT_SETTINGS.backendUrl).replace(/\/+$/, "");
  }

  async function checkBackendConnection() {
    try {
      const res = await fetch(apiBase() + "/", { method: "GET", signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        el.connDot.classList.add("online");
        el.connDot.classList.remove("offline");
        el.connDot.title = "Connected to backend";
        return true;
      }
      throw new Error("bad status");
    } catch {
      el.connDot.classList.add("offline");
      el.connDot.classList.remove("online");
      el.connDot.title = "Backend unreachable — using local snippet bank";
      return false;
    }
  }

  async function fetchSnippets(language, difficulty, count) {
    try {
      const url = `${apiBase()}/api/snippets?language=${encodeURIComponent(language)}&difficulty=${difficulty}&count=${count}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      el.connDot.classList.add("online");
      el.connDot.classList.remove("offline");
      return data.snippets;
    } catch {
      el.connDot.classList.add("offline");
      el.connDot.classList.remove("online");
      return fallbackSnippets(language, difficulty, count);
    }
  }

  function fallbackSnippets(language, difficulty, count) {
    const bank = window.CodeTypeFallbackSnippets;
    const pool = (bank[language] && bank[language][difficulty]) || bank.python[1];
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return out;
  }

  async function postResult(entry) {
    try {
      await fetch(apiBase() + "/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
        signal: AbortSignal.timeout(4000)
      });
      return true;
    } catch {
      return false;
    }
  }

  async function fetchLeaderboard() {
    el.lbStatus.textContent = "Loading…";
    const lang = el.lbLanguageSelect.value;
    const diff = el.lbDifficultySelect.value;
    const params = new URLSearchParams();
    if (lang) params.set("language", lang);
    if (diff) params.set("difficulty", diff);
    params.set("limit", "25");

    try {
      const res = await fetch(`${apiBase()}/api/leaderboard?${params.toString()}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      renderLeaderboard(data.leaderboard || []);
      el.lbStatus.textContent = data.leaderboard.length
        ? ""
        : "No scores yet for this filter — be the first!";
    } catch {
      el.leaderboardBody.innerHTML = "";
      el.lbStatus.textContent =
        "⚠ Could not reach backend leaderboard. Start the backend server (see README) to enable global leaderboards.";
    }
  }

  function renderLeaderboard(list) {
    el.leaderboardBody.innerHTML = "";
    list.forEach((r, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(r.username)}</td>
        <td>${r.wpm}</td>
        <td>${r.accuracy}%</td>
        <td>${escapeHtml(r.language)}</td>
        <td>${r.difficulty}</td>
        <td>${new Date(r.createdAt).toLocaleDateString()}</td>
      `;
      el.leaderboardBody.appendChild(tr);
    });
  }

  el.refreshLbBtn.addEventListener("click", fetchLeaderboard);
  el.lbLanguageSelect.addEventListener("change", fetchLeaderboard);
  el.lbDifficultySelect.addEventListener("change", fetchLeaderboard);

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  /* ============ DIFFICULTY UI ============ */
  function updateDifficultyBadge(diff) {
    el.difficultyBadge.textContent = DIFF_LABELS[diff];
    el.difficultyBadge.className = `diff-badge diff-${diff}`;
  }

  el.difficultySlider.addEventListener("input", () => {
    currentDifficulty = parseInt(el.difficultySlider.value, 10);
    updateDifficultyBadge(currentDifficulty);
  });

  el.languageSelect.addEventListener("change", () => {
    currentLanguage = el.languageSelect.value;
  });

  el.modeSelect.addEventListener("change", () => {
    currentMode = el.modeSelect.value;
  });

  const ENGLISH_SAMPLES = {
    sentence: "A curious mind learns something new every day.",
    paragraph: "Every day offers a small chance to make progress. Read carefully, focus on each word, and keep a steady rhythm. With practice, accuracy becomes natural and confidence grows."
  };

  function getSavedCustomText() {
    try {
      return localStorage.getItem("codetype_custom_text_v1") || "";
    } catch {
      return "";
    }
  }

  function saveCustomText(text) {
    try {
      localStorage.setItem("codetype_custom_text_v1", text);
      el.practiceTextStatus.textContent = `${text.length.toLocaleString()} characters ready. Your custom text is saved in this browser.`;
    } catch {
      el.practiceTextStatus.textContent = `${text.length.toLocaleString()} characters ready. Browser storage is full; the text is available until this page is closed.`;
    }
  }

  function updatePracticeControls() {
    currentPracticeType = el.practiceTypeSelect.value;
    const isCode = currentPracticeType === "code";
    const isEnglish = currentPracticeType === "english";
    if (isCode) currentLanguage = el.languageSelect.value;
    el.languageControl.classList.toggle("hidden", !isCode);
    el.difficultyControl.classList.toggle("hidden", !isCode);
    el.textSourcePanel.classList.toggle("hidden", isCode);
    el.englishSampleControl.classList.toggle("hidden", !isEnglish);

    if (isEnglish) {
      el.textSourceTitle.textContent = "English typing practice";
      el.textSourceHelp.textContent = "Choose a sentence or paragraph, or edit the text below. Your selection stays available to repeat.";
      el.practiceTextInput.value = ENGLISH_SAMPLES[el.englishSampleSelect.value];
      el.practiceTextStatus.textContent = "Select a sample or enter your own English text, then start or restart to practice it again.";
    } else if (!isCode) {
      el.textSourceTitle.textContent = "Your text or code";
      el.textSourceHelp.textContent = "Paste text or upload a plain-text source file in any programming language. Restart to practice the same content again.";
      el.practiceTextInput.value = getSavedCustomText();
      el.practiceTextStatus.textContent = el.practiceTextInput.value
        ? `${el.practiceTextInput.value.length.toLocaleString()} characters ready. Your custom text is saved in this browser.`
        : "No length limit is set by the app. Very large files may depend on your browser's available memory.";
    }
  }

  el.practiceTypeSelect.addEventListener("change", updatePracticeControls);
  el.englishSampleSelect.addEventListener("change", () => {
    el.practiceTextInput.value = ENGLISH_SAMPLES[el.englishSampleSelect.value];
    el.practiceTextStatus.textContent = "Sample loaded. Start or restart to practice this text again.";
  });
  el.practiceTextInput.addEventListener("input", () => {
    if (currentPracticeType === "custom") saveCustomText(el.practiceTextInput.value);
    else el.practiceTextStatus.textContent = `${el.practiceTextInput.value.length.toLocaleString()} characters ready.`;
  });
  el.practiceFileInput.addEventListener("change", async () => {
    const file = el.practiceFileInput.files && el.practiceFileInput.files[0];
    if (!file) return;
    try {
      const contents = (await file.text()).replace(/\r\n?/g, "\n");
      customTextFilename = file.name || "custom.txt";
      el.practiceTypeSelect.value = "custom";
      updatePracticeControls();
      el.practiceTextInput.value = contents;
      el.practiceTextStatus.textContent = `Loaded ${file.name} · ${contents.length.toLocaleString()} characters.`;
      saveCustomText(contents);
      toast(`Loaded ${file.name}`);
    } catch {
      toast("Could not read that file as text");
    }
    el.practiceFileInput.value = "";
  });

  /* ============ TYPING ENGINE ============ */
  async function startNewTest() {
    if (currentPracticeType !== "code" && el.practiceTextInput.value.length === 0) {
      toast("Enter or upload some text before starting");
      return;
    }

    stopTimer();
    resetLiveStats();
    el.resultsOverlay.classList.add("hidden");

    let snippetCount = 1;
    if (currentMode === "marathon") snippetCount = 3;
    if (currentMode === "timed") snippetCount = 4;

    let snippets;
    if (currentPracticeType === "code") {
      el.codeContent.innerHTML = `<span class="loading-msg">Loading snippet…</span>`;
      snippets = await fetchSnippets(currentLanguage, currentDifficulty, snippetCount);
    } else {
      snippets = [el.practiceTextInput.value];
      currentLanguage = currentPracticeType === "english" ? "English" : "Custom text";
    }

    targetText = snippets.join("\n\n");
    timedModeSecondsLeft = 60;
    marathonSnippetsRemaining = currentMode === "marathon" ? snippets.length : 0;

    charStates = new Array(targetText.length).fill("pending");
    erroredOnce = new Array(targetText.length).fill(false);
    cursorIndex = 0;
    testActive = false;
    testStartTime = null;
    totalKeystrokes = 0;
    totalErrors = 0;
    wpmHistory = [];
    elapsedSeconds = 0;

    el.chromeFilename.textContent = currentPracticeType === "code"
      ? `snippet.${FILE_EXT[currentLanguage] || "txt"}`
      : currentPracticeType === "english" ? "english-practice.txt" : customTextFilename;
    renderCode();
    updateLiveStatsDisplay(0, 100, 0, 0);
    el.focusOverlay.classList.remove("hidden");
  }

  function renderCode() {
    const frag = document.createDocumentFragment();
    const lines = targetText.split("\n");
    charElements = [];
    el.lineNumbers.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join("<br/>");

    let container = document.createElement("span");
    let globalIndex = 0;

    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      for (let ci = 0; ci < line.length; ci++) {
        const span = document.createElement("span");
        span.className = "char";
        span.dataset.index = globalIndex;
        span.textContent = line[ci];
        container.appendChild(span);
        charElements.push(span);
        globalIndex++;
      }
      if (li < lines.length - 1) {
        const nlSpan = document.createElement("span");
        nlSpan.className = "char newline-char";
        nlSpan.dataset.index = globalIndex;
        nlSpan.textContent = "\u21B5\n"; // visual return arrow + actual newline
        container.appendChild(nlSpan);
        charElements.push(nlSpan);
        globalIndex++;
      }
    }

    frag.appendChild(container);
    el.codeContent.innerHTML = "";
    el.codeContent.appendChild(frag);
    applyCharClasses();
  }

  function updateCharClass(span, i) {
    span.classList.remove("correct", "incorrect", "current", "cursor-block", "cursor-line", "cursor-underline", "blink", "smooth");
    const state = charStates[i];
    if (state === "correct") span.classList.add("correct");
    else if (state === "incorrect") span.classList.add("incorrect");

    if (settings.smoothCaret) span.classList.add("smooth");

    if (i === cursorIndex) {
      span.classList.add("current", `cursor-${settings.cursorStyle}`);
      if (settings.blink) span.classList.add("blink");
    }
  }

  function applyCharClasses(indices) {
    if (indices) {
      indices.forEach((i) => {
        if (charElements[i]) updateCharClass(charElements[i], i);
      });
    } else {
      for (let i = 0; i < charElements.length; i++) updateCharClass(charElements[i], i);
    }
    scrollToCursor();
  }

  function scrollToCursor() {
    const active = el.codeContent.querySelector(".char.current");
    if (active) {
      active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function resetLiveStats() {
    updateLiveStatsDisplay(0, 100, 0, 0);
  }

  function updateLiveStatsDisplay(wpm, acc, time, errors) {
    el.liveWpm.textContent = wpm;
    el.liveAcc.textContent = acc;
    el.liveTime.textContent = time.toFixed(1);
    el.liveErrors.textContent = errors;
  }

  function startTimer() {
    testStartTime = Date.now();
    timerInterval = setInterval(() => {
      elapsedSeconds = (Date.now() - testStartTime) / 1000;
      const stats = computeStats();
      updateLiveStatsDisplay(stats.wpm, stats.accuracy, elapsedSeconds, totalErrors);
      wpmHistory.push({ t: Math.round(elapsedSeconds), wpm: stats.wpm });

      if (currentMode === "timed") {
        timedModeSecondsLeft = Math.max(0, 60 - elapsedSeconds);
        if (timedModeSecondsLeft <= 0) {
          finishTest();
        }
      }
    }, 200);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function computeStats() {
    const minutes = Math.max(elapsedSeconds / 60, 1 / 600); // avoid div by 0
    const correctChars = charStates.filter((s) => s === "correct").length;
    const wpm = Math.round(correctChars / 5 / minutes);
    const rawWpm = Math.round(totalKeystrokes / 5 / minutes);
    const totalAttempts = correctChars + totalErrors;
    const accuracy = totalAttempts > 0 ? Math.round((correctChars / totalAttempts) * 1000) / 10 : 100;
    return { wpm: Math.max(0, wpm), rawWpm: Math.max(0, rawWpm), accuracy: Math.min(100, accuracy) };
  }

  function handleTypedChar(char) {
    if (!testActive) {
      testActive = true;
      startTimer();
    }
    if (cursorIndex >= targetText.length) return;

    totalKeystrokes++;
    const expected = targetText[cursorIndex];

    if (char === expected) {
      charStates[cursorIndex] = "correct";
    } else {
      charStates[cursorIndex] = "incorrect";
      if (!erroredOnce[cursorIndex]) {
        totalErrors++;
        erroredOnce[cursorIndex] = true;
      }
      playErrorSound();
      shakeArena();
    }

    if (charStates[cursorIndex] === "correct") playKeySound();

    cursorIndex++;
    applyCharClasses([cursorIndex - 1, cursorIndex]);

    if (cursorIndex >= targetText.length) {
      finishTest();
    }
  }

  function handleBackspace() {
    if (cursorIndex <= 0) return;
    cursorIndex--;
    charStates[cursorIndex] = "pending";
    applyCharClasses([cursorIndex, cursorIndex + 1]);
  }

  function handleTabAutofill() {
    // auto-fill a contiguous run of spaces at the cursor, like editor indentation
    if (targetText[cursorIndex] !== " ") return false;
    const startIndex = cursorIndex;
    if (!testActive) {
      testActive = true;
      startTimer();
    }
    while (cursorIndex < targetText.length && targetText[cursorIndex] === " ") {
      charStates[cursorIndex] = "correct";
      totalKeystrokes++;
      cursorIndex++;
    }
    for (let i = startIndex; i < cursorIndex; i++) updateCharClass(charElements[i], i);
    if (charElements[cursorIndex]) updateCharClass(charElements[cursorIndex], cursorIndex);
    scrollToCursor();
    if (cursorIndex >= targetText.length) finishTest();
    return true;
  }

  function shakeArena() {
    if (!settings.shakeOnError) return;
    el.arena.classList.remove("shake");
    void el.arena.offsetWidth; // reflow to restart animation
    el.arena.classList.add("shake");
  }

  function finishTest() {
    stopTimer();
    testEndTime = Date.now();
    const stats = computeStats();
    el.focusOverlay.classList.add("hidden");

    const record = {
      username: settings.username || "Anonymous",
      wpm: stats.wpm,
      rawWpm: stats.rawWpm,
      accuracy: stats.accuracy,
      language: currentLanguage,
      difficulty: currentDifficulty,
      time: Math.round(elapsedSeconds),
      errors: totalErrors,
      createdAt: new Date().toISOString()
    };

    history.push(record);
    persistHistory();

    showResults(record);
  }

  function showResults(record) {
    el.resWpm.textContent = record.wpm;
    el.resRaw.textContent = record.rawWpm;
    el.resAcc.textContent = record.accuracy + "%";
    el.resTime.textContent = record.time + "s";
    el.resErrors.textContent = record.errors;
    el.resLang.textContent = record.language;
    el.resultsOverlay.classList.remove("hidden");
    drawWpmGraph();
  }

  function drawWpmGraph() {
    const canvas = el.wpmGraph;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 500;
    canvas.width = cssWidth * dpr;
    canvas.height = 120 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssWidth, 120);

    if (wpmHistory.length < 2) {
      ctx.fillStyle = "#888";
      ctx.font = "13px monospace";
      ctx.fillText("Not enough data to graph (test was too short)", 14, 60);
      return;
    }

    const maxWpm = Math.max(...wpmHistory.map((p) => p.wpm), 10);
    const stepX = cssWidth / (wpmHistory.length - 1);
    const primaryColor = getComputedStyle(document.body).getPropertyValue("--primary").trim() || "#ff2e97";

    ctx.beginPath();
    wpmHistory.forEach((p, i) => {
      const x = i * stepX;
      const y = 110 - (p.wpm / maxWpm) * 100;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.lineTo(cssWidth, 120);
    ctx.lineTo(0, 120);
    ctx.closePath();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /* ============ INPUT HANDLING ============ */
  function focusTyping() {
    el.hiddenInput.focus();
    el.focusOverlay.classList.add("hidden");
  }

  el.focusOverlay.addEventListener("click", focusTyping);
  el.codeScroll.addEventListener("click", focusTyping);

  el.hiddenInput.addEventListener("blur", () => {
    if (targetText && cursorIndex < targetText.length) {
      el.focusOverlay.classList.remove("hidden");
    }
  });

  document.addEventListener("keydown", (e) => {
    // Caps lock warning
    if (typeof e.getModifierState === "function") {
      el.capsWarning.classList.toggle("hidden", !e.getModifierState("CapsLock"));
    }

    const isTypingView = document.getElementById("view-typing").classList.contains("active");
    if (!isTypingView) return;

    // global shortcuts
    if (e.key === "Tab") {
      e.preventDefault();
      const handled = handleTabAutofill();
      if (!handled) startNewTestShortcut();
      return;
    }
    if (e.key === "Escape") {
      focusTyping();
      return;
    }

    // only respond to typing when hidden input is focused (avoid hijacking selects)
    const activeIsSafe =
      document.activeElement === el.hiddenInput ||
      document.activeElement === document.body ||
      document.activeElement === el.codeContent;
    if (!activeIsSafe) return;
    if (!targetText) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      handleBackspace();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleTypedChar("\n");
      return;
    }
    if (e.key.length === 1) {
      e.preventDefault();
      handleTypedChar(e.key);
    }
  });

  function startNewTestShortcut() {
    startNewTest();
  }

  el.newTestBtn.addEventListener("click", startNewTest);
  el.restartBtn.addEventListener("click", startNewTest);
  el.nextTestBtn.addEventListener("click", startNewTest);
  el.closeResultsBtn.addEventListener("click", () => el.resultsOverlay.classList.add("hidden"));

  el.saveResultBtn.addEventListener("click", async () => {
    const last = history[history.length - 1];
    if (!last) return;
    const ok = await postResult(last);
    toast(ok ? "Score saved to leaderboard 🎉" : "Could not reach backend — saved locally only");
  });

  /* ============ STATS VIEW ============ */
  function renderStatsView() {
    if (history.length === 0) {
      el.statsSummary.innerHTML = `<p class="muted-note">No tests taken yet. Go type some code!</p>`;
      el.historyBody.innerHTML = "";
      return;
    }

    const best = history.reduce((a, b) => (b.wpm > a.wpm ? b : a));
    const avgWpm = Math.round(history.reduce((s, r) => s + r.wpm, 0) / history.length);
    const avgAcc = Math.round((history.reduce((s, r) => s + r.accuracy, 0) / history.length) * 10) / 10;
    const totalTests = history.length;

    el.statsSummary.innerHTML = `
      <div class="stat-box"><span class="stat-value">${best.wpm}</span><span class="stat-label">Best WPM</span></div>
      <div class="stat-box"><span class="stat-value">${avgWpm}</span><span class="stat-label">Avg WPM</span></div>
      <div class="stat-box"><span class="stat-value">${avgAcc}%</span><span class="stat-label">Avg Accuracy</span></div>
      <div class="stat-box"><span class="stat-value">${totalTests}</span><span class="stat-label">Tests Taken</span></div>
    `;

    el.historyBody.innerHTML = "";
    [...history].reverse().slice(0, 30).forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${new Date(r.createdAt).toLocaleString()}</td>
        <td>${escapeHtml(r.language)}</td>
        <td>${r.difficulty}</td>
        <td>${r.wpm}</td>
        <td>${r.accuracy}%</td>
        <td>${r.errors}</td>
      `;
      el.historyBody.appendChild(tr);
    });
  }

  el.clearHistoryBtn.addEventListener("click", () => {
    if (!confirm("Clear all local test history? This cannot be undone.")) return;
    history = [];
    persistHistory();
    renderStatsView();
    toast("Local history cleared");
  });

  /* ============ INIT ============ */
  function init() {
    renderThemeSwatches();
    applySettingsToDOM();
    bindSettingsEvents();
    updateDifficultyBadge(currentDifficulty);
    checkBackendConnection();
    startNewTest();

    // periodic silent reconnection check
    setInterval(checkBackendConnection, 15000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
