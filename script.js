// script.js
(() => {
  // ====== CONFIG ======
  // Replace with your real Etsy shop link:
  const ETSY_SHOP_URL = "https://www.etsy.com/shop/YOURSHOPNAME";

  // Stats (display only — keep truthful to your store data)
  const STORE_STATS = {
    totalSalesLabel: "2.5k+ sales",
    etsyRatingLabel: "5.0 on Etsy",
    etsyReviewsLabel: "700+ Etsy reviews",
  };

  // ====== DOM HELPERS ======
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ====== HEADER NAV (mobile) ======
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  function closeNav() {
    if (!navMenu) return;
    navMenu.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }

  function toggleNav() {
    if (!navMenu || !navToggle) return;
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  navToggle?.addEventListener("click", toggleNav);

  // Close on link click (mobile)
  $$("#navMenu a").forEach(a => {
    a.addEventListener("click", () => closeNav());
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!navMenu || !navToggle) return;
    const target = e.target;
    const clickedInside = navMenu.contains(target) || navToggle.contains(target);
    if (!clickedInside) closeNav();
  });

  // ====== YEAR ======
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ====== ETSY LINKS ======
  const etsyLinks = [$("#etsyLinkTop"), $("#etsyLinkShop"), $("#etsyLinkFooter")].filter(Boolean);
  etsyLinks.forEach(a => a.setAttribute("href", ETSY_SHOP_URL));

  // ====== TOAST ======
  const toast = $("#toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  // Buttons with data-toast
  $$("[data-toast]").forEach(btn => {
    btn.addEventListener("click", () => {
      const msg = btn.getAttribute("data-toast") || "Done!";
      showToast(msg);
    });
  });

  // ====== REMEDY LIBRARY DATA ======
  const remedies = [
    {
      id: "sleep-soothe",
      title: "Sleep & Soothe Night Tea",
      category: "sleep",
      time: "10 min",
      blurb: "A simple caffeine-free ritual for softer nights.",
      tags: ["tea", "evening", "routine"],
    },
    {
      id: "calm-breath",
      title: "Calm-in-a-Cup Breath Ritual",
      category: "stress",
      time: "3 min",
      blurb: "A tiny reset for tense shoulders and busy brains.",
      tags: ["ritual", "breath", "grounding"],
    },
    {
      id: "ginger-digest",
      title: "Ginger + Warm Water for Digestion",
      category: "digestion",
      time: "5 min",
      blurb: "A cozy classic for after-meal comfort.",
      tags: ["warming", "simple", "kitchen"],
    },
    {
      id: "oat-salve",
      title: "Oat + Honey Soothing Mask",
      category: "skin",
      time: "12 min",
      blurb: "Softens cranky skin with pantry-friendly ingredients.",
      tags: ["soothing", "gentle", "topical"],
    },
    {
      id: "seasonal-steam",
      title: "Seasonal Steam Bowl",
      category: "seasonal",
      time: "8 min",
      blurb: "A comforting steam ritual for seasonal shifts.",
      tags: ["steam", "cozy", "reset"],
    },
    {
      id: "lavender-winddown",
      title: "Lavender Wind-Down Routine",
      category: "sleep",
      time: "15 min",
      blurb: "A low-effort nightly rhythm you’ll actually keep.",
      tags: ["lavender", "bath", "sleep"],
    },
  ];

  const remedyGrid = $("#remedyGrid");
  const searchInput = $("#searchInput");
  const chipButtons = $$(".chip");

  let activeFilter = "all";
  let searchTerm = "";

  function remedyMatches(remedy) {
    const inCategory = activeFilter === "all" || remedy.category === activeFilter;
    if (!inCategory) return false;

    if (!searchTerm) return true;
    const hay = [
      remedy.title,
      remedy.category,
      remedy.blurb,
      ...(remedy.tags || []),
    ].join(" ").toLowerCase();

    return hay.includes(searchTerm.toLowerCase());
  }

  function renderRemedies() {
    if (!remedyGrid) return;

    const visible = remedies.filter(remedyMatches);

    if (visible.length === 0) {
      remedyGrid.innerHTML = `
        <div class="card" style="grid-column: 1 / -1;">
          <h3>No matches</h3>
          <p>Try a different keyword or category.</p>
          <div class="meta">
            <span class="badge">Tip: search “tea”, “ritual”, “gentle”</span>
          </div>
        </div>
      `;
      return;
    }

    remedyGrid.innerHTML = visible.map(r => {
      const niceCat = r.category.charAt(0).toUpperCase() + r.category.slice(1);
      return `
        <article class="card" data-id="${r.id}">
          <h3>${escapeHtml(r.title)}</h3>
          <p>${escapeHtml(r.blurb)}</p>
          <div class="meta">
            <span class="badge">${escapeHtml(niceCat)}</span>
            <span class="badge">${escapeHtml(r.time)}</span>
          </div>
        </article>
      `;
    }).join("");

    // Demo: click a card => toast
    $$(".card[data-id]", remedyGrid).forEach(card => {
      card.addEventListener("click", () => {
        const title = $("h3", card)?.textContent?.trim() || "Remedy";
        showToast(`Opened: ${title} (demo)`);
      });
    });
  }

  function setActiveChip(filter) {
    activeFilter = filter;
    chipButtons.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.filter === filter);
    });
    renderRemedies();
  }

  chipButtons.forEach(btn => {
    btn.addEventListener("click", () => setActiveChip(btn.dataset.filter || "all"));
  });

  searchInput?.addEventListener("input", (e) => {
    searchTerm = e.target.value || "";
    renderRemedies();
  });

  // ====== FORMS (demo submit) ======
  $("#newsletterForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Subscribed (demo)! ✨");
    e.target.reset();
  });

  $("#contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Message sent (demo)! We’ll get back to you soon.");
    e.target.reset();
  });

  // ====== INITIAL RENDER ======
  renderRemedies();

  // ====== SAFETY: small HTML escape helper ======
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
