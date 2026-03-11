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

 // DISCOVER: toggle embeds en cards
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".toggle-embeds");
  if (!btn) return;

  const card = btn.closest(".artist-card");
  if (!card) return;

  card.classList.toggle("is-open");
});
// =========================
// DISCOVER — PRO behavior (tu estructura actual)
// =========================
(function () {
  // 1) Toggle embeds usando data-toggle y .hidden
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle-embeds");
    if (!btn) return;

    const targetId = btn.getAttribute("data-toggle");
    if (!targetId) return;

    const panel = document.getElementById(targetId);
    if (!panel) return;

    const isHidden = panel.classList.contains("hidden");
    panel.classList.toggle("hidden");

    // Texto del botón pro
    btn.textContent = isHidden ? "Ocultar embeds" : "Ver / ocultar embeds";
    // Si quieres más pro todavía:
    // btn.textContent = isHidden ? "Ocultar embeds" : "Mostrar embeds";
  });

  // 2) Monograma automático en .artist-top (sin tocar tu HTML)
  const cards = document.querySelectorAll(".artist-card");
  cards.forEach((card) => {
    const nameEl = card.querySelector(".artist-name");
    const top = card.querySelector(".artist-top");
    if (!nameEl || !top) return;

    const name = (nameEl.textContent || "").trim();
    if (!name) return;

    // Saca iniciales (Aka.Marroko => AM / El Asere => EA)
    const cleaned = name.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
    const parts = cleaned.split(" ").filter(Boolean);

    let mono = "";
    if (parts.length === 1) {
      mono = parts[0].slice(0, 2);
    } else {
      mono = (parts[0][0] || "") + (parts[1][0] || "");
    }
    mono = mono.toUpperCase();

    // Inyecta en CSS via attr(data-mono)
    top.setAttribute("data-mono", mono);
  });
})();
// =========================
// DISCOVER: Toggle embeds
// =========================
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".toggle-embeds");
  if (!btn) return;

  const id = btn.dataset.toggle;
  const panel = document.getElementById(id);
  if (!panel) return;

  const isHidden = panel.classList.contains("hidden");
  panel.classList.toggle("hidden");

  btn.textContent = isHidden ? "Ocultar embeds" : "Mostrar embeds";
});
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".toggle-embeds");
  if (!btn) return;
  const id = btn.getAttribute("data-toggle");
  const box = document.getElementById(id);
  if (!box) return;
  box.classList.toggle("hidden");
});
// =======================
// DISCOVER: embeds + filtros
// =======================

function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Toggle embeds (play button)
document.addEventListener("click", (e) => {
  const play = e.target.closest("[data-open]");
  if (!play) return;

  const id = play.getAttribute("data-open");
  const box = document.getElementById(id);
  if (!box) return;

  box.classList.toggle("hidden");
});

// Filtros
const searchEl = document.getElementById("discoverSearch");
const cityEl = document.getElementById("cityFilter");
const statusEl = document.getElementById("statusFilter");
const gridEl = document.getElementById("discoverGrid");

function applyDiscoverFilters() {
  if (!gridEl) return;

  const q = normalizeText(searchEl?.value);
  const city = cityEl?.value || "all";
  const status = statusEl?.value || "all";

  const cards = gridEl.querySelectorAll(".artist-card");

  cards.forEach((card) => {
    const cardCity = card.getAttribute("data-city") || "";
    const cardStatus = card.getAttribute("data-status") || "";
    const cardSearch = normalizeText(card.getAttribute("data-search"));

    const okQuery = !q || cardSearch.includes(q);
    const okCity = city === "all" || cardCity === city;
    const okStatus = status === "all" || cardStatus === status;

    card.style.display = (okQuery && okCity && okStatus) ? "" : "none";
  });
}

[searchEl, cityEl, statusEl].forEach((el) => {
  if (!el) return;
  el.addEventListener("input", applyDiscoverFilters);
  el.addEventListener("change", applyDiscoverFilters);
});

applyDiscoverFilters();

// =========================
// COOKIES (RGPD) - simple
// =========================
(function(){
  const KEY = "btr_cookie_consent"; // guarda {necessary:true, analytics:true/false, date:"..."}

  const banner = document.getElementById("cookieBanner");
  const modal  = document.getElementById("cookieModal");

  if (!banner || !modal) return;

  const btnAccept = document.getElementById("cookieAccept");
  const btnReject = document.getElementById("cookieReject");
  const btnPrefs  = document.getElementById("cookiePrefs");
  const btnClose  = document.getElementById("cookieClose");
  const btnSave   = document.getElementById("cookieSave");
  const chkAnalytics = document.getElementById("cookieAnalytics");

  const existing = localStorage.getItem(KEY);
  if (!existing) banner.classList.add("show");

  function saveConsent(analytics){
    const consent = { necessary:true, analytics: !!analytics, date: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(consent));
    banner.classList.remove("show");
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden","true");

    // Aquí, si algún día metes Google Analytics / Pixel,
    // solo lo cargas si consent.analytics === true
  }

  btnAccept?.addEventListener("click", () => saveConsent(true));
  btnReject?.addEventListener("click", () => saveConsent(false));

  btnPrefs?.addEventListener("click", () => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden","false");
  });

  btnClose?.addEventListener("click", () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden","true");
  });

  btnSave?.addEventListener("click", () => {
    saveConsent(!!chkAnalytics?.checked);
  });
})();
// Toggle embeds dentro de Discover
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open]");
  if (!btn) return;

  const id = btn.getAttribute("data-open");
  const panel = document.getElementById(id);
  if (!panel) return;

  panel.classList.toggle("hidden");
});
/* =================================
   AUTO SPOTIFY PREVIEW ON HOVER
   ================================= */

document.querySelectorAll(".artist-card").forEach(card => {

  card.addEventListener("mouseenter", () => {
    const btn = card.querySelector(".icon-link--btn");
    if(btn) btn.click();
  });

});
card.addEventListener("mouseleave", () => {
  const iframe = card.querySelector("iframe");
  if(iframe) iframe.remove();
});
// Discover: botón Play abre/cierra embeds
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open]");
  if (!btn) return;

  const id = btn.getAttribute("data-open");
  const panel = document.getElementById(id);
  if (!panel) return;

  panel.classList.toggle("hidden");
});
document.addEventListener("click", e => {

const btn = e.target.closest("[data-open]");
if(btn){

const id = btn.dataset.open;
document.getElementById(id).classList.add("active");

}

if(e.target.closest("[data-close]")){

document.querySelectorAll(".embed-modal")
.forEach(m => m.classList.remove("active"));

}
function spotifyEmbedFromUrl(url){
  if(!url) return "";

  const artist = url.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?artist\/([a-zA-Z0-9]+)/);
  if(artist) return `https://open.spotify.com/embed/artist/${artist[1]}`;

  const track = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if(track) return `https://open.spotify.com/embed/track/${track[1]}`;

  return "";
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-spotify]");

  if(btn){
    const spotifyUrl = btn.dataset.spotify;
    const embedUrl = spotifyEmbedFromUrl(spotifyUrl);
    if(!embedUrl) return;

    document.getElementById("spotifyModalFrame").innerHTML = `
      <iframe
        src="${embedUrl}"
        width="100%"
        height="152"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
      </iframe>
    `;

    document.getElementById("spotifyModal").classList.add("active");
  }

  if(e.target.closest("[data-close]")){
    document.getElementById("spotifyModal").classList.remove("active");
    document.getElementById("spotifyModalFrame").innerHTML = "";
  }
});
});