(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };

  // Rough format checks per wallet id, to catch copy-paste mistakes in config.js.
  var FORMATS = {
    btc: /^(bc1[02-9ac-hj-np-z]{11,71}|[13][1-9A-HJ-NP-Za-km-z]{25,34})$/,
    evm: /^0x[0-9a-fA-F]{40}$/,
    sol: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    tron: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function initials(name) {
    return (name || "?").split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); }).join("");
  }

  function renderQr(target, text) {
    var qr = qrcode(0, "M");
    qr.addData(text);
    qr.make();
    // createSvgTag returns markup generated locally from the address; no user HTML involved.
    target.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }

  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers / non-https.
    var ta = el("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject();
  }

  // Only allow https links, mailto: addresses and same-site relative paths from config.
  function safeUrl(url) {
    url = (url || "").trim();
    if (/^https:\/\//i.test(url)) return url;
    if (/^mailto:[^\s@?&]+@[^\s@?&]+$/i.test(url)) return url;
    if (/^[\w.\/-]+$/.test(url) && url.indexOf("..") < 0 && url.indexOf("//") < 0) return url;
    console.warn("Ignoring link that isn't https:// :", url);
    return "";
  }

  function linkButton(link, cls) {
    var href = safeUrl(link.url);
    if (!href) return null;
    var a = el("a", cls, link.label);
    a.href = href;
    if (/^https:/i.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function renderHeader() {
    if (cfg.name) {
      $("name").textContent = cfg.name;
      $("nav-name").textContent = cfg.name;
      document.title = cfg.name;
    }
    $("bio").textContent = cfg.bio || "";
    var av = $("avatar");
    if (cfg.avatar) {
      var img = el("img");
      img.src = cfg.avatar;
      img.alt = "";
      av.appendChild(img);
    } else {
      av.textContent = initials(cfg.name);
    }
    (cfg.links || []).forEach(function (l) {
      if (l.copy) {
        var b = el("button", "pill", l.label);
        b.type = "button";
        b.title = "Copy " + l.label + " username: " + l.copy;
        b.addEventListener("click", function () {
          copy(l.copy).then(
            function () { toast(l.label + ": " + l.copy + " copied"); },
            function () { toast(l.label + ": " + l.copy); }
          );
        });
        $("links").appendChild(b);
        return;
      }
      var a = linkButton(l, "pill");
      if (a) $("links").appendChild(a);
    });
    $("support-text").textContent = cfg.supportText || "";
    if (cfg.officialUrl) {
      $("official").textContent = "The only official page is " + cfg.officialUrl + ". Beware of copies.";
    }
  }

  function renderProjects() {
    var list = cfg.projects || [];
    if (!list.length) return;
    var root = $("project-list");
    list.forEach(function (p, i) {
      var card = el("article", "project window");
      var bar = el("div", "titlebar");
      bar.setAttribute("aria-hidden", "true");
      bar.appendChild(el("span", null, "STAGE " + String(i + 1).padStart(2, "0") + "/" + String(list.length).padStart(2, "0")));
      var btns = el("span", "titlebar-btns");
      btns.appendChild(el("i")); btns.appendChild(el("i")); btns.appendChild(el("i"));
      bar.appendChild(btns);
      card.appendChild(bar);

      if (p.image && safeUrl(p.image)) {
        var img = el("img", "project-shot");
        img.src = safeUrl(p.image);
        img.alt = p.name + " screenshot";
        img.loading = "lazy";
        card.appendChild(img);
      }

      var body = el("div", "window-body");
      body.appendChild(el("h3", "project-name", p.name));
      body.appendChild(el("p", "project-desc", p.description || ""));
      if (p.tags && p.tags.length) {
        var tags = el("div", "chips");
        p.tags.forEach(function (t) { tags.appendChild(el("span", "chip", t)); });
        body.appendChild(tags);
      }
      var actions = el("div", "project-actions");
      (p.links || []).forEach(function (l, j) {
        var a = linkButton(l, j === 0 ? "btn" : "btn btn-ghost");
        if (a) actions.appendChild(a);
      });
      body.appendChild(actions);
      card.appendChild(body);
      root.appendChild(card);
    });
    $("projects").hidden = false;
  }

  function renderGoals() {
    var list = cfg.goals || [];
    if (!list.length) return;
    var root = $("goal-list");
    var current = list.findIndex(function (g) { return !g.done; });
    var usd = function (n) { return "$" + n.toLocaleString("en-US"); };
    list.forEach(function (g, i) {
      var cls = "goal" + (g.done ? " done" : i === current ? " current" : "");
      var li = el("li", cls);
      var amount = Number(g.amount) || 0;

      // Each goal is a one-line row; tapping it shows the story and progress.
      var row = el("button", "goal-row");
      row.type = "button";
      row.appendChild(el("span", "goal-lv", "LV" + (i + 1)));
      row.appendChild(el("span", "goal-title", g.title));
      if (g.done) row.appendChild(el("span", "goal-tag", "CLEAR!"));
      else if (i === current) row.appendChild(el("span", "goal-tag", "NOW"));
      if (amount > 0) row.appendChild(el("span", "goal-cost", usd(amount) + (g.monthly ? "/mo" : "")));
      li.appendChild(row);

      var detail = el("div", "goal-detail");
      if (g.note) detail.appendChild(el("p", "goal-note", g.note));
      if (amount > 0) {
        var raised = g.done ? amount : Math.min(Number(g.raised) || 0, amount);
        var bar = el("div", "goal-bar");
        bar.setAttribute("aria-hidden", "true");
        var fill = el("i");
        fill.style.width = (raised / amount * 100) + "%";
        bar.appendChild(fill);
        detail.appendChild(bar);
        detail.appendChild(el("p", "goal-amount",
          usd(raised) + " of " + usd(amount) + (g.monthly ? " this month" : " raised")));
      }
      li.appendChild(detail);

      function toggle(open) {
        row.setAttribute("aria-expanded", String(open));
        detail.hidden = !open;
      }
      row.addEventListener("click", function () { toggle(detail.hidden); });
      toggle(i === current);
      root.appendChild(li);
    });
    $("goals").hidden = false;

    // A one-line summary of the current goal right above the coin picker.
    var g = list[current];
    if (g) {
      var now = $("now-quest");
      var amount = Number(g.amount) || 0;
      now.appendChild(el("span", "goal-lv", "LV" + (current + 1)));
      now.appendChild(el("span", "now-text", "Now funding: " + g.title));
      if (amount > 0) {
        now.appendChild(el("span", "goal-cost",
          usd(Math.min(Number(g.raised) || 0, amount)) + " / " + usd(amount) + (g.monthly ? "/mo" : "")));
      }
      now.hidden = false;
    }
  }

  function renderWallets() {
    var all = cfg.wallets || [];
    var wallets = all.filter(function (w) { return w.address && w.address.trim(); });
    var problems = [];

    wallets.forEach(function (w) {
      w.address = w.address.trim();
      var re = FORMATS[w.id];
      if (re && !re.test(w.address)) problems.push(w.name);
    });

    var banner = $("setup-banner");
    if (!wallets.length) {
      banner.textContent = "Setup: add your wallet addresses in config.js to show the donation options.";
      banner.hidden = false;
      return;
    }
    if (problems.length) {
      banner.textContent = "Check config.js: the address for " + problems.join(", ") +
        " doesn't look right. Please re-copy it from your wallet.";
      banner.classList.add("error");
      banner.hidden = false;
    }

    var tabs = $("tabs");
    var buttons = wallets.map(function (w, i) {
      var b = el("button", "tab");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.appendChild(el("span", "tab-name", w.name));
      b.appendChild(el("span", "tab-sym", w.symbol));
      b.addEventListener("click", function () { select(i); });
      tabs.appendChild(b);
      return b;
    });

    function chips(target, items) {
      target.textContent = "";
      (items || []).forEach(function (t) { target.appendChild(el("span", "chip", t)); });
    }

    var current;
    function select(i) {
      current = wallets[i];
      buttons.forEach(function (b, j) {
        b.setAttribute("aria-selected", String(i === j));
        b.classList.toggle("active", i === j);
      });
      renderQr($("qr"), current.address);
      $("address").textContent = current.address;
      chips($("networks"), current.networks);
      chips($("tokens"), current.tokens);
      $("warning").textContent = current.warning || "";
      try { localStorage.setItem("support-tab", current.id); } catch (e) {}
    }

    $("copy").addEventListener("click", function () {
      copy(current.address).then(
        function () { toast("+1UP! " + current.name + " address copied"); },
        function () { toast("Couldn't copy — please select the address manually"); }
      );
    });

    var start = 0;
    try {
      var saved = localStorage.getItem("support-tab");
      var idx = wallets.findIndex(function (w) { return w.id === saved; });
      if (idx >= 0) start = idx;
    } catch (e) {}
    // Deep links like spiritpaper.site/#sol open that coin in the support section.
    var hash = location.hash.slice(1);
    var hidx = wallets.findIndex(function (w) { return w.id === hash; });
    if (hidx >= 0) start = hidx;

    select(start);
    $("donate").hidden = false;
    if (hidx >= 0) $("support").scrollIntoView();
  }

  function renderOther() {
    if (!cfg.otherCoinsUrl) return;
    if (!/^https:\/\//i.test(cfg.otherCoinsUrl)) {
      console.warn("otherCoinsUrl must start with https://");
      return;
    }
    $("other-link").href = cfg.otherCoinsUrl;
    $("other").hidden = false;
  }

  renderHeader();
  renderProjects();
  renderGoals();
  renderWallets();
  renderOther();
})();
