(function () {
  const endpointPath = "/api/dashboard/command-center";
  const shell = document.querySelector(".command-shell");
  const gate = document.getElementById("gate-form");
  const gateError = document.getElementById("gate-error");
  const apiBaseInput = document.getElementById("api-base");
  const tokenInput = document.getElementById("api-token");
  const syncStatus = document.getElementById("sync-status");
  const refreshButton = document.getElementById("refresh-button");
  const lockButton = document.getElementById("lock-button");

  const state = {
    apiBase: localStorage.getItem("maverickCommandCenter.apiBase") || "http://127.0.0.1:3847",
    token: sessionStorage.getItem("maverickCommandCenter.token") || "",
    lastPayload: null,
  };

  apiBaseInput.value = state.apiBase;
  tokenInput.value = state.token;

  gate.addEventListener("submit", function (event) {
    event.preventDefault();
    state.apiBase = normalizeBase(apiBaseInput.value);
    state.token = tokenInput.value.trim();
    localStorage.setItem("maverickCommandCenter.apiBase", state.apiBase);
    if (state.token) {
      sessionStorage.setItem("maverickCommandCenter.token", state.token);
    } else {
      sessionStorage.removeItem("maverickCommandCenter.token");
    }
    loadDashboard();
  });

  refreshButton.addEventListener("click", function () {
    loadDashboard();
  });

  lockButton.addEventListener("click", function () {
    state.token = "";
    sessionStorage.removeItem("maverickCommandCenter.token");
    tokenInput.value = "";
    setView("auth");
    setSync("Locked", "warn");
  });

  loadDashboard();

  async function loadDashboard() {
    setView(state.lastPayload ? "ready" : "loading");
    setSync("Refreshing", "warn");
    gateError.textContent = "";

    try {
      const response = await fetch(state.apiBase + endpointPath, {
        method: "GET",
        headers: state.token ? { authorization: "Bearer " + state.token } : {},
      });

      if (response.status === 401) {
        setView("auth");
        setSync("Auth required", "warn");
        gateError.textContent = "Access token required.";
        return;
      }

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const payload = await response.json();
      state.lastPayload = payload;
      render(payload);
      setView("ready");
      setSync("Live", toneForHealth(payload.health && payload.health.status));
    } catch (error) {
      if (!state.lastPayload) {
        setView("auth");
      }
      setSync("API unavailable", "danger");
      gateError.textContent = error instanceof Error ? error.message : "Unable to connect.";
      renderUnavailable(error);
    }
  }

  function render(payload) {
    setText("generated-at", "Generated " + formatTime(payload.generatedAt));
    setText("next-action", payload.nextAction || "No action available.");
    setText("metric-health", labelHealth(payload.health && payload.health.status));
    setText("metric-workstreams", String(payload.activeWorkstreams.length));
    setText("metric-approvals", String(payload.pendingApprovals.length));
    setText("metric-tasks", String(payload.taskSummary.totalActionable));
    setText("task-total", payload.taskSummary.totalActionable + " total");
    setText("approval-count", payload.pendingApprovals.length + " waiting");
    setText("project-count", payload.projectSummaries.length + " tracked");
    setText("workstream-count", payload.activeWorkstreams.length + " active");
    setText("report-count", payload.latestReports.length + " recent");
    setText("note-count", payload.recentNotes.length + " recent");
    setText("event-count", payload.recentEvents.length + " recent");

    renderTaskMetrics(payload.taskSummary);
    renderTaskQueue(payload.assistantAgenda);
    renderApprovals(payload.pendingApprovals);
    renderProjects(payload.projectSummaries);
    renderWorkstreams(payload.activeWorkstreams);
    renderReports(payload.latestReports);
    renderNotes(payload.recentNotes);
    renderEvents(payload.recentEvents);
  }

  function renderTaskMetrics(summary) {
    const items = [
      ["Overdue", summary.overdue, summary.overdue > 0 ? "danger" : "ok"],
      ["Today", summary.dueToday, summary.dueToday > 0 ? "warn" : "ok"],
      ["Open", summary.open, summary.open > 0 ? "warn" : "ok"],
      ["Scheduled", summary.scheduled, "ok"],
      ["Inbox", summary.inbox, summary.inbox > 0 ? "warn" : "ok"],
    ];
    fill("task-metrics", items.map(function (item) {
      return '<div class="task-chip" data-tone="' + item[2] + '"><strong>' + escapeHtml(item[1]) + '</strong><span>' + escapeHtml(item[0]) + '</span></div>';
    }).join(""));
  }

  function renderTaskQueue(agenda) {
    if (!agenda) {
      empty("task-queue", "Assistant data unavailable.");
      return;
    }
    const tasks = uniqueById([]
      .concat(agenda.overdueTasks || [])
      .concat(agenda.dueTodayTasks || [])
      .concat(agenda.inboxTasks || [])
      .concat(agenda.openTasks || [])
      .concat(agenda.scheduledTasks || []))
      .slice(0, 8);
    if (tasks.length === 0) {
      empty("task-queue", "No active tasks.");
      return;
    }
    fill("task-queue", tasks.map(function (task) {
      return queueItem(task.title, task.details || task.primaryContext, [
        tag(task.status, toneForTask(task.status)),
        task.dueAt ? tag(formatTime(task.dueAt), "warn") : "",
      ].join(""));
    }).join(""));
  }

  function renderApprovals(approvals) {
    if (approvals.length === 0) {
      empty("approval-list", "No pending approvals.");
      return;
    }
    fill("approval-list", approvals.map(function (approval) {
      return queueItem(approval.description, approval.workstreamName || approval.workstreamId, [
        tag(approval.projectId || "project", "ok"),
        tag(approval.tier, "warn"),
      ].join(""));
    }).join(""));
  }

  function renderProjects(projects) {
    if (projects.length === 0) {
      empty("project-grid", "No configured projects.");
      return;
    }
    fill("project-grid", projects.map(function (project) {
      const states = Object.keys(project.states || {});
      const stateRows = states.length
        ? states.map(function (stateName) {
          return '<div class="state-row"><span>' + escapeHtml(stateName) + '</span><strong>' + escapeHtml(project.states[stateName]) + '</strong></div>';
        }).join("")
        : '<div class="state-row"><span>idle</span><strong>0</strong></div>';
      return [
        '<details class="project-panel">',
        '<summary>',
        '<div class="queue-title"><strong>' + escapeHtml(project.name) + '</strong>' + healthBadge(project.health) + '</div>',
        '<p>' + escapeHtml(project.healthReason || "No active issues.") + '</p>',
        '<div class="project-meta">',
        tag(project.id, "ok"),
        tag(project.activeWorkstreamCount + " active", project.activeWorkstreamCount > 0 ? "warn" : "ok"),
        '</div>',
        '</summary>',
        '<div class="state-list">' + stateRows + '</div>',
        '</details>',
      ].join("");
    }).join(""));
  }

  function renderWorkstreams(workstreams) {
    if (workstreams.length === 0) {
      empty("workstream-list", "No active workstreams.");
      return;
    }
    fill("workstream-list", workstreams.map(function (workstream) {
      return queueItem(workstream.workstreamName, workstream.nextAction || workstream.currentGoal || workstream.state, [
        tag(workstream.projectId, "ok"),
        healthBadge(workstream.health),
      ].join(""));
    }).join(""));
  }

  function renderReports(reports) {
    if (reports.length === 0) {
      empty("report-list", "No recent reports.");
      return;
    }
    fill("report-list", reports.slice(0, 8).map(function (report) {
      return queueItem(report.headline, report.summary || report.nextAction, [
        tag(report.kind, "ok"),
        tag(report.projectId, "warn"),
      ].join(""));
    }).join(""));
  }

  function renderNotes(notes) {
    if (notes.length === 0) {
      empty("note-list", "No recent notes.");
      return;
    }
    fill("note-list", notes.map(function (note) {
      return queueItem(note.title, note.excerpt, [
        tag(note.context, "ok"),
        note.projectName ? tag(note.projectName, "warn") : "",
      ].join(""));
    }).join(""));
  }

  function renderEvents(events) {
    if (events.length === 0) {
      empty("event-list", "No recent events.");
      return;
    }
    fill("event-list", events.slice(0, 8).map(function (event) {
      return queueItem(event.eventType, event.source + " at " + formatTime(event.createdAt), [
        event.projectId ? tag(event.projectId, "ok") : "",
        event.workstreamId ? tag("workstream", "warn") : "",
      ].join(""));
    }).join(""));
  }

  function renderUnavailable(error) {
    if (state.lastPayload) {
      return;
    }
    setText("generated-at", "Offline");
    setText("next-action", error instanceof Error ? error.message : "Unable to connect.");
    setText("metric-health", "down");
    setText("metric-workstreams", "0");
    setText("metric-approvals", "0");
    setText("metric-tasks", "0");
    ["task-queue", "approval-list", "project-grid", "workstream-list", "report-list", "note-list", "event-list"].forEach(function (id) {
      empty(id, "No live data.");
    });
  }

  function queueItem(title, body, meta) {
    return [
      '<div class="queue-item">',
      '<div class="queue-title"><strong>' + escapeHtml(title || "Untitled") + '</strong><span>' + meta + '</span></div>',
      '<p>' + escapeHtml(body || "") + '</p>',
      '</div>',
    ].join("");
  }

  function tag(label, tone) {
    if (!label) {
      return "";
    }
    return '<span class="tag" data-tone="' + escapeHtml(tone || "ok") + '">' + escapeHtml(label) + '</span>';
  }

  function healthBadge(health) {
    return '<span class="health-badge" data-tone="' + toneForHealth(health) + '">' + escapeHtml(health || "ok") + '</span>';
  }

  function toneForHealth(health) {
    if (health === "failed" || health === "blocked" || health === "unavailable" || health === "attention") {
      return "danger";
    }
    if (health === "waiting-on-approval" || health === "awaiting-input" || health === "quiet" || health === "active") {
      return "warn";
    }
    return "ok";
  }

  function toneForTask(status) {
    if (status === "inbox") {
      return "warn";
    }
    if (status === "open") {
      return "warn";
    }
    return "ok";
  }

  function labelHealth(status) {
    return status || "unknown";
  }

  function setView(view) {
    shell.dataset.view = view;
  }

  function setSync(label, tone) {
    syncStatus.textContent = label;
    syncStatus.dataset.tone = tone || "ok";
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function fill(id, html) {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = html;
    }
  }

  function empty(id, message) {
    fill(id, '<div class="empty">' + escapeHtml(message) + '</div>');
  }

  function uniqueById(items) {
    const seen = new Set();
    return items.filter(function (item) {
      if (!item || seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }

  function normalizeBase(value) {
    return value.trim().replace(/\/+$/, "");
  }

  function formatTime(value) {
    if (!value) {
      return "--";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}());
