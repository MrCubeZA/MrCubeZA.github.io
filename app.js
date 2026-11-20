/* Window manager, start menu, and data-driven project rendering. */
(function () {
  "use strict";

  const APPS = {
    vs: { glyph: "VS", cls: "i-vs", title: "Visual Studio — Portfolio", pin: true },
    projects: { glyph: "PR", cls: "i-pr", title: "Projects", pin: true },
    about: { glyph: "i", cls: "i-ab", title: "About", pin: true },
    skills: { glyph: "SK", cls: "i-sk", title: "Skills", pin: true },
    cv: { glyph: "CV", cls: "i-cv", title: "Curriculum Vitae", pin: true },
    contact: { glyph: "@", cls: "i-co", title: "Contact", pin: true },
    video: { glyph: "▶", cls: "i-re", title: "Video Editing", pin: true },
    project: { glyph: "PR", cls: "i-pr", title: "Project", pin: false }
  };

  const PINNED = ["vs", "projects", "about", "skills", "cv", "contact", "video"];
  const W = (id) => document.getElementById("w-" + id);
  let z = 10;
  let activeDetailId = null;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function projectById(id) {
    return (window.PROJECTS || []).find((p) => p.id === id);
  }

  /* ---------- Render projects ---------- */
  function renderProjectCards(container, featuredOnly) {
    if (!container) return;
    const list = (window.PROJECTS || []).filter((p) => (featuredOnly ? p.featured : true));
    container.innerHTML = list
      .map((p) => {
        const artClass = p.iconClass || "i-pr";
        const flag = p.flagship ? " flagship" : "";
        const photo = p.cardImage;
        const photoClass = photo ? " has-photo" : "";
        const photoStyle = photo ? ` style="background-image:url('${escapeHtml(photo)}')"` : "";
        const badge = p.flagship
          ? '<span class="badge flagship">Flagship</span>'
          : p.featured
            ? '<span class="badge">Featured</span>'
            : "";
        return `<button type="button" class="pcard${flag}" data-project="${escapeHtml(p.id)}" aria-label="Open ${escapeHtml(p.name)}">
          <div class="pcard-art ${artClass}${photoClass}"${photoStyle}>
            <span class="letter">${escapeHtml(p.icon || p.name[0])}</span>
            ${badge}
          </div>
          <div class="pcard-body">
            <h3>${escapeHtml(p.name)}</h3>
            <div class="pills">${p.tech.map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join("")}</div>
            <p>${escapeHtml(p.short)}</p>
          </div>
        </button>`;
      })
      .join("");
    container.querySelectorAll("[data-project]").forEach((el) => {
      el.addEventListener("click", () => openProject(el.dataset.project));
    });
  }

  function renderTeam(container) {
    if (!container) return;
    container.innerHTML = (window.TEAM_PROJECTS || [])
      .map(
        (t) => `<div class="team-item">
          <small>${escapeHtml(t.area)}</small>
          <b>${escapeHtml(t.name)}</b>
          <p>${escapeHtml(t.description)}</p>
        </div>`
      )
      .join("");
  }

  const PROJECT_WIN_DEFAULT = { left: "360px", top: "48px", width: "720px", height: "760px" };
  const PROJECT_WIN_FLAGSHIP = { left: "280px", top: "28px", width: "820px", height: "900px" };

  function applyWinBox(win, box) {
    Object.entries(box).forEach(([k, v]) => { win.style[k] = v; });
    win.dataset.wantW = parseFloat(box.width);
    win.dataset.wantH = parseFloat(box.height);
    win.classList.remove("max", "min");
    fitWin(win);
  }

  /* ---------- Keep windows inside the screen ---------- */
  const EDGE = 8;
  function taskbarH() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tb")) || 48;
  }
  // Shrinks a window to the visible desktop (above the taskbar) and nudges it back on screen.
  // The designed size is remembered, so windows grow back when the browser gets bigger.
  function fitWin(w) {
    if (!w || innerWidth <= 860) return;
    if (!w.dataset.wantW) {
      w.dataset.wantW = w.offsetWidth || parseFloat(w.style.width) || parseFloat(getComputedStyle(w).width);
      w.dataset.wantH = w.offsetHeight || parseFloat(w.style.height) || parseFloat(getComputedStyle(w).height);
    }
    const aw = innerWidth, ah = innerHeight - taskbarH();
    const width = Math.min(+w.dataset.wantW, aw - EDGE * 2);
    const height = Math.min(+w.dataset.wantH, ah - EDGE * 2);
    w.style.width = width + "px";
    w.style.height = height + "px";
    const left = parseFloat(w.style.left) || w.offsetLeft || 0;
    const top = parseFloat(w.style.top) || w.offsetTop || 0;
    w.style.left = Math.max(EDGE, Math.min(left, aw - width - EDGE)) + "px";
    w.style.top = Math.max(EDGE, Math.min(top, ah - height - EDGE)) + "px";
  }

  // Opening layout: Visual Studio on the left, Projects docked to the right edge,
  // both sized to the screen so nothing hides under the taskbar or off the side.
  function layoutDesktop() {
    if (innerWidth <= 860) return;
    const aw = innerWidth, ah = innerHeight - taskbarH();
    const pr = W("projects"), vs = W("vs");
    const prW = Math.round(Math.max(420, Math.min(700, aw * 0.36)));
    const prLeft = aw - prW - 16;
    if (pr) {
      pr.style.width = prW + "px"; pr.style.height = (ah - 32) + "px";
      pr.style.left = prLeft + "px"; pr.style.top = "16px";
      pr.dataset.wantW = prW; pr.dataset.wantH = ah - 32;
    }
    if (vs) {
      const vsLeft = 110;
      const vsW = Math.max(560, Math.min(1040, prLeft - vsLeft - 16));
      const vsH = Math.min(680, ah - 36);
      vs.style.left = vsLeft + "px"; vs.style.top = "18px";
      vs.style.width = vsW + "px"; vs.style.height = vsH + "px";
      vs.dataset.wantW = vsW; vs.dataset.wantH = vsH;
    }
    document.querySelectorAll(".win").forEach(fitWin);
  }

  let fitTimer = 0;
  addEventListener("resize", () => {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(() => {
      if (!document.body.dataset.moved) layoutDesktop();
      else document.querySelectorAll(".win").forEach(fitWin);
    }, 120);
  });

  function markIcon(p) {
    const art = p.iconClass || "i-pr";
    if (p.iconImage) {
      return `<div class="ai ${art}" style="width:52px;height:52px;border-radius:12px"><img src="${escapeHtml(p.iconImage)}" alt=""></div>`;
    }
    return `<div class="ai ${art}" style="width:52px;height:52px;font-size:16px;border-radius:12px">${escapeHtml(p.icon || p.name[0])}</div>`;
  }

  function openProject(id) {
    const p = projectById(id);
    if (!p) return;
    activeDetailId = id;
    const win = W("project");
    applyWinBox(win, p.flagship ? PROJECT_WIN_FLAGSHIP : PROJECT_WIN_DEFAULT);
    const smIcon = win.querySelector(".wt .ai");
    if (smIcon) {
      smIcon.className = "ai sm " + (p.iconClass || "i-pr");
      smIcon.textContent = p.iconImage ? "" : (p.icon || p.name[0]);
      if (p.iconImage) smIcon.style.backgroundImage = "url('" + p.iconImage + "')";
      else smIcon.style.backgroundImage = "";
    }
    win.querySelector(".tt").innerHTML = `<b>${escapeHtml(p.name)}</b> — Project`;
    const highlights = p.highlights
      ? `<div class="sec-label">${p.flagship ? "In this build" : "Key features"}</div>
         <ul>${p.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
      : "";
    const planned = p.planned
      ? `<div class="sec-label">Planned — not in the current build</div>
         <ul class="planned">${p.planned.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
      : "";
    const wrapClass = p.imageStyle === "logo" ? "erd-wrap logo-wrap" : p.flagship ? "erd-wrap art-wrap" : "erd-wrap";
    const gallery = Array.isArray(p.gallery) && p.gallery.length
      ? `<div class="sec-label">Screenshots</div>
         <div class="shots">${p.gallery.map((g) => `<figure class="shot"><img src="${escapeHtml(g.src)}" alt="${escapeHtml(g.alt || p.name + " screenshot")}" loading="lazy">${g.caption ? `<figcaption class="figcap">${escapeHtml(g.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`
      : "";
    const img = p.image
      ? `<div class="sec-label">Visual</div>
         <figure class="${wrapClass}"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.imageCaption || "Project visual")}">
         ${p.imageCaption ? `<figcaption class="figcap">${escapeHtml(p.imageCaption)}</figcaption>` : ""}</figure>`
      : "";
    const repo = p.repo
      ? `<a class="btn p" href="${escapeHtml(p.repo)}" target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>`
      : "";
    const status = p.status ? `<p class="status-call">${escapeHtml(p.status)}</p>` : "";
    const note = p.note ? `<p class="note-call">${escapeHtml(p.note)}</p>` : "";
    const tech = `<div class="sec-label">Tech</div>
      <div class="pills">${p.tech.map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join("")}</div>`;
    win.querySelector(".detail").innerHTML = `
      <div class="about-head" style="align-items:center">
        ${markIcon(p)}
        <div class="who">
          <h2>${escapeHtml(p.name)}</h2>
          ${p.flagship ? '<p class="lede" style="margin:4px 0 0">Reader App</p>' : ""}
          ${repo ? `<div style="margin-top:10px">${repo}</div>` : ""}
        </div>
      </div>
      ${status}${note}
      <div class="sec-label">Overview</div>
      <p>${escapeHtml(p.description)}</p>
      ${highlights}${planned}${tech}${gallery}${img}`;
    const pane = win.querySelector(".pane");
    if (pane) pane.scrollTop = 0;
    openApp("project");
  }

  /* ---------- Visual Studio code tabs ---------- */
  function csharpString(s) {
    return `<span class="s">"${escapeHtml(s)}"</span>`;
  }

  function renderProfileCs() {
    const projects = window.PROJECTS || [];
    const lines = [];
    const push = (html) => lines.push(html);
    push(`<span class="cm">// Profile.cs — CursingCube.Portfolio</span>`);
    push(`<span class="k">namespace</span> <span class="ty">CursingCube.Portfolio</span>;`);
    push(``);
    push(`<span class="cm">/// &lt;summary&gt;</span>`);
    push(`<span class="cm">///</span>   <span class="big">TIMOTHY</span>   <span class="cm">· @MrCubeZA</span>`);
    push(`<span class="cm">///   Junior Developer &amp; video editor. Open to work.</span>`);
    push(`<span class="cm">/// &lt;/summary&gt;</span>`);
    push(`<span class="k">public sealed class</span> <span class="ty">Developer</span>`);
    push(`{`);
    push(`    <span class="k">public string</span> <span class="pr">Name</span>   <span class="p">=&gt;</span> ${csharpString("Timothy Miller")};`);
    push(`<span class="hl">    <span class="k">public string</span> <span class="pr">GitHub</span> <span class="p">=&gt;</span> ${csharpString("github.com/MrCubeZA")};</span>`);
    push(`    <span class="k">public string</span>[] <span class="pr">Roles</span> <span class="p">=&gt;</span> [${csharpString("Junior Developer")}, ${csharpString("Video Editor")}];`);
    push(``);
    push(`    <span class="k">public</span> <span class="ty">IReadOnlyList</span>&lt;<span class="ty">Project</span>&gt; <span class="pr">Projects</span> { <span class="k">get</span>; } =`);
    push(`    [`);
    projects.forEach((p, i) => {
      const comma = i < projects.length - 1 ? "," : "";
      if (p.repo) {
        const repo = p.repo.replace(/^https:\/\//, "");
        push(`        <span class="k">new</span>(`);
        push(`            ${csharpString(p.name)},`);
        push(`            ${csharpString(p.tech.join(", "))},`);
        push(`            <span class="pr">Repo</span>: ${csharpString(repo)})${comma}`);
      } else {
        push(`        <span class="k">new</span>(`);
        push(`            ${csharpString(p.name)},`);
        push(`            ${csharpString(p.tech.join(", "))},`);
        push(`            <span class="pr">IsPublic</span>: <span class="k">false</span>)${comma}`);
      }
    });
    push(`    ];`);
    push(`}`);
    return lines.join("\n");
  }

  function renderProjectsCs() {
    const projects = window.PROJECTS || [];
    const lines = [];
    lines.push(`<span class="cm">// Projects.cs — sourced from projects.js</span>`);
    lines.push(`<span class="k">namespace</span> <span class="ty">CursingCube.Portfolio</span>;`);
    lines.push(``);
    lines.push(`<span class="k">public record</span> <span class="ty">Project</span>(`);
    lines.push(`    <span class="k">string</span> <span class="pr">Name</span>,`);
    lines.push(`    <span class="k">string</span> <span class="pr">Stack</span>,`);
    lines.push(`    <span class="k">string</span>? <span class="pr">Repo</span> = <span class="k">null</span>,`);
    lines.push(`    <span class="k">bool</span> <span class="pr">IsPublic</span> = <span class="k">true</span>);`);
    lines.push(``);
    projects.forEach((p) => {
      lines.push(`<span class="cm">// ${escapeHtml(p.name)}${p.flagship ? "  [flagship]" : p.featured ? "  [featured]" : ""}</span>`);
      lines.push(`<span class="cm">// ${escapeHtml(p.short)}</span>`);
    });
    return lines.join("\n");
  }

  function renderReadmeMd() {
    const featured = (window.PROJECTS || []).filter((p) => p.featured);
    const lines = [];
    lines.push(`<span class="cm"># Timothy Miller</span>`);
    lines.push(`<span class="cm">Junior Developer at the Future Innovation Lab,</span>`);
    lines.push(`<span class="cm">University of the Western Cape (since May 2026).</span>`);
    lines.push(``);
    lines.push(`<span class="cm">## Featured projects</span>`);
    featured.forEach((p) => {
      lines.push(`<span class="cm">- ${escapeHtml(p.name)}${p.flagship ? " (flagship)" : ""} — ${escapeHtml(p.short)}</span>`);
    });
    lines.push(``);
    lines.push(`<span class="cm">GitHub: github.com/MrCubeZA</span>`);
    lines.push(`<span class="cm">YouTube: youtube.com/@MrCube773</span>`);
    return lines.join("\n");
  }

  function setVsTab(name) {
    const src = document.getElementById("src");
    const map = { profile: renderProfileCs, projects: renderProjectsCs, readme: renderReadmeMd };
    src.innerHTML = (map[name] || renderProfileCs)();
    const n = src.textContent.split("\n").length;
    document.getElementById("lnum").innerHTML = Array.from({ length: n }, (_, i) => i + 1).join("<br>");
    document.querySelectorAll(".dtabs [data-tab]").forEach((t) => t.classList.toggle("on", t.dataset.tab === name));
    document.querySelectorAll(".tn[data-tab]").forEach((t) => t.classList.toggle("on", t.dataset.tab === name));
  }

  function renderSolutionTree() {
    const tree = document.getElementById("sol-tree");
    if (!tree) return;
    const projects = window.PROJECTS || [];
    const rows = [];
    rows.push(`<div class="tn"><span class="g">⌄</span><span class="fi" style="color:#ff6ad5">◆</span>Solution 'CursingCube.Portfolio'</div>`);
    projects.forEach((p) => {
      const lock = p.repo ? "" : `<span class="pk">${p.flagship ? "private · flagship" : "private"}</span>`;
      const color = p.iconClass === "i-tomus" ? "#E2B15A" : p.iconClass === "i-flix" ? "var(--m)" : p.featured ? "var(--c)" : "var(--g)";
      rows.push(`<div class="tn" style="--l:1" data-project="${escapeHtml(p.id)}"><span class="g">›</span><span class="fi" style="color:${color}">▣</span><b style="font-weight:600">${escapeHtml(p.name)}</b>${lock}</div>`);
    });
    rows.push(`<div class="tn" style="--l:1"><span class="g">⌄</span><span class="fi" style="color:#9fb3ff">▣</span>Portfolio.Web</div>`);
    rows.push(`<div class="tn on" style="--l:2" data-tab="profile"><span class="g"></span><span class="fi" style="color:#9fb3ff">C#</span>Profile.cs</div>`);
    rows.push(`<div class="tn" style="--l:2" data-tab="projects"><span class="g"></span><span class="fi" style="color:#9fb3ff">C#</span>Projects.cs</div>`);
    rows.push(`<div class="tn" style="--l:2" data-app="about"><span class="g"></span><span class="fi" style="color:#8a95ab">≡</span>About.txt</div>`);
    rows.push(`<div class="tn" style="--l:2" data-app="cv"><span class="g"></span><span class="fi" style="color:#7a8cff">▤</span>CV.pdf</div>`);
    rows.push(`<div class="tn" style="--l:2" data-app="contact"><span class="g"></span><span class="fi" style="color:var(--y)">{}</span>contact.json</div>`);
    rows.push(`<div class="tn" style="--l:2" data-app="video"><span class="g"></span><span class="fi" style="color:#ff2b4a">▶</span>video-editing</div>`);
    tree.innerHTML = rows.join("");
    tree.querySelectorAll("[data-project]").forEach((n) => {
      n.addEventListener("dblclick", () => openProject(n.dataset.project));
    });
    tree.querySelectorAll("[data-tab]").forEach((n) => {
      n.addEventListener("click", () => setVsTab(n.dataset.tab));
    });
    tree.querySelectorAll("[data-app]").forEach((n) => {
      n.addEventListener("dblclick", () => openApp(n.dataset.app));
    });
  }

  /* ---------- Window manager ---------- */
  function state(id) {
    const w = W(id);
    if (!w) return "closed";
    return w.classList.contains("closed") ? "closed" : w.classList.contains("min") ? "min" : "open";
  }

  function renderTaskbar() {
    const tbc = document.getElementById("tbc");
    tbc.querySelectorAll(".app").forEach((e) => e.remove());
    const list = [...PINNED, ...Object.keys(APPS).filter((a) => !PINNED.includes(a) && state(a) !== "closed")];
    list.forEach((id) => {
      const meta = APPS[id];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tbb app";
      b.title = id === "project" && activeDetailId ? (projectById(activeDetailId) || {}).name || meta.title : meta.title;
      const s = state(id);
      if (s !== "closed") b.classList.add("open");
      if (s === "open" && W(id).classList.contains("focus")) b.classList.add("active");
      const glyph = id === "project" && activeDetailId ? (projectById(activeDetailId) || {}).icon || meta.glyph : meta.glyph;
      const cls = id === "project" && activeDetailId ? (projectById(activeDetailId) || {}).iconClass || meta.cls : meta.cls;
      b.innerHTML = `<div class="ai md ${cls}">${escapeHtml(glyph)}</div>`;
      b.addEventListener("click", () => toggle(id));
      tbc.appendChild(b);
    });
  }

  function focusApp(id) {
    document.querySelectorAll(".win").forEach((w) => w.classList.remove("focus"));
    const w = W(id);
    w.classList.add("focus");
    w.style.zIndex = ++z;
    renderTaskbar();
  }

  function openApp(id) {
    const w = W(id);
    if (!w) return;
    w.classList.remove("closed", "min");
    fitWin(w);
    focusApp(id);
    closeStart();
  }

  function toggle(id) {
    const s = state(id);
    const w = W(id);
    if (s === "open" && w.classList.contains("focus")) {
      w.classList.add("min");
      w.classList.remove("focus");
      renderTaskbar();
    } else {
      openApp(id);
    }
  }

  function wireWindows() {
    document.querySelectorAll(".win").forEach((w) => {
      const id = w.dataset.app;
      const t = w.querySelector(".wt");
      w.addEventListener("mousedown", () => {
        if (!w.classList.contains("focus")) focusApp(id);
      });
      w.querySelector(".mn").addEventListener("click", (e) => {
        e.stopPropagation();
        w.classList.add("min");
        w.classList.remove("focus");
        renderTaskbar();
      });
      w.querySelector(".mx").addEventListener("click", (e) => {
        e.stopPropagation();
        w.classList.toggle("max");
      });
      w.querySelector(".x").addEventListener("click", (e) => {
        e.stopPropagation();
        w.classList.add("closed");
        w.classList.remove("focus", "max");
        renderTaskbar();
      });
      t.addEventListener("dblclick", (e) => {
        if (!e.target.closest(".ctl")) w.classList.toggle("max");
      });
      t.addEventListener("mousedown", (e) => {
        if (e.target.closest(".ctl") || w.classList.contains("max")) return;
        if (e.button !== 0) return;
        const sx = e.clientX - w.offsetLeft;
        const sy = e.clientY - w.offsetTop;
        const mv = (ev) => {
          w.style.left = Math.min(innerWidth - 80, Math.max(-w.offsetWidth + 120, ev.clientX - sx)) + "px";
          w.style.top = Math.min(innerHeight - 90, Math.max(0, ev.clientY - sy)) + "px";
        };
        document.body.dataset.moved = "1";
        const up = () => {
          removeEventListener("mousemove", mv);
          removeEventListener("mouseup", up);
        };
        addEventListener("mousemove", mv);
        addEventListener("mouseup", up);
      });
    });
  }

  /* ---------- Desktop icons ---------- */
  function wireIcons() {
    document.querySelectorAll(".ico").forEach((i) => {
      i.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".ico").forEach((x) => x.classList.remove("sel"));
        i.classList.add("sel");
      });
      i.addEventListener("dblclick", () => {
        if (i.dataset.project) openProject(i.dataset.project);
        else openApp(i.dataset.app);
      });
    });
    document.addEventListener("mousedown", (e) => {
      if (!e.target.closest(".ico")) document.querySelectorAll(".ico").forEach((x) => x.classList.remove("sel"));
    });
    document.querySelectorAll(".ico").forEach((i) => {
      i.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (i.dataset.project) openProject(i.dataset.project);
          else openApp(i.dataset.app);
        }
      });
    });
  }

  /* ---------- Start menu ---------- */
  const sm = document.getElementById("smenu");
  const sb = document.getElementById("startBtn");
  const searchInput = document.getElementById("start-search");

  function closeStart() {
    sm.classList.remove("on");
    sb.classList.remove("on");
    if (searchInput) searchInput.value = "";
    filterStart("");
  }

  function openStart() {
    sm.classList.add("on");
    sb.classList.add("on");
    if (searchInput) setTimeout(() => searchInput.focus(), 0);
  }

  function filterStart(q) {
    q = q.trim().toLowerCase();
    let shown = 0;
    sm.querySelectorAll("[data-app], [data-project]").forEach((el) => {
      const hay = (el.dataset.search || el.textContent || "").toLowerCase();
      const hide = q && !hay.includes(q);
      el.classList.toggle("hidden", hide);
      if (!hide && (el.matches(".pin") || el.matches(".rec"))) shown++;
    });
    sm.classList.toggle("no-results", Boolean(q) && shown === 0);
  }

  function wireStart() {
    sb.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sm.classList.contains("on")) closeStart();
      else openStart();
    });
    sm.addEventListener("mousedown", (e) => e.stopPropagation());
    sm.querySelectorAll("[data-app], [data-project]").forEach((el) => {
      el.addEventListener("click", () => {
        if (el.dataset.project) openProject(el.dataset.project);
        else openApp(el.dataset.app);
      });
    });
    document.getElementById("tb-search").addEventListener("click", (e) => {
      e.stopPropagation();
      openStart();
    });
    document.addEventListener("mousedown", (e) => {
      if (!e.target.closest("#smenu, #startBtn, #tb-search")) closeStart();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeStart();
    });
    searchInput.addEventListener("input", () => filterStart(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const first = sm.querySelector(".pin:not(.hidden)[data-app], .rec:not(.hidden)[data-app], .rec:not(.hidden)[data-project]");
      if (!first) return;
      if (first.dataset.project) openProject(first.dataset.project);
      else openApp(first.dataset.app);
    });
    document.getElementById("pwr").addEventListener("click", () => closeStart());
  }

  /* ---------- Clock (Africa/Johannesburg, SAST) ---------- */
  function tick() {
    const d = new Date();
    const o = { timeZone: "Africa/Johannesburg" };
    const t = d.toLocaleTimeString("en-GB", { ...o, hour: "2-digit", minute: "2-digit" });
    document.getElementById("clk").innerHTML = t + "<small>SAST</small>";
    document.getElementById("dte").textContent = d.toLocaleDateString("en-CA", o).replace(/-/g, "/");
  }

  /* ---------- VS Start launches featured project ---------- */
  function wireVs() {
    document.getElementById("vsStart").addEventListener("click", () => {
      const o = document.getElementById("olog");
      o.innerHTML += '<br>Launching Tomus… <span class="ok">opening project</span>';
      o.scrollTop = 1e9;
      openProject("tomus");
    });
    document.querySelectorAll(".dtabs [data-tab]").forEach((t) => {
      t.addEventListener("click", () => setVsTab(t.dataset.tab));
    });
  }

  /* ---------- Mobile layout ---------- */
  function renderMobile() {
    const root = document.getElementById("m-projects");
    renderProjectCards(root, false);
    renderTeam(document.getElementById("m-team"));
  }

  /* ---------- Init ---------- */
  function init() {
    renderProjectCards(document.getElementById("project-cards"), false);
    renderTeam(document.getElementById("team-list"));
    renderSolutionTree();
    setVsTab("profile");
    renderMobile();
    wireWindows();
    layoutDesktop();
    wireIcons();
    wireStart();
    wireVs();
    tick();
    setInterval(tick, 15000);
    renderTaskbar();
    if (location.hash === "#start") openStart();
    if (location.hash === "#projects") openApp("projects");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // Expose a couple of helpers for the verification script
  window.portfolioAPI = { openApp, openProject, closeStart, openStart, toggle };
})();
