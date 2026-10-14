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

  // Only allow https links (and same-site relative paths) from config.
  function safeUrl(url) {
    url = (url || "").trim();
    if (/^https:\/\//i.test(url)) return url;
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
      bar.appendChild(el("span", null, "STAGE " + String(i + 1).padStart(2, "0")));
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
    // Deep links like spiritpaper.github.io/#sol open that coin in the support section.
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
  renderWallets();
  renderOther();
})();
