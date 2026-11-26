/* =====================================================================
   Muhammad Ajmal — Portfolio app
   Renders every section from config.js and wires up interactions.
   No build step, no dependencies.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.PORTFOLIO;
  if (!C) { console.error("config.js missing"); return; }
  var P = C.person;
  var doc = document, root = doc.documentElement;
  var $ = function (s, el) { return (el || doc).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); };
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(pointer: fine)").matches;

  /* ---------- helpers ---------- */
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) {
    u = String(u || "").trim();
    return /^(https?:|mailto:|tel:|#|[\w./-]+$)/i.test(u) ? u : "";
  }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function ym(s) { var p = String(s).split("-"); return { y: +p[0], m: p[1] ? +p[1] - 1 : 0 }; }
  function fmtMonth(s) { if (!s) return "Present"; var d = ym(s); return (String(s).indexOf("-") > 0 ? MONTHS[d.m] + " " : "") + d.y; }
  function monthsBetween(a, b) {
    var x = ym(a), now = new Date(), y = b ? ym(b) : { y: now.getFullYear(), m: now.getMonth() };
    return (y.y - x.y) * 12 + (y.m - x.m) + 1;
  }
  function fmtDuration(n) {
    var y = Math.floor(n / 12), m = n % 12, out = [];
    if (y) out.push(y + (y > 1 ? " yrs" : " yr"));
    if (m) out.push(m + (m > 1 ? " mos" : " mo"));
    return out.join(" ") || "1 mo";
  }
  function chips(list, cls) {
    return (list || []).map(function (t) { return '<li class="chip' + (cls ? " " + cls : "") + '">' + esc(t) + "</li>"; }).join("");
  }
  function head(id, eyebrow, title, text) {
    return '<div class="head"><span class="eyebrow rv">' + esc(eyebrow) + '</span><h2 id="' + id + '-h" class="rv" style="--d:80ms">' + title +
      "</h2>" + (text ? '<p class="rv" style="--d:160ms">' + esc(text) + "</p>" : "") + "</div>";
  }

  /* ---------- icons (Lucide-style, inline) ---------- */
  var I = {
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    cloud: '<path d="M17.5 19H8a5 5 0 1 1 .9-9.9A6.5 6.5 0 0 1 21 11.5 4 4 0 0 1 17.5 19Z"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3Z"/><path d="M14.7 6.3 17 4a4 4 0 0 1 3 3l-2.3 2.3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    boxes: '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85M7 16.5l5-3M7 16.5v5.17M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3ZM17 16.5l-5-3M17 16.5l4.74-2.85M17 16.5v5.17M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8ZM12 8 7.26 5.15M12 8l4.74-2.85M12 13.5V8"/>',
    plug: '<path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    down: '<path d="M12 3v13M6 11l6 6 6-6M5 21h14"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',
    linkedin: '<path class="fill" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>',
    github: '<path class="fill" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/>',
    whatsapp: '<path class="fill" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3Z"/>'
  };
  function ic(name, cls) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + ">" + (I[name] || I.code) + "</svg>"; }

  /* ---------- illustrated project previews ---------- */
  var ART = {
    erp: '<svg viewBox="0 0 400 250" aria-hidden="true" style="stroke:none"><rect x="40" y="30" width="320" height="190" rx="14" fill="var(--surface)"/><rect x="40" y="30" width="80" height="190" rx="14" fill="var(--accent)"/><rect x="56" y="54" width="46" height="7" rx="3.5" fill="#fff" opacity=".85"/><rect x="56" y="74" width="36" height="7" rx="3.5" fill="#fff" opacity=".5"/><rect x="56" y="94" width="42" height="7" rx="3.5" fill="#fff" opacity=".5"/><rect x="56" y="114" width="32" height="7" rx="3.5" fill="#fff" opacity=".5"/><rect x="140" y="50" width="96" height="44" rx="10" fill="var(--accent-soft-2)"/><rect x="246" y="50" width="96" height="44" rx="10" fill="var(--ember-soft)"/><rect x="152" y="62" width="40" height="7" rx="3.5" fill="var(--accent)"/><rect x="258" y="62" width="40" height="7" rx="3.5" fill="var(--ember)"/><g fill="var(--accent)"><rect class="bar" x="152" y="130" width="26" height="72" rx="5"/><rect class="bar" x="190" y="110" width="26" height="92" rx="5" opacity=".75"/><rect class="bar" x="228" y="146" width="26" height="56" rx="5" fill="var(--ember)"/><rect class="bar" x="266" y="104" width="26" height="98" rx="5" opacity=".55"/></g><rect x="304" y="118" width="40" height="84" rx="8" fill="var(--surface-2)"/></svg>',
    pos: '<svg viewBox="0 0 400 250" aria-hidden="true" style="stroke:none"><rect x="120" y="22" width="160" height="206" rx="14" fill="var(--surface)"/><rect x="140" y="44" width="120" height="12" rx="6" fill="var(--accent)"/><g fill="var(--mute)" opacity=".45"><rect x="140" y="76" width="74" height="8" rx="4"/><rect x="140" y="100" width="62" height="8" rx="4"/><rect x="140" y="124" width="82" height="8" rx="4"/><rect x="140" y="148" width="56" height="8" rx="4"/></g><g fill="var(--ember)"><rect x="232" y="76" width="28" height="8" rx="4"/><rect x="232" y="100" width="28" height="8" rx="4"/><rect x="232" y="124" width="28" height="8" rx="4"/><rect x="232" y="148" width="28" height="8" rx="4"/></g><path d="M140 172h120" stroke="var(--line-2)" stroke-width="2" stroke-dasharray="5 5"/><rect x="200" y="186" width="60" height="16" rx="8" fill="var(--ink)"/><g class="beat"><circle cx="318" cy="64" r="24" fill="var(--accent)"/><path d="m306 64 8 8 14-16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g><rect x="56" y="150" width="44" height="58" rx="8" fill="var(--accent-soft-2)"/><rect x="64" y="162" width="28" height="6" rx="3" fill="var(--accent)"/></svg>',
    home: '<svg viewBox="0 0 400 250" aria-hidden="true" style="stroke:none"><rect x="40" y="30" width="320" height="190" rx="14" fill="var(--surface)"/><rect x="60" y="50" width="180" height="26" rx="13" fill="var(--surface-2)"/><circle cx="78" cy="63" r="6" fill="none" stroke="var(--accent)" stroke-width="3"/><rect x="252" y="50" width="88" height="26" rx="13" fill="var(--accent)"/><g><rect x="60" y="94" width="86" height="106" rx="10" fill="var(--accent-soft-2)"/><path d="M103 112 78 132h8v22h34v-22h8Z" fill="var(--accent)"/><rect x="70" y="166" width="60" height="7" rx="3.5" fill="var(--ink)" opacity=".7"/><rect x="70" y="180" width="38" height="7" rx="3.5" fill="var(--ember)"/></g><g><rect x="157" y="94" width="86" height="106" rx="10" fill="var(--ember-soft)"/><path d="M200 112 175 132h8v22h34v-22h8Z" fill="var(--ember)"/><rect x="167" y="166" width="60" height="7" rx="3.5" fill="var(--ink)" opacity=".7"/><rect x="167" y="180" width="38" height="7" rx="3.5" fill="var(--accent)"/></g><g><rect x="254" y="94" width="86" height="106" rx="10" fill="var(--accent-soft-2)"/><path d="M297 112 272 132h8v22h34v-22h8Z" fill="var(--accent)"/><rect x="264" y="166" width="60" height="7" rx="3.5" fill="var(--ink)" opacity=".7"/><rect x="264" y="180" width="38" height="7" rx="3.5" fill="var(--ember)"/></g><g class="beat"><circle cx="330" cy="96" r="16" fill="var(--ember)"/><circle cx="330" cy="96" r="6" fill="#fff"/></g></svg>'
  };
  function preview(item) {
    var src = safeUrl(item.image);
    if (src) return '<img src="' + esc(src) + '" alt="Screenshot of ' + esc(item.title || item.name) + '" loading="lazy" decoding="async" width="800" height="500">';
    return (ART[item.art] || ART.erp) + '<span class="shot-tag">Illustration</span>';
  }

  /* ---------- derived numbers (only from real data) ---------- */
  var expMonths = monthsBetween(P.careerStart, null);
  var years = Math.floor(expMonths / 12);
  var techCount = (function () {
    var seen = {};
    C.skills.forEach(function (g) { if (g.countable === false) return; g.items.forEach(function (t) { seen[t.toLowerCase()] = 1; }); });
    return Object.keys(seen).length;
  })();
  var socials = C.social.filter(function (s) { return safeUrl(s.url); });
  function socialLinks() {
    return socials.map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + ' (opens in new tab)">' + ic(s.icon) + "</a>"; }).join("");
  }

  /* =================== RENDER =================== */

  /* ---------- Hero ---------- */
  var nameWords = P.name.split(" ");
  $("#home").innerHTML =
    '<div class="hero-bg" aria-hidden="true"><div class="hero-grid" data-par="0.15"></div><div class="glow a" data-par="-0.25"></div><div class="glow b" data-par="0.2"></div></div>' +
    '<div class="container hero-inner">' +
      '<div class="hero-copy">' +
        (P.availability.open ? '<div class="status rv"><span class="status-dot"></span>' + esc(P.availability.label) + "</div>" : "") +
        '<h1 id="heroName" aria-label="' + esc(P.name) + '">' + nameWords.map(function (w, i) {
          return '<span class="w' + (i === nameWords.length - 1 ? " last" : "") + '" aria-hidden="true">' + w.split("").map(function (c) { return '<span class="ch">' + esc(c) + "</span>"; }).join("") + "</span>";
        }).join(" ") + "</h1>" +
        '<p class="role rv" style="--d:300ms"><span class="sr">' + esc(P.title) + '</span><span aria-hidden="true"><span class="role-text" id="roleText">' + esc(P.roles[0]) + '</span><span class="caret"></span></span></p>' +
        '<p class="hero-sum rv" style="--d:420ms">' + esc(P.summary) + "</p>" +
        '<div class="hero-cta rv" style="--d:540ms">' +
          '<a class="btn btn-primary mag" href="#contact">Hire me ' + ic("arrow", "mv") + "</a>" +
          '<a class="btn btn-ghost mag" href="#projects">View projects</a>' +
          '<a class="btn btn-ghost mag" href="' + esc(P.resume) + '" download>Download resume ' + ic("down", "dn") + "</a>" +
        "</div>" +
        '<div class="hero-meta rv" style="--d:660ms"><span class="loc">' + ic("pin") + esc(P.location) + '</span><div class="socials">' + socialLinks() + "</div></div>" +
      "</div>" +
      '<div class="visual" data-tilt>' +
        '<div class="frame" aria-hidden="true"></div>' +
        '<div class="photo"><picture><source srcset="' + esc(P.photo) + '" type="image/webp"><img src="' + esc(P.photoFallback) + '" alt="' + esc(P.photoAlt) + '" width="640" height="800" fetchpriority="high"></picture></div>' +
        '<div class="float stat-float" aria-hidden="true"><strong>' + years + '+</strong><span>years of<br>experience</span></div>' +
        '<div class="float code" aria-hidden="true"><div class="code-bar"><i></i><i></i><i></i><span>Developer.cs</span></div><pre id="codeOut"></pre></div>' +
      "</div>" +
    "</div>" +
    '<a class="scroll-cue" href="#about" aria-label="Scroll to About section"><span class="mouse"></span>Scroll</a>';

  /* ---------- About ---------- */
  var exp0 = C.experience[0];
  $("#about").innerHTML = '<div class="container">' + head("about", "About me", "Engineer of business systems that people use every day", "") +
    '<div class="about-grid">' +
      '<div class="about-text">' +
        P.about.map(function (t, i) { return '<p class="rv" style="--d:' + i * 80 + 'ms">' + esc(t) + "</p>"; }).join("") +
        '<div class="objective rv"><h3>Career objective</h3><p>' + esc(P.objective) + "</p></div>" +
        '<h3 class="sub rv">' + ic("star") + "Professional strengths</h3>" +
        '<ul class="strengths">' + P.strengths.map(function (s, i) { return '<li class="rv" style="--d:' + i * 70 + 'ms">' + ic("check") + "<span>" + esc(s) + "</span></li>"; }).join("") + "</ul>" +
      "</div>" +
      '<div class="about-side">' +
        '<div class="stats">' +
          stat(years, "+", "Years in software development", 0) +
          stat(C.projects.length, "", "Systems & projects delivered", 80) +
          stat(techCount, "", "Technical skills", 160) +
          stat(C.experience.length, "", "Organisations served", 240) +
        "</div>" +
        '<div class="card avail rv"><h3><span class="status-dot"></span>' + esc(P.availability.label) + '</h3><ul class="chips">' + chips(P.availability.modes, "accent") + "</ul>" +
          (P.availability.relocation ? "<p>" + ic("globe") + "<span>" + esc(P.availability.relocation) + "</span></p>" : "") + "</div>" +
        '<dl class="card facts rv">' +
          fact("Based in", P.location) + fact("From", P.hometown) + fact("Current role", exp0 ? exp0.role + ", " + exp0.company : "") +
          fact("Languages", P.languages.map(function (l) { return l.name; }).join(", ")) +
          fact("Interests", P.interests.join(" · ")) + fact("Outside work", P.hobbies.join(", ")) +
        "</dl>" +
      "</div>" +
    "</div></div>";
  function stat(n, suf, label, d) { return '<div class="card stat spot rv rv-s" style="--d:' + d + 'ms"><strong><span data-count="' + n + '">0</span><em>' + suf + "</em></strong><span>" + esc(label) + "</span></div>"; }
  function fact(k, v) { return v ? "<div><dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd></div>" : ""; }

  /* ---------- Skills ---------- */
  $("#skills").innerHTML = '<div class="container">' + head("skills", "Technical skills", "The stack I build with", "From database to deployment — the languages, frameworks and tools I use on real projects.") +
    '<div class="skills-grid">' + C.skills.map(function (g, i) {
      return '<article class="card skill spot lift rv" style="--d:' + (i % 4) * 80 + 'ms"><div class="skill-top"><span class="ico">' + ic(g.icon) + "</span><h3>" + esc(g.group) +
        '</h3><span class="skill-count">' + g.items.length + '</span></div><ul class="chips">' + chips(g.items) + "</ul></article>";
    }).join("") + "</div></div>";

  /* ---------- Experience ---------- */
  $("#experience").innerHTML = '<div class="container">' + head("experience", "Work experience", "Where I've worked", "My professional journey, most recent first.") +
    '<ol class="timeline" data-timeline><span class="tl-fill" aria-hidden="true"></span>' + C.experience.map(function (j) {
      var dur = fmtDuration(monthsBetween(j.start, j.end));
      return '<li class="tl-item rv"><span class="tl-node" aria-hidden="true"></span><article class="card job spot">' +
        '<div class="job-head"><h3>' + esc(j.role) + '</h3><span class="date"><time datetime="' + esc(j.start) + '">' + fmtMonth(j.start) + "</time> – " +
        (j.end ? '<time datetime="' + esc(j.end) + '">' + fmtMonth(j.end) + "</time>" : "Present") + " · " + dur + "</span></div>" +
        '<div class="job-org"><b>' + esc(j.company) + "</b><span>" + esc(j.location) + "</span></div>" +
        (j.summary ? '<p class="job-sum">' + esc(j.summary) + "</p>" : "") +
        (j.highlights && j.highlights.length ? '<h4 class="sub">' + ic("star") + 'Key achievements</h4><ul class="hl">' + j.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" : "") +
        '<h4 class="sub">' + ic("check") + 'Responsibilities</h4><ul class="bul">' + j.responsibilities.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" +
        (j.tech && j.tech.length ? '<ul class="chips" aria-label="Technologies used">' + chips(j.tech, "accent") + "</ul>" : "") +
        "</article></li>";
    }).join("") + "</ol></div>";

  /* ---------- Projects ---------- */
  var cats = ["All"].concat(C.projects.reduce(function (a, p) { if (a.indexOf(p.category) < 0) a.push(p.category); return a; }, []));
  $("#projects").innerHTML = '<div class="container">' + head("projects", "Projects", "Systems I've built and contributed to", "Enterprise and web projects from my work. Open any project for details.") +
    '<div class="filters rv" role="group" aria-label="Filter projects by category"><span class="filter-pill" aria-hidden="true"></span>' +
      cats.map(function (c, i) {
        var n = c === "All" ? C.projects.length : C.projects.filter(function (p) { return p.category === c; }).length;
        return '<button type="button" data-filter="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + "<span>" + n + "</span></button>";
      }).join("") +
    '</div><div class="projects-grid" id="projectGrid">' + C.projects.map(function (p, i) {
      return '<article class="card project spot lift rv" style="--d:' + (i % 3) * 90 + 'ms" data-cat="' + esc(p.category) + '">' +
        '<div class="shot">' + preview(p) + (p.featured ? '<span class="shot-tag shot-feat">Featured</span>' : "") + "</div>" +
        '<div class="project-body"><span class="project-cat">' + esc(p.category) + "</span><h3>" + esc(p.title) + "</h3><p>" + esc(p.summary) + "</p>" +
        '<ul class="chips">' + chips(p.tech && p.tech.length ? p.tech : p.features) + "</ul>" +
        '<div class="project-actions"><button class="btn btn-sm btn-primary" type="button" data-project="' + esc(p.id) + '">View details ' + ic("arrow", "mv") + "</button>" +
          projLinks(p, true) + "</div></div></article>";
    }).join("") + "</div></div>";
  function projLinks(p, compact) {
    var out = "";
    if (safeUrl(p.liveUrl)) out += '<a class="btn btn-sm btn-ghost" href="' + esc(p.liveUrl) + '" target="_blank" rel="noopener">Live demo ' + ic("ext") + "</a>";
    if (safeUrl(p.repoUrl)) out += '<a class="btn btn-sm btn-ghost" href="' + esc(p.repoUrl) + '" target="_blank" rel="noopener">' + ic("github") + " Code</a>";
    if (!out && p.confidential) out = '<span class="private">' + ic("lock") + (compact ? "Private client project" : "Private client project — source code and live system are confidential") + "</span>";
    return out;
  }

  /* ---------- Services ---------- */
  $("#services").innerHTML = '<div class="container">' + head("services", "Services", "How I can help your team", "Services based on the work I do every day.") +
    '<div class="services-grid">' + C.services.map(function (s, i) {
      return '<article class="card service spot lift rv" style="--d:' + (i % 4) * 80 + 'ms"><span class="ico">' + ic(s.icon) + "</span><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></article>";
    }).join("") + "</div></div>";

  /* ---------- Education ---------- */
  $("#education").innerHTML = '<div class="container">' + head("education", "Education", "Academic background", "") +
    '<ol class="timeline" data-timeline><span class="tl-fill" aria-hidden="true"></span>' + C.education.map(function (e) {
      var pct = parseFloat(e.result);
      return '<li class="tl-item rv"><span class="tl-node" aria-hidden="true"></span><article class="card edu spot">' +
        "<h3>" + esc(e.degree) + '</h3><div class="edu-score"><strong data-count="' + (isNaN(pct) ? 0 : pct) + '" data-dec="2">' + esc(e.result) + "</strong><span>" + esc(e.start) + " – " + esc(e.end) + "</span></div>" +
        '<div class="edu-school">' + esc(e.school) + '</div><div class="edu-meta">' + esc(e.location) + (e.note ? " · " + esc(e.note) : "") + "</div>" +
        (isNaN(pct) ? "" : '<div class="meter" role="img" aria-label="Result ' + esc(e.result) + '"><i style="--w:' + pct / 100 + '"></i></div>') +
        "</article></li>";
    }).join("") + "</ol>" +
    '<h3 class="sub rv" style="margin-top:44px">' + ic("globe") + 'Languages</h3><div class="langs">' + P.languages.map(function (l, i) {
      return '<div class="card lang rv rv-s" style="--d:' + i * 80 + 'ms"><b>' + esc(l.name) + "</b><span>" + esc(l.level) + "</span></div>";
    }).join("") + "</div></div>";

  /* ---------- Certifications (only if present) ---------- */
  if (C.certifications && C.certifications.length) {
    var cs = $("#certifications"); cs.hidden = false;
    cs.innerHTML = '<div class="container">' + head("certifications", "Certifications", "Certificates & credentials", "") +
      '<div class="certs-grid">' + C.certifications.map(function (c, i) {
        return '<article class="card cert spot lift rv" style="--d:' + (i % 3) * 80 + 'ms"><div class="shot">' + preview({ image: c.image, title: c.name, art: "erp" }) + "</div>" +
          '<div class="cert-body"><span class="project-cat">' + esc(c.issuer) + "</span><h3>" + esc(c.name) + "</h3><p>Issued " + fmtMonth(c.date) + "</p>" +
          '<div class="project-actions"><button class="btn btn-sm btn-primary" type="button" data-cert="' + i + '">View certificate ' + ic("eye") + "</button>" +
          (safeUrl(c.verifyUrl) ? '<a class="btn btn-sm btn-ghost" href="' + esc(c.verifyUrl) + '" target="_blank" rel="noopener">Verify ' + ic("ext") + "</a>" : "") + "</div></div></article>";
      }).join("") + "</div></div>";
  }

  /* ---------- Testimonials (only genuine, only if present) ---------- */
  if (C.testimonials && C.testimonials.length) {
    var ts = $("#testimonials"); ts.hidden = false;
    ts.innerHTML = '<div class="container">' + head("testimonials", "Testimonials", "What colleagues say", "") +
      '<div class="quotes" tabindex="0" aria-label="Testimonials, scroll sideways">' + C.testimonials.map(function (t) {
        return '<figure class="card quote rv"><blockquote>“' + esc(t.quote) + "”</blockquote><figcaption><b>" + esc(t.name) + "</b><span>" + esc(t.role) + "</span></figcaption></figure>";
      }).join("") + "</div></div>";
  }

  /* ---------- Contact ---------- */
  var wa = "https://wa.me/" + String(P.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent("Hi Muhammad, I found your portfolio and would like to connect.");
  $("#contact").innerHTML = '<div class="container">' + head("contact", "Contact", "Let's work together", "Have a role, a project or a question? Send a message — I usually reply within a day.") +
    '<div class="contact-grid">' +
      '<div class="contact-list">' +
        cItem("mail", "Email", '<a href="mailto:' + esc(P.email) + '">' + esc(P.email) + "</a>", P.email, 0) +
        cItem("phone", "Phone / WhatsApp", '<a href="tel:' + esc(P.phone.replace(/\s/g, "")) + '">' + esc(P.phone) + "</a>", P.phone, 70) +
        cItem("pin", "Location", "<b>" + esc(P.location) + "</b>", "", 140) +
        '<div class="c-actions rv" style="--d:210ms"><a class="btn btn-wa mag" href="' + esc(wa) + '" target="_blank" rel="noopener">' + ic("whatsapp") + " Chat on WhatsApp</a>" +
          socials.map(function (s) { return '<a class="btn btn-ghost" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + ic(s.icon) + " " + esc(s.label) + "</a>"; }).join("") +
          '<a class="btn btn-ghost" href="' + esc(P.resume) + '" download>' + ic("down") + " Resume</a></div>" +
      "</div>" +
      '<form class="card form rv rv-r" id="contactForm" novalidate>' +
        "<h3>Send a message</h3><p>Fields marked <span aria-hidden=\"true\">*</span><span class=\"sr\">with an asterisk</span> are required.</p>" +
        '<div class="row">' + field("name", "Full name", "text", "name", 80) + field("email", "Email", "email", "email", 120) + "</div>" +
        field("subject", "Subject", "text", "off", 120) +
        field("message", "Message", "textarea", "off", 2000) +
        '<div class="hp" aria-hidden="true"><label for="f-website">Leave this empty</label><input id="f-website" name="botcheck" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<div class="form-foot"><button class="btn btn-primary mag" type="submit" id="sendBtn"><span class="spinner" aria-hidden="true"></span>' + ic("send", "send-ico") + '<span class="btn-label">Send message</span></button>' +
        '<p class="form-note" id="formNote"></p></div>' +
        '<div class="form-msg" id="formMsg" role="status" aria-live="polite"></div>' +
      "</form>" +
    "</div></div>";
  function cItem(icon, label, val, copy, d) {
    return '<div class="card c-item rv" style="--d:' + d + 'ms"><span class="ico">' + ic(icon) + "</span><div><span>" + esc(label) + "</span>" + val + "</div>" +
      (copy ? '<button class="icon-btn copy" type="button" data-copy="' + esc(copy) + '" aria-label="Copy ' + esc(label.toLowerCase()) + '">' + ic("copy") + "</button>" : "") + "</div>";
  }
  function field(id, label, type, ac, max) {
    var input = type === "textarea"
      ? '<textarea id="f-' + id + '" name="' + id + '" maxlength="' + max + '" required aria-describedby="e-' + id + " c-" + id + '"></textarea><span class="count" id="c-' + id + '" aria-hidden="true">0 / ' + max + "</span>"
      : '<input id="f-' + id + '" name="' + id + '" type="' + type + '" autocomplete="' + ac + '" maxlength="' + max + '" required aria-describedby="e-' + id + '">';
    return '<div class="field"><label for="f-' + id + '">' + esc(label) + ' <i aria-hidden="true">*</i></label>' + input + '<span class="err" id="e-' + id + '"></span></div>';
  }

  /* ---------- Footer ---------- */
  var navItems = [["home", "Home"], ["about", "About"], ["skills", "Skills"], ["experience", "Experience"], ["projects", "Projects"], ["services", "Services"], ["education", "Education"], ["certifications", "Certifications"], ["testimonials", "Testimonials"], ["contact", "Contact"]]
    .filter(function (n) { var s = doc.getElementById(n[0]); return s && !s.hidden && n[0] !== "testimonials"; });
  $("#footer").innerHTML = '<div class="container"><div class="foot-top">' +
    '<div class="foot-brand"><a class="brand" href="#home"><span class="brand-mark">' + esc(P.initials) + "</span>" + esc(P.name) + "</a><p>" + esc(P.title) + " · " + esc(P.tagline) + ". " + esc(P.location) + ".</p></div>" +
    '<nav class="foot-links" aria-label="Footer">' + navItems.map(function (n) { return '<a href="#' + n[0] + '">' + n[1] + "</a>"; }).join("") + "</nav>" +
    '<div class="socials">' + socialLinks() + '<a href="mailto:' + esc(P.email) + '" aria-label="Email">' + ic("mail") + "</a></div>" +
    '</div><div class="foot-bottom"><span>© <span id="year"></span> ' + esc(P.name) + ". All rights reserved.</span><span>Built with HTML, CSS &amp; JavaScript</span></div></div>";
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Navigation ---------- */
  $("#navLinks").innerHTML = '<span class="nav-indicator" aria-hidden="true"></span>' + navItems.map(function (n) { return '<a href="#' + n[0] + '" data-nav="' + n[0] + '">' + n[1] + "</a>"; }).join("");
  $("#mobileLinks").innerHTML = navItems.map(function (n, i) { return '<li style="--i:' + i + '"><a href="#' + n[0] + '" data-nav="' + n[0] + '">' + n[1] + ic("arrow") + "</a></li>"; }).join("");
  $("#mobileFoot").innerHTML = '<a class="btn btn-primary" href="' + esc(P.resume) + '" download>' + ic("down") + ' Download CV</a><div class="socials">' + socialLinks() + "</div>";
  $("#navCv").setAttribute("href", P.resume);

  /* ---------- JSON-LD structured data (from config) ---------- */
  var ld = doc.createElement("script"); ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Person", name: P.name, jobTitle: P.title, url: C.site.url,
    image: C.site.url + P.photoFallback, email: "mailto:" + P.email, telephone: P.phone,
    address: { "@type": "PostalAddress", addressLocality: "Islamabad", addressCountry: "PK" },
    worksFor: exp0 && !exp0.end ? { "@type": "Organization", name: exp0.company } : undefined,
    alumniOf: { "@type": "CollegeOrUniversity", name: C.education[0].school },
    knowsAbout: C.skills.filter(function (g) { return g.countable !== false; }).reduce(function (a, g) { return a.concat(g.items); }, []),
    knowsLanguage: P.languages.map(function (l) { return l.name; }),
    sameAs: socials.map(function (s) { return s.url; })
  });
  doc.head.appendChild(ld);

  /* =================== INTERACTIONS =================== */

  /* ---------- Theme ---------- */
  var themeBtn = $("#themeBtn");
  function setThemeUI() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeBtn.setAttribute("aria-pressed", String(dark));
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute("content", dark ? "#091115" : "#0f766e");
  }
  (function () { var saved = null; try { saved = localStorage.getItem("ma-theme"); } catch (e) {}
    if (!saved && !matchMedia("(prefers-color-scheme: dark)").matches) root.setAttribute("data-theme", C.site.defaultTheme || "light"); })();
  setThemeUI();
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    var apply = function () { root.setAttribute("data-theme", next); setThemeUI(); };
    if (doc.startViewTransition && !calm) doc.startViewTransition(apply); else apply();
    try { localStorage.setItem("ma-theme", next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  var menu = $("#mobileMenu"), menuBtn = $("#menuBtn"), menuOpen = false;
  function openMenu(open) {
    menuOpen = open;
    root.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("lock", open);
    if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add("open"); var f = $("a", menu); if (f) f.focus(); }); }
    else { menu.classList.remove("open"); setTimeout(function () { if (!menuOpen) menu.hidden = true; }, 350); }
  }
  menuBtn.addEventListener("click", function () { openMenu(!menuOpen); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) openMenu(false); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && menuOpen) { openMenu(false); menuBtn.focus(); } });
  addEventListener("resize", function () { if (menuOpen && innerWidth > 1100) openMenu(false); });

  /* ---------- Scroll: nav state, progress, active link, timeline, back-to-top ---------- */
  var nav = $("#nav"), prog = $("#progress"), toTop = $("#toTop"), ring = $("#ringFill"), indicator = $(".nav-indicator");
  var sections = navItems.map(function (n) { return doc.getElementById(n[0]); });
  var timelines = $$("[data-timeline]"), current = "";
  function moveIndicator(a) {
    if (!a || !indicator) { if (indicator) indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1; indicator.style.width = a.offsetWidth + "px"; indicator.style.transform = "translateX(" + a.offsetLeft + "px)";
  }
  function onScroll() {
    var y = scrollY, h = doc.documentElement.scrollHeight - innerHeight, p = h > 0 ? y / h : 0;
    nav.classList.toggle("scrolled", y > 10);
    prog.style.transform = "scaleX(" + p + ")";
    toTop.classList.toggle("show", y > 700);
    ring.style.strokeDashoffset = String(132 - 132 * p);
    var id = sections[0].id;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * 0.38) id = s.id; });
    if (y + innerHeight >= doc.documentElement.scrollHeight - 4) id = sections[sections.length - 1].id;
    if (id !== current) {
      current = id;
      $$("[data-nav]").forEach(function (a) { var on = a.getAttribute("data-nav") === id; a.classList.toggle("active", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
      moveIndicator($('#navLinks a[data-nav="' + id + '"]'));
    }
    timelines.forEach(function (t) {
      var r = t.getBoundingClientRect(), k = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height));
      $(".tl-fill", t).style.transform = "scaleY(" + (calm ? 1 : k) + ")";
    });
  }
  var ticking = false;
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); parallax(); ticking = false; }); } }, { passive: true });
  addEventListener("resize", function () { moveIndicator($("#navLinks a.active")); });
  toTop.addEventListener("click", function () { scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" }); $(".brand").focus({ preventScroll: true }); });

  /* ---------- Reveal + counters + meters ---------- */
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count")), dec = +(el.getAttribute("data-dec") || 0), suffix = dec ? "%" : "";
    if (calm || !to) { el.textContent = to.toFixed(dec) + suffix; return; }
    var t0 = performance.now(), dur = 1500;
    (function step(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = (to * e).toFixed(dec) + suffix; if (k < 1) requestAnimationFrame(step); })(t0);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target; t.classList.add("in");
      $$("[data-count]", t).forEach(countUp);
      $$(".meter i", t).forEach(function (m) { m.style.transform = "scaleX(" + m.style.getPropertyValue("--w") + ")"; });
      io.unobserve(t);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".rv").forEach(function (el) { if (!el.closest(".hero")) io.observe(el); });

  /* ---------- Hero: roles typing + code card ---------- */
  var roleEl = $("#roleText");
  if (!calm && P.roles.length > 1) {
    var ri = 0, ci = P.roles[0].length, del = false;
    (function typeRole() {
      var w = P.roles[ri];
      roleEl.textContent = w.slice(0, ci);
      if (!del && ci < w.length) { ci++; setTimeout(typeRole, 65); }
      else if (!del) { del = true; setTimeout(typeRole, 2200); }
      else if (ci > 0) { ci--; setTimeout(typeRole, 32); }
      else { del = false; ri = (ri + 1) % P.roles.length; setTimeout(typeRole, 280); }
    })();
  }
  var stack = C.skills.filter(function (g) { return g.group === "Backend" || g.group === "Frontend"; }).reduce(function (a, g) { return a.concat(g.items); }, []);
  var pick = [".NET Core", "React.js", "Angular"].filter(function (t) { return stack.indexOf(t) > -1; });
  var tokens = [
    ["var ", "k"], ["dev", ""], [" = ", "p"], ["new ", "k"], ["Developer", "t"], [" {\n", "p"],
    ["  Name", ""], [" = ", "p"], ['"' + P.name + '"', "s"], [",\n", "p"],
    ["  Stack", ""], [" = [", "p"]
  ];
  pick.forEach(function (t, i) { tokens.push(['"' + t.replace(".js", "") + '"', "s"]); if (i < pick.length - 1) tokens.push([", ", "p"]); });
  tokens.push(["],\n", "p"], ["  Based", ""], [" = ", "p"], ['"' + P.location.split(",")[0] + '"', "s"], [",\n", "p"], ["  Available", ""], [" = ", "p"], [String(!!P.availability.open), "k"], ["\n};", "p"]);
  var codeOut = $("#codeOut"), total = tokens.reduce(function (n, t) { return n + t[0].length; }, 0);
  function renderCode(n) {
    var out = "", left = n;
    for (var i = 0; i < tokens.length && left > 0; i++) {
      var s = tokens[i][0].slice(0, left); left -= s.length;
      out += tokens[i][1] ? '<span class="tk-' + tokens[i][1] + '">' + esc(s) + "</span>" : esc(s);
    }
    codeOut.innerHTML = out + (n < total ? '<span class="caret"></span>' : "");
  }
  function startCode() {
    if (calm) { renderCode(total); return; }
    var n = 0; (function tick() { n += 2; renderCode(Math.min(n, total)); if (n < total) setTimeout(tick, 28); })();
  }

  /* ---------- Parallax (scroll + pointer) ---------- */
  var parEls = $$("[data-par]"), mx = 0, my = 0;
  function parallax() {
    if (calm) return;
    var y = scrollY; if (y > innerHeight * 1.2) return;
    parEls.forEach(function (el) { var k = parseFloat(el.getAttribute("data-par")); el.style.translate = (mx * k * 40).toFixed(1) + "px " + (y * k + my * k * 40).toFixed(1) + "px"; });
  }
  var visual = $("[data-tilt]");
  if (finePointer && !calm) {
    $("#home").addEventListener("pointermove", function (e) {
      mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; parallax();
      if (visual) visual.style.transform = "perspective(1000px) rotateY(" + mx * 6 + "deg) rotateX(" + -my * 6 + "deg)";
    });
    $("#home").addEventListener("pointerleave", function () { if (visual) visual.style.transform = ""; });
    doc.addEventListener("pointerleave", function () { $(".cursor").classList.remove("on"); });
    if (visual) visual.style.transition = "transform .6s cubic-bezier(.22,.8,.24,1)";
  }

  /* ---------- Spotlight + magnetic buttons + cursor ---------- */
  doc.addEventListener("pointermove", function (e) {
    var c = e.target.closest && e.target.closest(".spot");
    if (c) { var r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); }
  }, { passive: true });
  if (finePointer && !calm) {
    $$(".mag").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.15 + "px," + (e.clientY - r.top - r.height / 2) * 0.25 + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    root.classList.add("has-cursor");
    var dot = $(".cursor-dot"), ringC = $(".cursor-ring"), cur = $(".cursor"), tx = -100, ty = -100, rx = -100, ry = -100;
    addEventListener("pointermove", function (e) { cur.classList.add("on"); tx = e.clientX; ty = e.clientY; dot.style.transform = "translate(" + tx + "px," + ty + "px)"; cur.classList.toggle("hover", !!e.target.closest("a,button,[data-filter],input,textarea")); }, { passive: true });
    (function loop() { rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18; ringC.style.transform = "translate(" + rx + "px," + ry + "px)"; requestAnimationFrame(loop); })();
  }

  /* ---------- Project filters ---------- */
  var pill = $(".filter-pill"), fbtns = $$("[data-filter]");
  function movePill(b) { pill.style.width = b.offsetWidth + "px"; pill.style.transform = "translateX(" + b.offsetLeft + "px)"; pill.style.top = b.offsetTop + "px"; pill.style.height = b.offsetHeight + "px"; }
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      fbtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      movePill(b);
      $$("#projectGrid .project").forEach(function (card) {
        var show = f === "All" || card.getAttribute("data-cat") === f;
        if (show) { card.classList.remove("hide"); requestAnimationFrame(function () { card.classList.remove("fade"); }); }
        else { card.classList.add("fade"); setTimeout(function () { if (card.classList.contains("fade")) card.classList.add("hide"); }, calm ? 0 : 300); }
      });
    });
  });
  addEventListener("resize", function () { var a = $('[data-filter][aria-pressed="true"]'); if (a) movePill(a); });

  /* ---------- Modal (projects + certificates) ---------- */
  var modal = $("#modal"), mBody = $("#modalBody");
  function openModal(html, title) {
    mBody.innerHTML = html; modal.setAttribute("aria-label", title);
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    doc.body.classList.add("lock");
    var cb = $(".modal-close", modal); if (cb) cb.focus();
  }
  function closeModal() { if (modal.open) { if (modal.close) modal.close(); else modal.removeAttribute("open"); } }
  modal.addEventListener("close", function () { doc.body.classList.remove("lock"); });
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest("[data-close]")) closeModal(); });
  doc.addEventListener("click", function (e) {
    var pb = e.target.closest("[data-project]");
    if (pb) {
      var p = C.projects.filter(function (x) { return x.id === pb.getAttribute("data-project"); })[0]; if (!p) return;
      var story = [["Challenge", p.challenge], ["Solution", p.solution], ["Outcome", p.outcome]].filter(function (s) { return s[1]; });
      openModal('<div class="shot">' + preview(p) + "</div>" +
        '<div class="m-body"><span class="project-cat">' + esc(p.category) + '</span><h2 id="modalTitle">' + esc(p.title) + "</h2><p>" + esc(p.summary) + "</p>" +
        '<div class="m-grid">' + (p.role ? "<div><span>My role</span><b>" + esc(p.role) + "</b></div>" : "") + (p.company ? "<div><span>Organisation</span><b>" + esc(p.company) + "</b></div>" : "") + "</div>" +
        '<h3 class="sub">' + ic("check") + 'Key features</h3><ul class="bul">' + p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
        (p.tech && p.tech.length ? '<h3 class="sub">' + ic("code") + 'Technologies</h3><ul class="chips">' + chips(p.tech, "accent") + "</ul>" : "") +
        (story.length ? '<div class="m-story">' + story.map(function (s) { return "<div><h4>" + s[0] + "</h4><p>" + esc(s[1]) + "</p></div>"; }).join("") + "</div>" : "") +
        '<div class="m-actions">' + projLinks(p, false) + '<a class="btn btn-sm btn-ghost" href="#contact" data-close>Ask me about this project</a></div></div>', p.title);
      return;
    }
    var cb = e.target.closest("[data-cert]");
    if (cb) {
      var c = C.certifications[+cb.getAttribute("data-cert")];
      openModal('<div class="m-body"><span class="project-cat">' + esc(c.issuer) + '</span><h2 id="modalTitle">' + esc(c.name) + "</h2><p>Issued " + fmtMonth(c.date) + "</p>" +
        (safeUrl(c.image) ? '<div class="m-cert"><img src="' + esc(c.image) + '" alt="Certificate: ' + esc(c.name) + '"></div>' : "") +
        '<div class="m-actions">' + (safeUrl(c.file) ? '<a class="btn btn-sm btn-primary" href="' + esc(c.file) + '" target="_blank" rel="noopener">Open full certificate ' + ic("ext") + "</a>" : "") +
        (safeUrl(c.verifyUrl) ? '<a class="btn btn-sm btn-ghost" href="' + esc(c.verifyUrl) + '" target="_blank" rel="noopener">Verify credential ' + ic("ext") + "</a>" : "") + "</div></div>", c.name);
      return;
    }
    var cp = e.target.closest("[data-copy]");
    if (cp) {
      var val = cp.getAttribute("data-copy");
      (navigator.clipboard ? navigator.clipboard.writeText(val) : Promise.reject())
        .then(function () { toast("Copied: " + val); }, function () { toast(val); });
    }
  });
  var toastEl = $("#toast"), toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2400); }

  /* ---------- Contact form ---------- */
  var form = $("#contactForm"), sendBtn = $("#sendBtn"), msgBox = $("#formMsg"), openedAt = Date.now();
  var key = String(C.contact.web3formsKey || "").trim();
  $("#formNote").textContent = key ? "Your message goes straight to my inbox. I'll never share your details." : "This will open your email app with your message ready to send.";
  var rules = {
    name: function (v) { return v.length < 2 ? "Please enter your full name." : ""; },
    email: function (v) { return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Please enter a valid email address." : ""; },
    subject: function (v) { return v.length < 3 ? "Please add a short subject." : ""; },
    message: function (v) { return v.length < 10 ? "Please write at least 10 characters." : ""; }
  };
  function clean(v) { return String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim(); }
  function check(name) {
    var el = form.elements[name], err = rules[name](clean(el.value)), wrap = el.closest(".field");
    wrap.classList.toggle("bad", !!err); el.setAttribute("aria-invalid", err ? "true" : "false");
    $("#e-" + name).textContent = err; return !err;
  }
  Object.keys(rules).forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener("blur", function () { if (el.value) check(n); });
    el.addEventListener("input", function () { if (el.closest(".field").classList.contains("bad")) check(n); });
  });
  var msgEl = form.elements.message, countEl = $("#c-message");
  msgEl.addEventListener("input", function () { countEl.textContent = msgEl.value.length + " / 2000"; });
  function showMsg(kind, html) { msgBox.className = "form-msg show " + kind; msgBox.innerHTML = ic(kind === "ok" ? "check" : kind === "bad" ? "alert" : "info") + "<div>" + html + "</div>"; }
  function busy(on) { form.classList.toggle("loading", on); sendBtn.disabled = on; $(".btn-label", sendBtn).textContent = on ? "Sending…" : "Send message"; }
  form.addEventListener("submit", function (e) {
    e.preventDefault(); msgBox.className = "form-msg";
    var ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) { var first = $(".field.bad input, .field.bad textarea", form); if (first) first.focus(); return; }
    if (form.elements.botcheck.value || Date.now() - openedAt < 3000) { showMsg("bad", "Please wait a moment and try again."); return; }
    var last = 0; try { last = +localStorage.getItem("ma-sent") || 0; } catch (x) {}
    if (Date.now() - last < 60000) { showMsg("bad", "You just sent a message — please wait a minute before sending another."); return; }
    var data = { name: clean(form.elements.name.value), email: clean(form.elements.email.value), subject: clean(form.elements.subject.value), message: clean(form.elements.message.value) };
    var mailto = "mailto:" + P.email + "?subject=" + encodeURIComponent(C.contact.subjectPrefix + ": " + data.subject) +
      "&body=" + encodeURIComponent(data.message + "\n\n— " + data.name + " (" + data.email + ")");
    if (!key) {
      location.href = mailto;
      showMsg("info", "Your email app should now open with the message ready — press <b>Send</b> there. If nothing opened, email me at <a href=\"mailto:" + esc(P.email) + "\"><u>" + esc(P.email) + "</u></a>.");
      return;
    }
    busy(true);
    var ctrl = "AbortController" in window ? new AbortController() : null, timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
    fetch("https://api.web3forms.com/submit", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, signal: ctrl ? ctrl.signal : undefined,
      body: JSON.stringify({ access_key: key, subject: C.contact.subjectPrefix + ": " + data.subject, from_name: data.name, name: data.name, email: data.email, replyto: data.email, message: data.message, botcheck: "" })
    }).then(function (r) { return r.json().catch(function () { return { success: false }; }); })
      .then(function (res) {
        if (!res || !res.success) throw new Error("send failed");
        try { localStorage.setItem("ma-sent", String(Date.now())); } catch (x) {}
        form.reset(); countEl.textContent = "0 / 2000";
        showMsg("ok", "Thank you, " + esc(data.name.split(" ")[0]) + "! Your message has been sent. I'll get back to you soon.");
      })
      .catch(function () {
        showMsg("bad", "Sorry, the message couldn't be sent right now. Please <a href=\"" + esc(mailto) + "\"><u>send it by email</u></a> or message me on WhatsApp.");
      })
      .then(function () { clearTimeout(timer); busy(false); });
  });

  /* ---------- Start ---------- */
  var started = false;
  function start() {
    if (started) return; started = true;
    root.classList.add("is-ready");
    $$(".hero h1 .ch").forEach(function (c, i) { c.style.transitionDelay = 120 + i * 35 + "ms"; });
    setTimeout(function () { $$(".hero .rv").forEach(function (el) { el.classList.add("in"); }); }, 80);
    setTimeout(startCode, calm ? 0 : 1100);
    onScroll(); parallax();
    var a = $('[data-filter][aria-pressed="true"]'); if (a) movePill(a);
    setTimeout(function () { var l = $("#loader"); if (l) l.remove(); }, 700);
  }
  if (doc.readyState === "complete") setTimeout(start, 150);
  else addEventListener("load", function () { setTimeout(start, calm ? 0 : 250); });
  setTimeout(start, 2500);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { if (started) { moveIndicator($("#navLinks a.active")); var a = $('[data-filter][aria-pressed="true"]'); if (a) movePill(a); } });
})();
