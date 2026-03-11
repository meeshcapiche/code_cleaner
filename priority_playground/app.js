const STORAGE_KEY = "priority-playground-state-v3";
const MOMENTUM_TARGET = 3;
const BIG_TASK_HINT = /\b(design|build|prepare|create|write|research|draft|launch|strategy|white paper|campaign|analytics|landing page)\b/i;

const rolePresets = {
  marketing: {
    label: "Marketing",
    keywords: {
      impactHigh: ["campaign", "launch", "email", "webinar", "sponsor", "lead", "creative", "send", "report", "partner"],
      importanceHigh: ["launch", "send", "review", "leadership", "partner", "report"],
      effortLow: ["review", "approve", "send", "reply", "share", "update"],
      effortHigh: ["build", "create", "write", "draft", "analyze", "strategy"]
    }
  },
  sales: {
    label: "Sales",
    keywords: {
      impactHigh: ["prospect", "proposal", "renewal", "deal", "demo", "pipeline", "close", "contract"],
      importanceHigh: ["proposal", "renewal", "deal", "contract", "meeting"],
      effortLow: ["follow up", "follow-up", "reply", "send", "check in"],
      effortHigh: ["proposal", "pricing", "demo", "plan", "strategy"]
    }
  },
  operations: {
    label: "Operations",
    keywords: {
      impactHigh: ["blocker", "process", "fix", "system", "issue", "workflow", "escalation"],
      importanceHigh: ["blocker", "escalation", "issue", "request", "workflow"],
      effortLow: ["update", "handoff", "reply", "check", "confirm"],
      effortHigh: ["process", "system", "documentation", "cleanup", "migration"]
    }
  },
  leadership: {
    label: "Leadership",
    keywords: {
      impactHigh: ["budget", "strategy", "roadmap", "hiring", "plan", "decision", "board", "forecast", "priority"],
      importanceHigh: ["decision", "board", "strategy", "forecast", "hiring", "plan"],
      effortLow: ["review", "approve", "share", "align"],
      effortHigh: ["strategy", "roadmap", "forecast", "plan", "budget"]
    }
  },
  general: {
    label: "General",
    keywords: {
      impactHigh: ["urgent", "deadline", "launch", "send", "approve"],
      importanceHigh: ["deadline", "approve", "meeting", "review"],
      effortLow: ["send", "review", "reply", "share"],
      effortHigh: ["build", "create", "draft", "analyze"]
    }
  }
};

const dayModePresets = {
  lowenergy: {
    label: "Low energy",
    deadline: "medium",
    impact: "execution",
    effort: "quickwins",
    dependencies: "low",
    weights: { impact: 0.85, urgency: 1.0, momentum: 1.25, visibility: 0.8, effortRelief: 1.35 }
  },
  balanced: {
    label: "Balanced",
    deadline: "medium",
    impact: "stakeholders",
    effort: "balanced",
    dependencies: "medium",
    weights: { impact: 1.15, urgency: 1.1, momentum: 0.7, visibility: 0.8, effortRelief: 0.7 }
  },
  urgent: {
    label: "Urgent",
    deadline: "high",
    impact: "stakeholders",
    effort: "balanced",
    dependencies: "high",
    weights: { impact: 1.0, urgency: 1.45, momentum: 0.55, visibility: 0.7, effortRelief: 0.45 }
  },
  quickwins: {
    label: "Quick wins",
    deadline: "medium",
    impact: "execution",
    effort: "quickwins",
    dependencies: "low",
    weights: { impact: 0.95, urgency: 1.0, momentum: 1.4, visibility: 0.7, effortRelief: 1.2 }
  },
  strategic: {
    label: "Big moves",
    deadline: "low",
    impact: "revenue",
    effort: "strategic",
    dependencies: "medium",
    weights: { impact: 1.45, urgency: 0.85, momentum: 0.35, visibility: 1.0, effortRelief: 0.2 }
  }
};

const encouragements = [
  "Nice. Momentum building.",
  "That cleared space for something bigger.",
  "One less thing pulling at your brain.",
  "Clean win. Keep the streak alive.",
  "Good call. The list looks lighter already."
];

const TAG_DEFS = [
  { key: "urgent", emoji: "🔥", label: "Do first" },
  { key: "quick", emoji: "⚡", label: "Quick win" },
  { key: "important", emoji: "⭐", label: "Important" },
  { key: "deferred", emoji: "🕓", label: "Later" }
];

const sampleTasks = [
  "Finalize sponsor follow-up email for next week's webinar",
  "Review campaign performance and prepare leadership recap",
  "Approve updated landing page copy",
  "Send partner feedback to design team",
  "Clean up Q2 backlog of low-priority requests",
  "Draft social copy for the new campaign launch",
  "Follow up on blocked reporting issue with ops"
].join("\n");

const taskInput = document.getElementById("taskInput");
const cleanListBtn = document.getElementById("cleanListBtn");
const roleSelect = document.getElementById("roleSelect");
const deadlineSelect = document.getElementById("deadlineSelect");
const impactSelect = document.getElementById("impactSelect");
const effortSelect = document.getElementById("effortSelect");
const dependencySelect = document.getElementById("dependencySelect");
const sampleBtn = document.getElementById("sampleBtn");
const resetBtn = document.getElementById("resetBtn");
const helpBtn = document.getElementById("helpBtn");
const helpDialog = document.getElementById("helpDialog");
const closeHelpBtn = document.getElementById("closeHelpBtn");
const energySlider = document.getElementById("energySlider");
const energyModeLabel = document.getElementById("energyModeLabel");
const resultList = document.getElementById("resultList");
const summaryDone = document.getElementById("summaryDone");
const momentumCount = document.getElementById("momentumCount");
const momentumFill = document.getElementById("momentumFill");
const confettiLayer = document.getElementById("confettiLayer");

let appState = {
  role: "general",
  energyLevel: 45,
  deadline: "medium",
  impact: "stakeholders",
  effort: "balanced",
  dependencies: "medium",
  taskInput: "",
  completed: {},
  taskStats: {},
  sessionCounter: 0,
  lastSessionStartedAt: 0,
  doneToday: 0,
  lastActiveDate: "",
  activeTaskId: "",
  
};

let previousSummary = { open: 0, done: 0 };
let dragTaskId = "";

function normalizeTaskLine(line) {
  return line
    .replace(/^\s*[-*•]+\s*/, "")
    .replace(/^\s*\d+[\).\s-]+/, "")
    .trim();
}

function taskId(task) {
  return normalizeTaskLine(task).toLowerCase();
}

function parseTasks(raw) {
  return String(raw || "")
    .split(/\n+/)
    .map(normalizeTaskLine)
    .filter(Boolean);
}

function containsAny(text, phrases) {
  return phrases.some(phrase => text.includes(phrase));
}

function setActiveChoice(groupEl, attribute, value) {
  groupEl?.querySelectorAll(`[${attribute}]`).forEach(button => {
    button.classList.toggle("active", button.getAttribute(attribute) === value);
  });
}

function getEnergyMode(level = Number(energySlider?.value || appState.energyLevel || 45)) {
  if (level <= 24) return "lowenergy";
  if (level <= 49) return "balanced";
  if (level <= 74) return "quickwins";
  return "strategic";
}

function inferRole(tasks) {
  const joined = tasks.join(" ").toLowerCase();
  const candidates = Object.entries(rolePresets)
    .filter(([key]) => key !== "general")
    .map(([key, preset]) => {
      const phrases = [
        ...preset.keywords.impactHigh,
        ...preset.keywords.importanceHigh,
        ...preset.keywords.effortLow,
        ...preset.keywords.effortHigh
      ];
      const score = phrases.reduce((total, phrase) => total + (joined.includes(phrase) ? 1 : 0), 0);
      return { key, score };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.score ? candidates[0].key : "general";
}

function getCurrentModeConfig() {
  return dayModePresets[getEnergyMode()] || dayModePresets.balanced;
}

function applyEnergyLevel(level) {
  const numericLevel = Math.max(0, Math.min(100, Number(level) || 0));
  const mode = getEnergyMode(numericLevel);
  const preset = dayModePresets[mode] || dayModePresets.balanced;
  appState.energyLevel = numericLevel;
  if (energySlider) energySlider.value = String(numericLevel);
  if (energyModeLabel) energyModeLabel.textContent = preset.label;
  deadlineSelect.value = preset.deadline;
  impactSelect.value = preset.impact;
  effortSelect.value = preset.effort;
  dependencySelect.value = preset.dependencies;
}

function getContext() {
  const mode = getCurrentModeConfig();
  return {
    role: roleSelect.value,
    deadline: deadlineSelect.value,
    impact: impactSelect.value,
    effort: effortSelect.value,
    dependencies: dependencySelect.value,
    dayMode: getEnergyMode(),
    energyLevel: Number(energySlider?.value || appState.energyLevel || 45),
    modeWeights: mode.weights
  };
}

function ensureTaskStat(id) {
  if (!appState.taskStats[id]) {
    appState.taskStats[id] = {
      createdAt: Date.now(),
      tags: [],
      subtasks: [],
      manualLane: "",
      manualRank: null,
      seenSessions: 0,
      ignoredSessions: 0,
      completedCount: 0,
      lastSeenSession: 0,
      lastCompletedAt: 0
    };
  }
  if (!appState.taskStats[id].createdAt) {
    appState.taskStats[id].createdAt = Date.now();
  }
  if (!Array.isArray(appState.taskStats[id].tags)) {
    appState.taskStats[id].tags = [];
  }
  if (!Array.isArray(appState.taskStats[id].subtasks)) {
    appState.taskStats[id].subtasks = [];
  }
  return appState.taskStats[id];
}

function getTextSignals(task, context) {
  const text = task.toLowerCase();
  const rolePreset = rolePresets[context.role] || rolePresets.general;
  const urgentTerms = ["urgent", "asap", "today", "tomorrow", "deadline", "due", "final", "launch", "send", "approve"];
  const importantTerms = ["strategy", "leadership", "client", "partner", "proposal", "renewal", "decision", "report", "forecast", "review"];
  const blockerTerms = ["block", "blocked", "dependency", "waiting", "handoff", "follow up", "follow-up", "issue"];

  const wordCount = task.split(/\s+/).length;
  const impactScore =
    containsAny(text, rolePreset.keywords.impactHigh) ? 5 :
    containsAny(text, rolePreset.keywords.importanceHigh) ? 4 :
    containsAny(text, importantTerms) ? 3 : 2;

  const urgencyScore =
    containsAny(text, urgentTerms) ? 5 :
    context.deadline === "high" && containsAny(text, ["review", "meeting", "follow up", "follow-up"]) ? 3 :
    2;

  const importanceScore =
    containsAny(text, rolePreset.keywords.importanceHigh) ? 5 :
    containsAny(text, importantTerms) ? 4 :
    context.impact === "execution" && containsAny(text, ["fix", "cleanup", "publish", "update"]) ? 3 :
    2;

  let effortScore = 3;
  if (containsAny(text, rolePreset.keywords.effortLow) || wordCount <= 4) effortScore = 1;
  else if (containsAny(text, rolePreset.keywords.effortHigh) || wordCount >= 10) effortScore = 4;

  const momentumScore = effortScore <= 2 ? 5 : effortScore === 3 ? 3 : 1;
  const dependencyScore = containsAny(text, blockerTerms)
    ? context.dependencies === "high" ? 5 : 4
    : 1;

  return { impactScore, urgencyScore, importanceScore, effortScore, momentumScore, dependencyScore };
}

function getQuadrantCue(metrics) {
  if (metrics.urgencyScore >= 4 && metrics.importanceScore >= 4) return "Urgent";
  if (metrics.impactScore >= 4 && metrics.effortScore <= 2) return "Quick win";
  if (metrics.momentumScore >= 4) return "Momentum";
  return "";
}

function scoreTask(task, context) {
  const id = taskId(task);
  const stats = ensureTaskStat(id);
  const metrics = getTextSignals(task, context);
  const daysUnfinished = Math.max(0, Math.floor((Date.now() - stats.createdAt) / 86400000));
  const tags = new Set(stats.tags || []);
  const impactVsEffort = (metrics.impactScore * 5) - (metrics.effortScore * 2.5);
  const urgencyVsImportance = (metrics.urgencyScore * 4.2) + (metrics.importanceScore * 4.4);
  const momentumValue = metrics.momentumScore * 3.2;
  const visibilityValue = Math.min(stats.ignoredSessions * 2.2, 14);
  const unfinishedValue = Math.min(daysUnfinished * 1.4, 10);
  const dependencyValue = metrics.dependencyScore * 2.2;
  const tagBoost =
    (tags.has("urgent") ? 18 : 0) +
    (tags.has("important") ? 10 : 0) +
    (tags.has("quick") ? (context.dayMode === "quickwins" || context.dayMode === "lowenergy" ? 14 : 8) : 0) +
    (tags.has("deferred") ? -70 : 0);

  const weights = context.modeWeights;
  const total =
    (impactVsEffort * weights.impact) +
    (urgencyVsImportance * weights.urgency) +
    (momentumValue * weights.momentum) +
    (visibilityValue * weights.visibility) +
    unfinishedValue +
    ((6 - metrics.effortScore) * 2.4 * weights.effortRelief) +
    dependencyValue +
    tagBoost;

  return {
    id,
    task,
    completed: !!appState.completed[id],
    score: Math.round(total),
    cue: getQuadrantCue(metrics),
    metrics,
    daysUnfinished,
    tags: stats.tags || [],
    manualLane: stats.manualLane || "",
    manualRank: Number.isFinite(stats.manualRank) ? stats.manualRank : null
  };
}

function updateTaskStats(scoredTasks, doNowIds) {
  const activeIds = new Set(scoredTasks.map(item => item.id));

  scoredTasks.forEach(item => {
    const stat = ensureTaskStat(item.id);
    if (stat.lastSeenSession !== appState.sessionCounter) {
      stat.seenSessions += 1;
      stat.lastSeenSession = appState.sessionCounter;
    }

    if (!item.completed) {
      if (doNowIds.has(item.id)) {
        stat.ignoredSessions = 0;
      } else {
        stat.ignoredSessions += 1;
      }
    }
  });

  Object.keys(appState.taskStats).forEach(id => {
    if (!activeIds.has(id) && !appState.completed[id]) {
      delete appState.taskStats[id];
    }
  });
}

function saveState() {
  appState = {
    ...appState,
    role: roleSelect.value,
    energyLevel: Number(energySlider?.value || appState.energyLevel || 45),
    deadline: deadlineSelect.value,
    impact: impactSelect.value,
    effort: effortSelect.value,
    dependencies: dependencySelect.value,
    taskInput: taskInput.value
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function getTodayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function resetDailyStateIfNeeded() {
  const today = getTodayKey();
  if (appState.lastActiveDate === today) return;
  appState.lastActiveDate = today;
  appState.doneToday = 0;
}

function markSessionIfNeeded() {
  const now = Date.now();
  const sessionWindow = 3 * 60 * 60 * 1000;
  if (!appState.lastSessionStartedAt || (now - appState.lastSessionStartedAt) > sessionWindow) {
    appState.sessionCounter += 1;
    appState.lastSessionStartedAt = now;
  }
}

function restoreState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    appState = {
      ...appState,
      ...saved,
      completed: saved.completed || {},
      taskStats: saved.taskStats || {},
      sessionCounter: saved.sessionCounter || 0,
      lastSessionStartedAt: saved.lastSessionStartedAt || 0,
      doneToday: saved.doneToday || 0,
      lastActiveDate: saved.lastActiveDate || "",
      activeTaskId: saved.activeTaskId || ""
    };

    roleSelect.value = appState.role || "general";
    taskInput.value = appState.taskInput || "";
    applyEnergyLevel(appState.energyLevel || 45);
    return true;
  } catch (error) {
    return false;
  }
}

function syncTaskCollections() {
  const activeIds = new Set(parseTasks(taskInput.value).map(taskId));
  Object.keys(appState.completed).forEach(id => {
    if (!activeIds.has(id)) delete appState.completed[id];
  });
  Object.keys(appState.taskStats).forEach(id => {
    if (!activeIds.has(id) && !appState.completed[id]) delete appState.taskStats[id];
  });
}

function getScoredTasks(context) {
  return parseTasks(taskInput.value)
    .map(task => scoreTask(task, context))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.score - a.score;
    });
}

function animateCounter(node) {
  if (!node) return;
  node.classList.remove("is-pulsing");
  void node.offsetWidth;
  node.classList.add("is-pulsing");
}

function updateMomentum(doneToday = appState.doneToday) {
  const normalized = Math.min(doneToday, MOMENTUM_TARGET);
  if (momentumCount) momentumCount.textContent = `${normalized}/${MOMENTUM_TARGET}`;
  if (momentumFill) momentumFill.style.width = `${(normalized / MOMENTUM_TARGET) * 100}%`;
}

function updateSummary(scoredTasks, context) {
  const doneCount = scoredTasks.filter(item => item.completed).length;

  if (summaryDone) summaryDone.textContent = String(doneCount);
  if (doneCount !== previousSummary.done) animateCounter(summaryDone);
  updateMomentum();

  previousSummary = { open: scoredTasks.length - doneCount, done: doneCount };
}

function getVisibleSignals(item) {
  return TAG_DEFS.filter(tag => item.tags.includes(tag.key));
}

function normalizeManualGroups(groups) {
  const start = groups.start.slice(0, 3);
  const overflowStart = groups.start.slice(3);
  const next = [...overflowStart, ...groups.next].slice(0, 5);
  const overflowNext = [...overflowStart, ...groups.next].slice(5);
  const later = [...overflowNext, ...groups.later];
  return { start, next, later };
}

function groupOpenTasks(openTasks) {
  const manual = { start: [], next: [], later: [] };
  const remaining = [];

  openTasks.forEach(item => {
    if (item.manualLane && manual[item.manualLane]) {
      manual[item.manualLane].push(item);
      return;
    }
    if (item.tags.includes("deferred")) {
      manual.later.push(item);
      return;
    }
    remaining.push(item);
  });

  manual.start.sort((a, b) => (a.manualRank ?? 999) - (b.manualRank ?? 999));
  manual.next.sort((a, b) => (a.manualRank ?? 999) - (b.manualRank ?? 999));
  manual.later.sort((a, b) => (a.manualRank ?? 999) - (b.manualRank ?? 999));

  const start = [...manual.start];
  const next = [...manual.next];
  const later = [...manual.later];

  remaining.forEach(item => {
    if (start.length < 3) {
      start.push(item);
    } else if (next.length < 5) {
      next.push(item);
    } else {
      later.push(item);
    }
  });

  return normalizeManualGroups({ start, next, later });
}

function renderTaskCard(item, laneIndex, laneName) {
  const stats = ensureTaskStat(item.id);
  const showBreakdown = BIG_TASK_HINT.test(item.task) && !(stats.subtasks && stats.subtasks.length);
  const selectedTag = stats.tags?.[0] || "";
  const selectedTagDef = TAG_DEFS.find(tag => tag.key === selectedTag) || null;
  const visibleTagDefs = selectedTag
    ? TAG_DEFS.filter(tag => tag.key === selectedTag)
    : TAG_DEFS;
  return `
    <article class="task-card${laneIndex < 3 && !item.completed ? " top" : ""}${item.completed ? " is-complete" : ""}${appState.activeTaskId === item.id ? " is-active" : ""}" data-task-card="${item.id}" draggable="${item.completed ? "false" : "true"}">
      <div class="task-head">
        <div class="task-title-wrap">
          <span class="drag-handle" aria-hidden="true" title="Drag to reorder">
            <svg viewBox="0 0 16 16" fill="none">
              <circle cx="5" cy="4" r="1"></circle>
              <circle cx="11" cy="4" r="1"></circle>
              <circle cx="5" cy="8" r="1"></circle>
              <circle cx="11" cy="8" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
              <circle cx="11" cy="12" r="1"></circle>
            </svg>
          </span>
          <input class="task-check" type="checkbox" data-task-id="${item.id}" ${item.completed ? "checked" : ""} aria-label="Mark task complete">
          <div class="task-main">
            <div class="task-title-line">
              <h4 class="task-title">${item.task}</h4>
              ${selectedTagDef ? `
                <button class="tag-toggle selected-tag is-on" type="button" data-tag-toggle="${selectedTagDef.key}" data-task-id="${item.id}" aria-label="${selectedTagDef.label}" title="Clear ${selectedTagDef.label}">
                  <span>${selectedTagDef.emoji}</span><span>${selectedTagDef.label}</span>
                </button>
              ` : ""}
            </div>
            ${selectedTagDef ? "" : `<div class="task-toggle-row">
              ${visibleTagDefs.map(tag => `
                <button class="tag-toggle${item.tags.includes(tag.key) ? " is-on" : ""}" type="button" data-tag-toggle="${tag.key}" data-task-id="${item.id}" aria-label="${tag.label}" title="${tag.label}">
                  <span>${tag.emoji}</span><span>${tag.label}</span>
                </button>
              `).join("")}
            </div>`}
            ${showBreakdown ? `<button class="inline-helper" type="button" data-breakdown="${item.id}">Break this into steps</button>` : ""}
            ${stats.subtasks?.length ? `
              <ul class="subtask-list">
                ${stats.subtasks.map((step, index) => `
                  <li class="subtask-item${step.done ? " is-done" : ""}">
                    <label class="subtask-label">
                      <input class="subtask-check" type="checkbox" data-subtask-check="${item.id}" data-subtask-index="${index}" ${step.done ? "checked" : ""} aria-label="Mark subtask complete">
                      <span>${step.text}</span>
                    </label>
                  </li>
                `).join("")}
              </ul>
            ` : ""}
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderLane(title, items, className, laneName, offset = 0, emptyCopy = "Nothing here right now.") {
  return `
    <section class="task-lane ${className}">
      <div class="task-lane-head">
        <h4>${title}</h4>
        <span>${items.length}</span>
      </div>
      <div class="task-lane-body" data-lane="${laneName}">
        ${items.length
          ? items.map((item, index) => renderTaskCard(item, index + offset, laneName)).join("")
          : `<div class="lane-empty">${emptyCopy}</div>`}
      </div>
    </section>
  `;
}

function renderCompletedSection(items, offset = 0) {
  if (!items.length) return "";

  return `
    <details class="task-lane lane-done lane-done-toggle">
      <summary class="task-lane-head done-toggle-head">
        <h4>Completed</h4>
        <span>${items.length}</span>
      </summary>
      <div class="task-lane-body" data-lane="done">
        ${items.map((item, index) => renderTaskCard(item, index + offset, "done")).join("")}
      </div>
    </details>
  `;
}

function renderResults(scoredTasks, context) {
  updateSummary(scoredTasks, context);

  if (!scoredTasks.length) {
    resultList.innerHTML = '<div class="empty-state">Your task groups will appear here.</div>';
    return;
  }

  const openTasks = scoredTasks.filter(item => !item.completed);
  const doneTasks = scoredTasks
    .filter(item => item.completed)
    .sort((a, b) => (ensureTaskStat(b.id).lastCompletedAt || 0) - (ensureTaskStat(a.id).lastCompletedAt || 0));
  const grouped = groupOpenTasks(openTasks);
  const doNow = grouped.start;
  const nextUp = grouped.next;
  const later = grouped.later;

  if (appState.activeTaskId && !openTasks.some(item => item.id === appState.activeTaskId)) {
    appState.activeTaskId = doNow[0]?.id || "";
  }
  if (!appState.activeTaskId && doNow.length) {
    appState.activeTaskId = doNow[0].id;
  }

  resultList.innerHTML = `
    ${renderLane("Start here", doNow, "lane-now", "start", 0, "Nothing pressing right now.")}
    ${renderLane("Next up", nextUp, "lane-next", "next", doNow.length, "Nothing queued behind the top set.")}
    ${renderLane("Later", later, "lane-later", "later", doNow.length + nextUp.length, "No deferred tasks at the moment.")}
    ${renderCompletedSection(doneTasks, doNow.length + nextUp.length + later.length)}
  `;
}

function prettifyTask(task) {
  const clean = task.trim().replace(/\s+/g, " ");
  const lower = clean.toLowerCase();
  if (lower.startsWith("email ")) return `Email ${clean.slice(6).trim()} about campaign update`;
  if (lower.includes("white paper")) return "Draft white paper outline";
  if (lower.includes("landing page")) return "Fix landing page layout bug";
  if (lower.includes("analytics")) return "Review campaign analytics";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function cleanBrainDump() {
  const tasks = parseTasks(taskInput.value).map(prettifyTask);
  taskInput.value = tasks.join("\n");
  saveState();
  runPrioritization();
}

function buildSubtasks(task) {
  const lower = task.toLowerCase();
  if (lower.includes("white paper")) {
    return [
      "Outline white paper structure",
      "Draft section 1",
      "Draft section 2",
      "Review and refine draft"
    ];
  }
  if (lower.includes("landing page")) {
    return [
      "Review the current page issue",
      "Fix the layout bug",
      "Test desktop and mobile states",
      "Confirm final page update"
    ];
  }
  if (lower.includes("analytics")) {
    return [
      "Pull the latest numbers",
      "Spot the main trend",
      "Write a short takeaway",
      "Share the recap"
    ];
  }
  return [
    `Outline ${task.toLowerCase()}`,
    "Draft the first pass",
    "Review and tighten the work",
    "Send or publish the final version"
  ];
}

function toggleSubtask(taskKey, subtaskIndex, isComplete) {
  const stats = ensureTaskStat(taskKey);
  const step = stats.subtasks?.[subtaskIndex];
  if (!step) return;
  step.done = isComplete;
  saveState();
  runPrioritization();
}

function toggleTaskTag(taskKey, tagKey) {
  const stats = ensureTaskStat(taskKey);
  const currentTag = Array.isArray(stats.tags) ? stats.tags[0] : "";
  stats.tags = currentTag === tagKey ? [] : [tagKey];

  if (stats.tags.includes("deferred")) {
    stats.manualLane = "later";
    stats.manualRank = 0;
  } else if (stats.manualLane === "later" && stats.manualRank === 0) {
    stats.manualLane = "";
    stats.manualRank = null;
  }
  runPrioritization();
}

function saveManualLayoutFromDom() {
  const groups = {
    start: [...resultList.querySelectorAll('[data-lane="start"] .task-card')].map(card => card.dataset.taskCard),
    next: [...resultList.querySelectorAll('[data-lane="next"] .task-card')].map(card => card.dataset.taskCard),
    later: [...resultList.querySelectorAll('[data-lane="later"] .task-card')].map(card => card.dataset.taskCard)
  };
  const normalized = normalizeManualGroups(groups);
  Object.entries(normalized).forEach(([lane, ids]) => {
    ids.forEach((id, index) => {
      const stats = ensureTaskStat(id);
      stats.manualLane = lane;
      stats.manualRank = index;
    });
  });
  runPrioritization();
}

function getDragAfterElement(container, y) {
  const cards = [...container.querySelectorAll(".task-card:not(.is-dragging)")];
  return cards.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

function runPrioritization() {
  resetDailyStateIfNeeded();
  markSessionIfNeeded();
  syncTaskCollections();

  const tasks = parseTasks(taskInput.value);
  roleSelect.value = inferRole(tasks);
  const context = getContext();

  if (!tasks.length) {
    resultList.innerHTML = '<div class="empty-state">Your task groups will appear here.</div>';
    updateSummary([], context);
    appState.activeTaskId = "";
    saveState();
    return;
  }

  let scoredTasks = getScoredTasks(context);
  const openTasks = scoredTasks.filter(item => !item.completed);
  const groupedBeforeStats = groupOpenTasks(openTasks);
  const doNowIds = new Set(groupedBeforeStats.start.map(item => item.id));
  updateTaskStats(scoredTasks, doNowIds);

  // Re-score once with updated ignored-session weighting.
  scoredTasks = getScoredTasks(context);
  const rescoredOpenTasks = scoredTasks.filter(item => !item.completed);
  if (!rescoredOpenTasks.some(item => item.id === appState.activeTaskId)) {
    appState.activeTaskId = "";
  }
  renderResults(scoredTasks, context);
  saveState();
}

function resetApp() {
  appState = {
    role: "general",
    energyLevel: 45,
    deadline: "medium",
    impact: "stakeholders",
    effort: "balanced",
    dependencies: "medium",
    taskInput: "",
    completed: {},
    taskStats: {},
    sessionCounter: 0,
    lastSessionStartedAt: 0,
    doneToday: 0,
    lastActiveDate: getTodayKey(),
    activeTaskId: "",
  };

  roleSelect.value = appState.role;
  taskInput.value = "";
  applyEnergyLevel(appState.energyLevel);
  resultList.innerHTML = '<div class="empty-state">Your task groups will appear here.</div>';
  previousSummary = { open: 0, done: 0 };
  updateSummary([], getContext());
  window.localStorage.removeItem(STORAGE_KEY);
}

function burstConfetti(originEl) {
  if (!confettiLayer || !originEl) return;
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const colors = ["#7b61ff", "#a78bfa", "#f59e0b", "#34d399", "#60a5fa"];

  for (let i = 0; i < 16; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--dx", `${(Math.random() - 0.5) * 160}px`);
    piece.style.setProperty("--dy", `${-60 - Math.random() * 120}px`);
    piece.style.setProperty("--rot", `${Math.random() * 240 - 120}deg`);
    confettiLayer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 900);
  }
}

function handleCompletion(taskKey, isComplete, target) {
  resetDailyStateIfNeeded();
  const stats = ensureTaskStat(taskKey);

  if (isComplete) {
    appState.completed[taskKey] = true;
    stats.completedCount += 1;
    stats.ignoredSessions = 0;
    stats.lastCompletedAt = Date.now();
    appState.doneToday += 1;
    if (appState.activeTaskId === taskKey) appState.activeTaskId = "";
    burstConfetti(target);
  } else {
    delete appState.completed[taskKey];
    if (!appState.activeTaskId) appState.activeTaskId = taskKey;
  }

  runPrioritization();
}

taskInput.addEventListener("input", () => {
  saveState();
  runPrioritization();
});

sampleBtn.addEventListener("click", () => {
  taskInput.value = sampleTasks;
  appState.completed = {};
  appState.taskStats = {};
  runPrioritization();
});

resetBtn.addEventListener("click", resetApp);
cleanListBtn?.addEventListener("click", cleanBrainDump);
energySlider?.addEventListener("input", event => {
  applyEnergyLevel(event.target.value);
  runPrioritization();
});

resultList.addEventListener("change", event => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.matches(".task-check")) return;
  handleCompletion(target.dataset.taskId, target.checked, target);
});

resultList.addEventListener("click", event => {
  const tagBtn = event.target.closest("[data-tag-toggle]");
  if (tagBtn) {
    toggleTaskTag(tagBtn.dataset.taskId, tagBtn.dataset.tagToggle);
    return;
  }

  const breakdownBtn = event.target.closest("[data-breakdown]");
  if (breakdownBtn) {
    const stats = ensureTaskStat(breakdownBtn.dataset.breakdown);
    const taskText = parseTasks(taskInput.value).find(task => taskId(task) === breakdownBtn.dataset.breakdown);
    if (taskText) {
      stats.subtasks = buildSubtasks(taskText).map(step => ({ text: step, done: false }));
      saveState();
      runPrioritization();
    }
  }
});

resultList.addEventListener("change", event => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.matches(".subtask-check")) return;
  toggleSubtask(target.dataset.subtaskCheck, Number(target.dataset.subtaskIndex), target.checked);
});

resultList.addEventListener("dragstart", event => {
  const card = event.target.closest(".task-card");
  if (!card) return;
  dragTaskId = card.dataset.taskCard;
  card.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
});

resultList.addEventListener("dragend", event => {
  const card = event.target.closest(".task-card");
  card?.classList.remove("is-dragging");
  if (dragTaskId) {
    saveManualLayoutFromDom();
    dragTaskId = "";
  }
});

resultList.addEventListener("dragover", event => {
  if (!dragTaskId) return;
  const laneBody = event.target.closest(".task-lane-body");
  if (!laneBody) return;
  event.preventDefault();
  const dragged = resultList.querySelector(`[data-task-card="${dragTaskId}"]`);
  if (!dragged) return;
  const afterElement = getDragAfterElement(laneBody, event.clientY);
  if (!afterElement) laneBody.appendChild(dragged);
  else laneBody.insertBefore(dragged, afterElement);
});

if (helpBtn && helpDialog) {
  helpBtn.addEventListener("click", () => helpDialog.showModal());
}

if (closeHelpBtn && helpDialog) {
  closeHelpBtn.addEventListener("click", () => helpDialog.close());
}

if (helpDialog) {
  helpDialog.addEventListener("click", event => {
    const bounds = helpDialog.getBoundingClientRect();
    const clickedBackdrop =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (clickedBackdrop) helpDialog.close();
  });
}

if (restoreState()) {
  if (taskInput.value.trim()) {
    runPrioritization();
  } else {
    previousSummary = { open: 0, done: 0 };
    updateSummary([], getContext());
  }
} else {
  resetApp();
}
