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

  let targetText = "";
  let lastCodeSnippet = "";
  let lastEnglishSample = "";
  let testRequestId = 0;
  let charStates = []; // 'pending' | 'correct' | 'incorrect'
  let erroredOnce = []; // bool per index, so repeat mistakes at same pos don't double count
  let cursorIndex = 0;
  let charElements = [];

  let testActive = false;
  let testFinished = false;
  let timedBatchLoading = false;
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
    difficultyHelp: $("difficulty-help"),
    modeSelect: $("mode-select"),
    practiceTypeSelect: $("practice-type-select"),
    englishSampleControl: $("english-sample-control"),
    englishSampleSelect: $("english-sample-select"),
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

  async function fetchSnippets(language, difficulty, count, previous = "") {
    try {
      const requestedCount = Math.max(count, Math.min(20, count + 5));
      const url = `${apiBase()}/api/snippets?language=${encodeURIComponent(language)}&difficulty=${difficulty}&count=${requestedCount}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      el.connDot.classList.add("online");
      el.connDot.classList.remove("offline");
      return chooseDifferentItems(data.snippets || [], count, previous);
    } catch {
      el.connDot.classList.add("offline");
      el.connDot.classList.remove("online");
      return fallbackSnippets(language, difficulty, count, previous);
    }
  }

  function fallbackSnippets(language, difficulty, count, previous = "") {
    const bank = window.CodeTypeFallbackSnippets;
    const pool = (bank[language] && bank[language][difficulty]) || bank.python[1];
    return chooseDifferentItems(pool, count, previous);
  }

  function chooseDifferentItems(items, count, previous = "") {
    const shuffled = [...new Set(items)].sort(() => Math.random() - 0.5);
    const chosen = shuffled.filter((item) => item !== previous).slice(0, count);
    if (chosen.length < count) {
      chosen.push(...shuffled.filter((item) => !chosen.includes(item)).slice(0, count - chosen.length));
    }
    while (chosen.length < count && shuffled.length) chosen.push(shuffled[chosen.length % shuffled.length]);
    return chosen;
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
    const targetOpacity = [0.98, 0.96, 0.94, 0.92, 0.9][diff - 1];
    document.documentElement.style.setProperty("--target-opacity", targetOpacity);
    if (currentPracticeType === "code") {
      el.difficultyHelp.textContent = "Higher levels select longer, more advanced code snippets.";
    } else {
      el.difficultyHelp.textContent = "Higher levels select longer, more challenging English text.";
    }
  }

  el.difficultySlider.addEventListener("input", () => {
    currentDifficulty = parseInt(el.difficultySlider.value, 10);
    updateDifficultyBadge(currentDifficulty);
  });
  el.difficultySlider.addEventListener("change", startNewTest);

  el.languageSelect.addEventListener("change", () => {
    currentLanguage = el.languageSelect.value;
    if (currentPracticeType === "code") startNewTest();
  });

  el.modeSelect.addEventListener("change", () => {
    currentMode = el.modeSelect.value;
    startNewTest();
  });

  const ENGLISH_SAMPLES = {
    sentence: [
      ["The sun warmed the quiet garden.", "A small bird landed beside the old stone fountain.", "Maya carried a bright red umbrella through the rain.", "Fresh bread cooled slowly on the kitchen table."],
      ["A curious mind learns something new every day.", "Careful practice turns small improvements into lasting skills.", "The hikers followed a narrow trail beyond the river.", "Clear notes make complicated ideas easier to remember."],
      ["Although progress may seem gradual, consistent practice strengthens both focus and confidence.", "Because each experiment revealed a different result, the researchers revised their original explanation.", "The committee compared several proposals before choosing a practical and affordable solution.", "Whenever unexpected problems arise, patient analysis can reveal opportunities hidden within the challenge."],
      ["When challenges appear unexpectedly, a calm approach helps us examine each detail and choose a thoughtful response.", "Despite receiving conflicting reports, the coordinator carefully verified every claim before announcing the final decision.", "As the deadline approached, the team reorganized its priorities without sacrificing the quality of the finished work.", "Unless new evidence changes the situation, the engineers will continue testing the revised design under realistic conditions."],
      ["Reliable progress rarely arrives by accident; it grows from deliberate attention, thoughtful reflection, and the willingness to improve after every attempt.", "Although the initial results appeared conclusive, a closer examination exposed several assumptions that required further investigation.", "The most persuasive explanation accounts for contradictory evidence rather than dismissing observations that complicate its central argument.", "By distinguishing measurable outcomes from personal impressions, the analysts produced recommendations that were both transparent and reproducible."]
    ],
    paragraph: [
      ["Every day offers a chance to learn. Stay curious, take your time, and keep going.", "A good routine makes busy mornings easier. Pack your bag, check the weather, and leave with enough time to enjoy the walk.", "The library was quiet after lunch. A student found a book, chose a sunny seat, and began to read.", "Cooking together can make an ordinary evening special. We shared the work, tried a new recipe, and saved a slice for tomorrow."],
      ["Every day offers a small chance to make progress. Read carefully, focus on each word, and keep a steady rhythm. With practice, accuracy becomes natural and confidence grows.", "A community garden brings neighbors together. They prepare the soil, share tools, and learn which plants thrive in each season. Their harvest is useful, but the friendships they build are just as valuable.", "Before a long walk, check your map and bring water. A steady pace helps you enjoy the scenery without becoming tired too quickly. Even a short trip can feel like an adventure when you notice the details along the way.", "Keeping a notebook is a simple way to organize new ideas. Write down questions, record useful observations, and review your notes at the end of the week. Small details often become more meaningful after you have had time to think."],
      ["Learning a new skill takes patience and attention. At first, each step may feel unfamiliar, but regular practice makes difficult tasks easier. Notice what works, learn from mistakes, and celebrate steady improvement.", "When a neighborhood plans a shared event, clear communication helps everyone contribute. Volunteers divide the tasks, confirm the schedule, and prepare for unexpected changes. The event succeeds because people combine different skills and remain willing to help.", "Scientists often begin with a question that can be tested through observation. They collect measurements, compare results, and repeat procedures to check for mistakes. If the evidence disagrees with an early idea, they revise the explanation rather than changing the facts.", "A useful travel plan leaves room for both preparation and discovery. Travelers check local conditions, learn a few familiar phrases, and keep important information nearby. At the same time, an unplanned conversation or quiet side street can become the most memorable part of the journey."],
      ["A thoughtful reader does more than recognize individual words; they follow how ideas connect, notice subtle changes in tone, and pause when a sentence deserves closer attention. This careful rhythm improves both understanding and accuracy. They compare evidence, question assumptions, and revise conclusions when new information emerges.", "A successful team does not avoid disagreement; it creates a fair way to examine competing ideas. Members explain their reasoning, ask specific questions, and separate criticism of a proposal from criticism of its author. Once the strongest evidence is visible, the group can make a decision and clearly explain its tradeoffs.", "Maintaining a historic building requires more than replacing worn materials. Specialists study old records, inspect the structure, and identify which features carry cultural significance. Their recommendations must balance safety, cost, accessibility, and respect for the craftsmanship that gives the place its character.", "A public report is most useful when its conclusions can be traced to reliable evidence. Writers define the scope, explain how information was gathered, and acknowledge uncertainty where the data is incomplete. This transparency lets readers assess the findings and understand which questions remain unresolved."],
      ["Meaningful progress depends on more than repetition: it requires observation, honest evaluation, and the flexibility to adjust an approach when circumstances change. By balancing persistence with reflection, we turn small discoveries into durable knowledge and communicate our ideas with greater precision. Even when evidence is incomplete or contradictory, careful reasoning helps separate what is known from what is merely assumed, allowing a better decision to emerge.", "When a complex system behaves unpredictably, an effective investigation begins by distinguishing verified observations from interpretations. Researchers document the conditions, test one explanation at a time, and preserve results that challenge their expectations. This disciplined process may take longer than guessing, but it makes the eventual conclusion more trustworthy and easier for others to reproduce.", "Public decisions often involve competing priorities that cannot all be maximized at once. A responsible analysis identifies who benefits, who bears the costs, and which assumptions could change the outcome. By explaining uncertainty alongside measurable evidence, decision makers can defend their choices without suggesting that difficult tradeoffs have simple or universally agreeable answers.", "Historical accounts become more reliable when authors examine sources created for different audiences and purposes. A letter, a government record, and a later interview may describe the same event from sharply different perspectives. Comparing their omissions as well as their claims helps readers understand how memory, authority, and context influence the stories societies choose to preserve."]
    ]
  };

  function getEnglishSamples(count, previous = lastEnglishSample) {
    const samples = ENGLISH_SAMPLES[el.englishSampleSelect.value];
    const available = [...samples[currentDifficulty - 1]];
    const chosen = [];
    while (chosen.length < count && available.length) {
      const eligible = available.filter((sample) => sample !== previous);
      const choices = eligible.length ? eligible : available;
      const sample = choices[Math.floor(Math.random() * choices.length)];
      chosen.push(sample);
      available.splice(available.indexOf(sample), 1);
      previous = sample;
    }
    while (chosen.length < count) chosen.push(chosen[chosen.length % chosen.length]);
    return chosen;
  }

  function updatePracticeControls() {
    currentPracticeType = el.practiceTypeSelect.value;
    const isCode = currentPracticeType === "code";
    if (isCode) currentLanguage = el.languageSelect.value;
    el.restartBtn.textContent = isCode ? "⟲ Restart snippet (Tab)" : "⟲ Repeat English text (Tab)";
    updateDifficultyBadge(currentDifficulty);
    el.languageControl.classList.toggle("hidden", !isCode);
    el.englishSampleControl.classList.toggle("hidden", isCode);
  }

  el.practiceTypeSelect.addEventListener("change", () => {
    updatePracticeControls();
    startNewTest();
  });
  el.englishSampleSelect.addEventListener("change", () => {
    if (currentPracticeType === "english") startNewTest();
  });
  /* ============ TYPING ENGINE ============ */
  async function startNewTest() {
    const requestId = ++testRequestId;
    const practiceType = currentPracticeType;
    const language = el.languageSelect.value;
    const difficulty = currentDifficulty;
    const mode = currentMode;

    stopTimer();
    resetLiveStats();
    el.resultsOverlay.classList.add("hidden");

    let snippetCount = 1;
    if (mode === "marathon") snippetCount = 3;
    if (mode === "timed") snippetCount = 4;

    let snippets;
    if (practiceType === "code") {
      el.codeContent.innerHTML = `<span class="loading-msg">Loading snippet…</span>`;
      snippets = await fetchSnippets(language, difficulty, snippetCount, lastCodeSnippet);
      lastCodeSnippet = snippets[snippets.length - 1] || lastCodeSnippet;
    } else {
      const englishRoundCount = mode === "marathon" ? 3 : mode === "timed" ? 4 : 1;
      snippets = getEnglishSamples(englishRoundCount);
      lastEnglishSample = snippets[snippets.length - 1] || lastEnglishSample;
    }
    if (requestId !== testRequestId) return;

    targetText = snippets.join("\n\n");
    timedModeSecondsLeft = 60;
    marathonSnippetsRemaining = mode === "marathon" ? snippets.length : 0;

    charStates = new Array(targetText.length).fill("pending");
    erroredOnce = new Array(targetText.length).fill(false);
    cursorIndex = 0;
    testActive = false;
    testFinished = false;
    timedBatchLoading = false;
    testStartTime = null;
    totalKeystrokes = 0;
    totalErrors = 0;
    wpmHistory = [];
    elapsedSeconds = 0;

    currentLanguage = practiceType === "code" ? language : "English";
    el.chromeFilename.textContent = practiceType === "code"
      ? `snippet.${FILE_EXT[language] || "txt"}`
      : "english-practice.txt";
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
      if (currentMode === "timed") elapsedSeconds = Math.min(60, elapsedSeconds);
      const stats = computeStats();
      updateLiveStatsDisplay(stats.wpm, stats.accuracy, elapsedSeconds, totalErrors);
      wpmHistory.push({ t: Math.round(elapsedSeconds), wpm: stats.wpm });

      if (currentMode === "timed") {
        timedModeSecondsLeft = Math.max(0, 60 - elapsedSeconds);
        if (timedModeSecondsLeft <= 0) {
          elapsedSeconds = 60;
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
    if (testFinished) return;
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
      if (currentMode === "timed") appendTimedSnippets();
      else finishTest();
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
    if (cursorIndex >= targetText.length) {
      if (currentMode === "timed") appendTimedSnippets();
      else finishTest();
    }
    return true;
  }

  async function appendTimedSnippets() {
    if (timedBatchLoading || testFinished || currentMode !== "timed") return;
    timedBatchLoading = true;
    const requestId = testRequestId;
    try {
      const snippets = currentPracticeType === "code"
        ? await fetchSnippets(currentLanguage, currentDifficulty, 1, lastCodeSnippet)
        : getEnglishSamples(1);
      if (requestId !== testRequestId || testFinished || currentMode !== "timed") return;
      const addition = `\n\n${snippets.join("\n\n")}`;
      if (currentPracticeType === "code") lastCodeSnippet = snippets[snippets.length - 1] || lastCodeSnippet;
      else lastEnglishSample = snippets[snippets.length - 1] || lastEnglishSample;
      targetText += addition;
      charStates.push(...new Array(addition.length).fill("pending"));
      erroredOnce.push(...new Array(addition.length).fill(false));
      renderCode();
    } finally {
      timedBatchLoading = false;
    }
  }

  function shakeArena() {
    if (!settings.shakeOnError) return;
    el.arena.classList.remove("shake");
    void el.arena.offsetWidth; // reflow to restart animation
    el.arena.classList.add("shake");
  }

  function finishTest() {
    if (testFinished) return;
    testFinished = true;
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
