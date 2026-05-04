(function () {
  const endpointPath = "/api/dashboard/command-center";
  const projectPath = "/api/dashboard/projects/";
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
    detailCache: new Map(),
    detailLoading: new Set(),
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
    state.detailCache.clear();
    loadDashboard();
  });

  refreshButton.addEventListener("click", function () {
    state.detailCache.clear();
    loadDashboard();
  });

  lockButton.addEventListener("click", function () {
    state.token = "";
    sessionStorage.removeItem("maverickCommandCenter.token");
    tokenInput.value = "";
    setView("auth");
    setSync("Locked", "warn");
  });

  window.addEventListener("hashchange", function () {
    if (!state.lastPayload) {
      return;
    }
    render(state.lastPayload);
  });

  if (!location.hash) {
    location.hash = "#/today";
  }
  loadDashboard();

  async function loadDashboard() {
    setView(state.lastPayload ? "ready" : "loading");
    setSync("Refreshing", "warn");
    gateError.textContent = "";

    try {
      const response = await fetch(state.apiBase + endpointPath, {
        method: "GET",
        headers: authHeaders(),
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

  async function loadProjectDetail(projectId) {
    if (state.detailCache.has(projectId) || state.detailLoading.has(projectId)) {
      return;
    }
    state.detailLoading.add(projectId);
    renderProjectDetailLoading(projectId);

    try {
      const response = await fetch(state.apiBase + projectPath + encodeURIComponent(projectId), {
        method: "GET",
        headers: authHeaders(),
      });
      if (response.status === 401) {
        setView("auth");
        setSync("Auth required", "warn");
        return;
      }
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      state.detailCache.set(projectId, await response.json());
      if (routeFromHash().projectId === projectId && state.lastPayload) {
        render(state.lastPayload);
      }
    } catch (error) {
      state.detailCache.set(projectId, {
        projectId: projectId,
        projectName: projectId,
        status: "attention",
        headline: error instanceof Error ? error.message : "Unable to load project.",
        lanes: [],
        notes: [],
        tasks: [],
        calendarEvents: [],
        workstreams: [],
        unresolvedCaptures: [],
        evidenceLinks: [],
        keyUpdates: [],
        actionItems: [],
      });
      if (state.lastPayload) {
        render(state.lastPayload);
      }
    } finally {
      state.detailLoading.delete(projectId);
    }
  }

  function render(payload) {
    const route = routeFromHash();
    setActiveRoute(route.view);
    setText("generated-at", "Generated " + formatTime(payload.generatedAt));
    setText("next-action", payload.nextAction || "No action available.");
    setText("metric-health", labelHealth(payload.health && payload.health.status));
    setText("metric-workstreams", String(payload.activeWorkstreams.length));
    setText("metric-approvals", String(payload.pendingApprovals.length));
    setText("metric-tasks", String(payload.taskSummary.totalActionable));
    setText("task-total", payload.todayPlan ? payload.todayPlan.headline : payload.taskSummary.totalActionable + " total");
    setText("approval-count", payload.pendingApprovals.length + " waiting");
    setText("project-count", payload.projectIntelligenceSummaries.length + " active");
    setText("workstream-count", payload.activeWorkstreams.length + " active");
    setText("report-count", payload.latestReports.length + " recent");
    setText("note-count", payload.recentNotes.length + " recent");

    renderProjectTabs(payload.projectIntelligenceSummaries);
    renderTaskMetrics(payload.taskSummary);
    renderApprovals(payload.pendingApprovals);
    renderWorkstreams(payload.activeWorkstreams);
    renderReports(payload.latestReports);
    renderNotes(payload.recentNotes);

    if (route.view === "projects") {
      renderProjects(payload.projectIntelligenceSummaries);
    } else if (route.view === "project-detail" && route.projectId) {
      renderProjectDetailRoute(payload, route.projectId);
    } else {
      renderToday(payload.todayPlan, payload.assistantAgenda);
    }
  }

  function renderToday(todayPlan, agenda) {
    document.querySelectorAll("[data-route-view]").forEach(function (element) {
      element.hidden = element.dataset.routeView !== "today";
    });
    if (!todayPlan) {
      renderTaskQueue(agenda);
      return;
    }
    setText("today-task-count", todayPlan.tasks.length + " queued");
    setText("today-personal-count", todayPlan.personal.length + " queued");
    setText("planning-note-count", todayPlan.planningNotes.length + " recent");
    renderPlanItems("today-focus", todayPlan.focus, "No focus items.");
    renderCalendar("today-calendar", todayPlan.calendarEvents, "No calendar events today.");
    renderPlanItems("today-tasks", todayPlan.tasks, "No queued tasks.");
    renderPlanItems("today-personal", todayPlan.personal, "No personal tasks.");
    renderNotesInto("planning-notes", todayPlan.planningNotes, "No planning notes.");
  }

  function renderProjects(projects) {
    document.querySelectorAll("[data-route-view]").forEach(function (element) {
      element.hidden = element.dataset.routeView !== "projects";
    });
    if (!projects || projects.length === 0) {
      empty("project-grid", "No project intelligence yet.");
      return;
    }
    fill("project-grid", projects.map(function (project) {
      const updates = (project.keyUpdates || []).slice(0, 3).map(function (update) {
        return "<li>" + escapeHtml(update) + "</li>";
      }).join("");
      const actions = (project.actionItems || []).slice(0, 3).map(function (action) {
        return "<li>" + escapeHtml(action) + "</li>";
      }).join("");
      return [
        '<a class="project-card" href="#/projects/' + encodeURIComponent(project.projectId) + '">',
        '<div class="queue-title"><strong>' + escapeHtml(project.projectName) + '</strong>' + healthBadge(project.status) + '</div>',
        '<p>' + escapeHtml(project.headline || "No recent activity.") + '</p>',
        '<div class="project-meta">',
        tag(project.laneCount + " lanes", "ok"),
        tag(project.activeWorkstreamCount + " active", project.activeWorkstreamCount > 0 ? "warn" : "ok"),
        tag(project.unresolvedCaptureCount + " unresolved", project.unresolvedCaptureCount > 0 ? "danger" : "ok"),
        '</div>',
        updates ? '<h3>Updates</h3><ul>' + updates + '</ul>' : '',
        actions ? '<h3>Actions</h3><ul>' + actions + '</ul>' : '',
        '</a>',
      ].join("");
    }).join(""));
  }

  function renderProjectDetailRoute(payload, projectId) {
    document.querySelectorAll("[data-route-view]").forEach(function (element) {
      element.hidden = element.dataset.routeView !== "project-detail";
    });
    if (!state.detailCache.has(projectId)) {
      loadProjectDetail(projectId);
      renderProjectDetailLoading(projectId);
      return;
    }
    renderProjectDetail(state.detailCache.get(projectId), payload.projectIntelligenceSummaries);
  }

  function renderProjectDetailLoading(projectId) {
    setText("detail-project-id", projectId);
    setText("detail-project-name", "Loading");
    setText("detail-project-headline", "Fetching project report.");
    ["detail-lanes", "detail-tasks", "detail-notes", "detail-evidence", "detail-calendar", "detail-unresolved"].forEach(function (id) {
      empty(id, "Loading.");
    });
  }

  function renderProjectDetail(detail, summaries) {
    const summary = (summaries || []).find(function (item) {
      return item.projectId === detail.projectId;
    });
    setText("detail-project-id", detail.projectId || "project");
    setText("detail-project-name", detail.projectName || detail.projectId || "Project");
    setText("detail-project-headline", detail.headline || "No project report available.");
    setText("detail-lane-count", (detail.lanes || []).length + " lanes");
    setText("detail-task-count", (detail.tasks || []).length + " tasks");
    setText("detail-note-count", (detail.notes || []).length + " notes");
    setText("detail-evidence-count", (detail.evidenceLinks || []).length + " links");
    setText("detail-calendar-count", (detail.calendarEvents || []).length + " events");
    setText("detail-unresolved-count", (detail.unresolvedCaptures || []).length + " captures");

    fill("detail-meta", [
      healthBadge(detail.status),
      tag((detail.laneCount || 0) + " lanes", "ok"),
      tag((detail.activeWorkstreamCount || 0) + " active", detail.activeWorkstreamCount > 0 ? "warn" : "ok"),
      summary && summary.latestNoteAt ? tag("latest " + formatTime(summary.latestNoteAt), "ok") : "",
    ].join(""));

    renderLanes(detail.lanes || []);
    renderProjectTasks(detail.tasks || []);
    renderNotesInto("detail-notes", detail.notes || [], "No notes for this project.");
    renderEvidence("detail-evidence", detail.evidenceLinks || []);
    renderCalendar("detail-calendar", detail.calendarEvents || [], "No project calendar events.");
    renderUnresolved(detail.unresolvedCaptures || []);
  }

  function renderLanes(lanes) {
    if (lanes.length === 0) {
      empty("detail-lanes", "No lane activity.");
      return;
    }
    fill("detail-lanes", lanes.map(function (lane) {
      const meta = [
        tag(lane.noteCount + " notes", "ok"),
        tag(lane.taskCount + " tasks", lane.taskCount > 0 ? "warn" : "ok"),
        lane.unresolvedCaptureCount ? tag(lane.unresolvedCaptureCount + " unresolved", "danger") : "",
      ].join("");
      return queueItem(lane.laneId, lane.headline, meta);
    }).join(""));
  }

  function renderProjectTasks(tasks) {
    if (tasks.length === 0) {
      empty("detail-tasks", "No action items.");
      return;
    }
    fill("detail-tasks", tasks.map(function (task) {
      return queueItem(task.title, task.details || task.primaryContext, [
        tag(task.status, toneForTask(task.status)),
        task.laneId ? tag(task.laneId, "ok") : "",
        task.dueAt ? tag(formatTime(task.dueAt), "warn") : "",
      ].join("") + renderEvidenceInline(task.evidenceLinks));
    }).join(""));
  }

  function renderPlanItems(id, items, emptyMessage) {
    if (!items || items.length === 0) {
      empty(id, emptyMessage);
      return;
    }
    fill(id, items.map(function (item) {
      return queueItem(item.title, item.details, [
        item.projectId ? tag(item.projectId, "ok") : "",
        item.laneId ? tag(item.laneId, "ok") : "",
        item.status ? tag(item.status, toneForTask(item.status)) : "",
      ].join("") + renderEvidenceInline(item.evidenceLinks));
    }).join(""));
  }

  function renderCalendar(id, events, emptyMessage) {
    if (!events || events.length === 0) {
      empty(id, emptyMessage);
      return;
    }
    fill(id, events.map(function (event) {
      return queueItem(event.title, [
        formatTime(event.startsAt),
        event.details || "",
        event.location || "",
      ].filter(Boolean).join(" · "), [
        tag(event.syncStatus, event.syncStatus === "synced" ? "ok" : "warn"),
        event.laneId ? tag(event.laneId, "ok") : "",
      ].join("") + renderEvidenceInline(event.evidenceLinks));
    }).join(""));
  }

  function renderUnresolved(items) {
    if (items.length === 0) {
      empty("detail-unresolved", "No unresolved captures.");
      return;
    }
    fill("detail-unresolved", items.map(function (item) {
      return queueItem(item.excerpt || item.body, item.status || "unresolved", [
        item.laneId ? tag(item.laneId, "warn") : "",
        renderEvidenceInline(item.evidenceLinks),
      ].join(""));
    }).join(""));
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
      empty("today-tasks", "Assistant data unavailable.");
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
      empty("today-tasks", "No active tasks.");
      return;
    }
    fill("today-tasks", tasks.map(function (task) {
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
    renderNotesInto("note-list", notes, "No recent notes.");
  }

  function renderNotesInto(id, notes, emptyMessage) {
    if (!notes || notes.length === 0) {
      empty(id, emptyMessage);
      return;
    }
    fill(id, notes.map(function (note) {
      return queueItem(note.title, note.excerpt, [
        tag(note.context, "ok"),
        note.sourceProjectId ? tag(note.sourceProjectId, "warn") : "",
        note.laneId ? tag(note.laneId, "ok") : "",
      ].join("") + renderEvidenceInline(note.evidenceLinks));
    }).join(""));
  }

  function renderProjectTabs(projects) {
    if (!projects || projects.length === 0) {
      fill("project-tabs", "");
      return;
    }
    fill("project-tabs", projects.map(function (project) {
      return '<a href="#/projects/' + encodeURIComponent(project.projectId) + '">' + escapeHtml(project.projectName) + '</a>';
    }).join(""));
  }

  function renderEvidence(id, links) {
    if (!links || links.length === 0) {
      empty(id, "No evidence links.");
      return;
    }
    fill(id, links.map(function (link) {
      return evidenceLink(link, "queue-item evidence-item");
    }).join(""));
  }

  function renderEvidenceInline(links) {
    if (!links || links.length === 0) {
      return "";
    }
    return '<span class="evidence-inline">' + links.slice(0, 3).map(function (link) {
      return evidenceLink(link, "tag evidence-tag");
    }).join("") + '</span>';
  }

  function evidenceLink(link, className) {
    const label = escapeHtml(link.label || link.kind || "link");
    const target = String(link.target || "");
    const safeTarget = escapeHtml(target);
    if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("#")) {
      return '<a class="' + className + '" href="' + safeTarget + '" target="_blank" rel="noreferrer">' + label + '</a>';
    }
    if (target.startsWith("/api/")) {
      return '<a class="' + className + '" href="' + escapeHtml(state.apiBase + target) + '" target="_blank" rel="noreferrer">' + label + '</a>';
    }
    return '<span class="' + className + '" title="' + safeTarget + '">' + label + '</span>';
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
    [
      "today-focus",
      "today-calendar",
      "today-tasks",
      "today-personal",
      "planning-notes",
      "approval-list",
      "project-grid",
      "workstream-list",
      "report-list",
      "note-list",
    ].forEach(function (id) {
      empty(id, "No live data.");
    });
  }

  function routeFromHash() {
    const value = (location.hash || "#/today").replace(/^#/, "");
    const parts = value.split("/").filter(Boolean);
    if (parts[0] === "projects" && parts[1]) {
      return { view: "project-detail", projectId: decodeURIComponent(parts[1]) };
    }
    if (parts[0] === "projects") {
      return { view: "projects", projectId: null };
    }
    return { view: "today", projectId: null };
  }

  function setActiveRoute(view) {
    document.querySelectorAll("[data-route-link]").forEach(function (link) {
      link.toggleAttribute("aria-current", link.dataset.routeLink === view || (view === "project-detail" && link.dataset.routeLink === "projects"));
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
    if (!label && label !== 0) {
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
    if (status === "overdue" || status === "failed") {
      return "danger";
    }
    if (status === "inbox" || status === "open" || status === "scheduled") {
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

  function authHeaders() {
    return state.token ? { authorization: "Bearer " + state.token } : {};
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
