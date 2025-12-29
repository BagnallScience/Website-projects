const remedies = [
  {
    title: "Sleep Ritual: Night Tea + Warm Feet",
    category: "sleep",
    time: "10 min",
    summary: "A simple routine to signal “lights out” to your nervous system.",
    steps: ["Brew caffeine-free herbs", "Warm socks or foot soak", "Dim lights + slow breathing"]
  },
  {
    title: "Stress Reset: 4–6 Breathing + Tincture",
    category: "stress",
    time: "5 min",
    summary: "Quick calm for busy days with breath + a consistent herbal routine.",
    steps: ["Inhale 4, exhale 6 (x8)", "Sip water", "Optional: calming tincture as directed"]
  },
  {
    title: "Digestive Ease: After-Meal Tea",
    category: "digestion",
    time: "15 min",
    summary: "Gentle support after heavy meals (think: cozy, not harsh).",
    steps: ["Steep herbs 7–10 min", "Sip slowly", "Short walk if you can"]
  },
  {
    title: "Skin Comfort: Simple Salve Routine",
    category: "skin",
    time: "3 min",
    summary: "Lock in moisture and soothe dry patches with a consistent approach.",
    steps: ["Warm salve between fingers", "Apply to damp skin", "Repeat nightly for a week"]
  },
  {
    title: "Seasonal Support: Steam + Honey Tea",
    category: "seasonal",
    time: "12 min",
    summary: "A comforting combo for dry air and scratchy days.",
    steps: ["Warm steam bowl (careful!)", "Honey + lemon tea", "Rest your voice"]
  },
  {
    title: "Grounding: Five Senses Check-In",
    category: "stress",
    time: "4 min",
    summary: "A fast way to come back to your body when you’re spiraling.",
    steps: ["Name 5 things you see", "4 you feel", "3 you hear", "2 you smell", "1 you taste"]
  }
];

const remedyGrid = document.getElementById("remedyGrid");
const searchInput = document.getElementById("searchInput");
const chips = document.querySelectorAll(".chip");
const yearEl = document.getElementById("year");
const toast = document.getElementById("toast");

yearEl.textContent = new Date().getFullYear();

let activeFilter = "all";

function renderRemedies(list) {
  remedyGrid.innerHTML = "";
  if (!list.length) {
    remedyGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1;">
        <h3>No matches found</h3>
        <p class="muted">Try a different keyword or category.</p>
      </div>`;
    return;
  }

  list.forEach((r) => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <h3>${r.title}</h3>
      <p class="muted">${r.summary}</p>

      <div class="card-meta">
        <span class="badge">${capitalize(r.category)}</span>
        <span class="muted">${r.time}</span>
      </div>

      <details style="margin-top:12px;">
        <summary style="font-weight:800; cursor:pointer;">Steps</summary>
        <ol style="color:var(--muted); padding-left:18px; margin:10px 0 0;">
          ${r.steps.map(s => `<li>${s}</li>`).join("")}
        </ol>
      </details>
    `;
    remedyGrid.appendChild(el);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function applyFilters() {
  const q = (searchInput.value || "").trim().toLowerCase();

  const filtered = remedies.filter((r) => {
    const matchesCategory = activeFilter === "all" || r.category === activeFilter;
    const haystack = (r.title + " " + r.summary + " " + r.steps.join(" ")).toLowerCase();
    const matchesQuery = !q || haystack.includes(q);
    return matchesCategory && matchesQuery;
  });

  renderRemedies(filtered);
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeFilter = chip.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);

// Mobile menu
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// Toasts (demo cart)
document.querySelectorAll("[data-toast]").forEach(btn => {
  btn.addEventListener("click", () => showToast(btn.dataset.toast));
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// Forms (demo success)
document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Subscribed! (demo)");
  e.target.reset();
});

document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Message sent! (demo)");
  e.target.reset();
});

// Initial render
renderRemedies(remedies);
