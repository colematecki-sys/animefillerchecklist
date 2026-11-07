/* Anime Filler Checklist — shared behaviour.
   Progress is stored per show in localStorage: key "afc_progress_<show>",
   value: JSON object mapping episode number -> "w" (watched) or "s" (filler skipped).
   Spoiler Shield preference: key "afc_shield" ("1" = on, default on). */
(function () {
  "use strict";

  /* ---------- Spoiler Shield (applies on every page) ---------- */
  var shieldOn = true;
  try { shieldOn = localStorage.getItem("afc_shield") !== "0"; } catch (e) {}
  function applyShield() {
    document.body.classList.toggle("shield-on", shieldOn);
    var t = document.getElementById("shield-toggle");
    if (t) t.setAttribute("aria-pressed", shieldOn ? "true" : "false");
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyShield();
    var st = document.getElementById("shield-toggle");
    if (st) st.addEventListener("click", function () {
      shieldOn = !shieldOn;
      try { localStorage.setItem("afc_shield", shieldOn ? "1" : "0"); } catch (e) {}
      applyShield();
    });
    // Tap a blurred title to peek at it.
    document.querySelectorAll(".ep .ttl .t").forEach(function (el) {
      el.addEventListener("click", function () { el.classList.toggle("peek"); });
    });

    initShowPage();
    initHomeProgress();
  });

  /* ---------- Show checklist pages ---------- */
  function initShowPage() {
    var list = document.getElementById("ep-list");
    if (!list) return;
    var show = document.body.getAttribute("data-show");
    var KEY = "afc_progress_" + show;
    var rows = Array.prototype.slice.call(list.querySelectorAll(".ep"));
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { saved = {}; }

    var watchTotal = rows.filter(function (r) { return r.getAttribute("data-type") !== "filler"; }).length;
    var fillerTotal = rows.length - watchTotal;

    var pctEl = document.getElementById("progress-pct");
    var barEl = document.getElementById("progress-bar");
    var nextEl = document.getElementById("next-up");
    var fillerEl = document.getElementById("filler-count");

    function persist() {
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    }

    function refresh() {
      var done = 0, fillerDone = 0, next = null;
      rows.forEach(function (r) {
        var n = r.getAttribute("data-n"), type = r.getAttribute("data-type");
        var state = saved[n];
        var box = r.querySelector("input[type=checkbox]");
        box.checked = !!state;
        r.classList.toggle("watched", state === "w");
        r.classList.toggle("skipped", state === "s");
        r.classList.remove("nextup-row");
        if (type === "filler") { if (state) fillerDone++; }
        else if (state === "w") { done++; }
        else if (!next) { next = r; }
      });
      var pct = watchTotal ? Math.round((done / watchTotal) * 100) : 0;
      if (pctEl) pctEl.textContent = pct + "% (" + done + "/" + watchTotal + ")";
      if (barEl) barEl.style.width = pct + "%";
      if (fillerEl) fillerEl.textContent = fillerDone + " of " + fillerTotal + " filler marked skipped";
      if (next) {
        next.classList.add("nextup-row");
        if (nextEl) nextEl.innerHTML = "Next Up: <b>Episode " + next.getAttribute("data-n") + "</b>";
      } else if (nextEl) {
        nextEl.innerHTML = "<b>Watch path complete — nice work!</b>";
      }
    }

    rows.forEach(function (r) {
      var box = r.querySelector("input[type=checkbox]");
      box.addEventListener("change", function () {
        var n = r.getAttribute("data-n");
        if (box.checked) saved[n] = (r.getAttribute("data-type") === "filler") ? "s" : "w";
        else delete saved[n];
        persist(); refresh();
      });
    });

    var markBtn = document.getElementById("mark-filler");
    if (markBtn) markBtn.addEventListener("click", function () {
      rows.forEach(function (r) {
        if (r.getAttribute("data-type") === "filler") saved[r.getAttribute("data-n")] = "s";
      });
      persist(); refresh();
    });

    var hideBtn = document.getElementById("hide-filler");
    if (hideBtn) hideBtn.addEventListener("click", function () {
      var on = hideBtn.getAttribute("aria-pressed") === "true";
      hideBtn.setAttribute("aria-pressed", on ? "false" : "true");
      hideBtn.textContent = on ? "Hide filler" : "Filler hidden — tap to show";
      rows.forEach(function (r) {
        if (r.getAttribute("data-type") === "filler") r.classList.toggle("hidden", !on);
      });
    });

    var jumpBtn = document.getElementById("jump-btn");
    var jumpIn = document.getElementById("jump-input");
    if (jumpBtn && jumpIn) jumpBtn.addEventListener("click", function () {
      var target = list.querySelector('.ep[data-n="' + jumpIn.value + '"]');
      if (!target) return;
      target.classList.remove("hidden");
      target.classList.remove("flash"); void target.offsetWidth; target.classList.add("flash");
      if (target.scrollIntoView) { try { target.scrollIntoView({ block: "center" }); } catch (e) {} }
    });

    var resetBtn = document.getElementById("reset-show");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      if (!window.confirm("Reset all progress for this show?")) return;
      saved = {}; persist(); refresh();
    });

    refresh();
  }

  /* ---------- Home page progress rings ---------- */
  function initHomeProgress() {
    document.querySelectorAll("[data-progress-for]").forEach(function (el) {
      var show = el.getAttribute("data-progress-for");
      var watch = parseInt(el.getAttribute("data-watch"), 10) || 0;
      var saved = {};
      try { saved = JSON.parse(localStorage.getItem("afc_progress_" + show) || "{}"); } catch (e) {}
      var fillerSet = {};
      (el.getAttribute("data-filler-nums") || "").split(",").forEach(function (x) { if (x) fillerSet[x] = 1; });
      var done = 0;
      Object.keys(saved).forEach(function (n) { if (!fillerSet[n] && saved[n] === "w") done++; });
      var pct = watch ? Math.round((done / watch) * 100) : 0;
      var bar = el.querySelector(".bar i"), txt = el.querySelector(".pct");
      if (bar) bar.style.width = pct + "%";
      if (txt) txt.textContent = done > 0 ? pct + "% watched (" + done + "/" + watch + ")" : "Not started";
    });
  }
})();
