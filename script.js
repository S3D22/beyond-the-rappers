// Menú móvil
const menuBtn = document.querySelector("#menuBtn");
const menuClose = document.querySelector("#menuClose");
const menuPanel = document.querySelector("#menuPanel");

function openMenu() {
  if (!menuPanel || !menuBtn) return;
  menuPanel.classList.add("open");
  menuPanel.setAttribute("aria-hidden", "false");
  menuBtn.setAttribute("aria-expanded", "true");
}
function closeMenu() {
  if (!menuPanel || !menuBtn) return;
  menuPanel.classList.remove("open");
  menuPanel.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    menuPanel?.classList.contains("open") ? closeMenu() : openMenu();
  });
}
if (menuClose) menuClose.addEventListener("click", closeMenu);

document.querySelectorAll(".menu-link").forEach(link => {
  link.addEventListener("click", closeMenu);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Buscador de secciones (lupa)
// Escribe: musica / noticias / eventos / descubrir / contacto / home
const sectionMap = {
  "home": "#home",
  "inicio": "#home",
  "musica": "#musica",
  "música": "#musica",
  "noticias": "#noticias",
  "news": "#noticias",
  "eventos": "#eventos",
  "ediciones": "#eventos",
  "descubrir": "#descubrir",
  "about": "#descubrir",
  "contacto": "#contacto",
  "email": "#contacto",
};

function goToQuery(q) {
  const query = (q || "").trim().toLowerCase();
  if (!query) return;

  // match directo
  if (sectionMap[query]) {
    document.querySelector(sectionMap[query])?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // match parcial (si escriben “even” o “noti”)
  const key = Object.keys(sectionMap).find(k => k.includes(query));
  if (key) {
    document.querySelector(sectionMap[key])?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // si no se encuentra, lo mandamos al home
  document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
}

const siteSearch = document.querySelector("#siteSearch");
const searchBtn = document.querySelector("#searchBtn");

if (searchBtn && siteSearch) {
  searchBtn.addEventListener("click", () => goToQuery(siteSearch.value));
  siteSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") goToQuery(siteSearch.value);
  });
}

// Buscador móvil
const siteSearchMobile = document.querySelector("#siteSearchMobile");
const searchBtnMobile = document.querySelector("#searchBtnMobile");

if (searchBtnMobile && siteSearchMobile) {
  searchBtnMobile.addEventListener("click", () => goToQuery(siteSearchMobile.value));
  siteSearchMobile.addEventListener("keydown", (e) => {
    if (e.key === "Enter") goToQuery(siteSearchMobile.value);
  });
}

// Suscripción (demo)
const subscribeForm = document.querySelector("#subscribeForm");
const subscribeEmail = document.querySelector("#subscribeEmail");
const subscribeMsg = document.querySelector("#subscribeMsg");

if (subscribeForm && subscribeEmail && subscribeMsg) {
  subscribeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = subscribeEmail.value.trim();
    if (!email) return;

    // demo: abre email para enviarte la suscripción
    subscribeMsg.textContent = "¡Listo! (demo) Ahora lo conectamos a un servicio real para que llegue el boletín.";
    subscribeEmail.value = "";
  });
}
// =========================
// DISCOVER: filtros + buscador + toggle embeds
// =========================
(function () {
  const search = document.getElementById("discoverSearch");
  const filterCity = document.getElementById("filterCity");
  const filterStatus = document.getElementById("filterStatus");
  const grid = document.getElementById("artistsGrid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".artist-card"));

  function applyFilters() {
    const q = (search?.value || "").trim().toLowerCase();
    const city = filterCity?.value || "all";
    const status = filterStatus?.value || "all";

    cards.forEach(card => {
      const cCity = card.getAttribute("data-city") || "";
      const cStatus = card.getAttribute("data-status") || "";
      const cSearch = (card.getAttribute("data-search") || "").toLowerCase() + " " + (card.textContent || "").toLowerCase();

      const okQ = !q || cSearch.includes(q);
      const okCity = (city === "all") || (cCity === city);
      const okStatus = (status === "all") || (cStatus === status);

      card.classList.toggle("hidden", !(okQ && okCity && okStatus));
    });
  }

  search?.addEventListener("input", applyFilters);
  filterCity?.addEventListener("change", applyFilters);
  filterStatus?.addEventListener("change", applyFilters);
  applyFilters();

  // Toggle embeds
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toggle]");
    if (!btn) return;
    const id = btn.getAttribute("data-toggle");
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("hidden");
  });
})();
// Toggle embeds en Discover
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".js-toggle-embed");
  if (!btn) return;

  const card = btn.closest(".artist-card");
  const isOpen = card.classList.toggle("is-open");

  btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});
// Filtro Discover (simple)
(function(){
  const search = document.getElementById("discoverSearch");
  const city = document.getElementById("cityFilter");
  const status = document.getElementById("statusFilter");
  const cards = Array.from(document.querySelectorAll(".artist-card"));

  if (!search || !city || !status || !cards.length) return;

  function apply(){
    const q = (search.value || "").toLowerCase().trim();
    const c = city.value;
    const s = status.value;

    cards.forEach(card => {
      const name = (card.dataset.name || "").toLowerCase();
      const cityVal = (card.dataset.city || "");
      const style = (card.dataset.style || "").toLowerCase();
      const statusVal = (card.dataset.status || "");

      const matchText = !q || name.includes(q) || style.includes(q) || cityVal.toLowerCase().includes(q);
      const matchCity = (c === "all") || (cityVal === c);
      const matchStatus = (s === "all") || (statusVal === s);

      card.style.display = (matchText && matchCity && matchStatus) ? "" : "none";
    });
  }

  search.addEventListener("input", apply);
  city.addEventListener("change", apply);
  status.addEventListener("change", apply);
})();
 