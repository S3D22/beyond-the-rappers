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


    // =========================
// MENÚ MÓVIL
// =========================
(() => {
  const menuBtn = document.getElementById("menuBtn");
  const menuClose = document.getElementById("menuClose");
  const menuPanel = document.getElementById("menuPanel");
  const menuLinks = document.querySelectorAll(".menu-link");

  if (!menuBtn || !menuPanel) return;

  function openMenu() {
    menuPanel.classList.add("is-open");
    menuPanel.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("modal-open");
  }

  function closeMenu() {
    menuPanel.classList.remove("is-open");
    menuPanel.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("modal-open");
  }

  menuBtn.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);

  menuLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuPanel.classList.contains("is-open")) {
      closeMenu();
    }
  });
})();

// =========================
// BUSCADOR
// =========================
(() => {
  const searchInput = document.getElementById("siteSearch");
  const searchBtn = document.getElementById("searchBtn");
  const searchInputMobile = document.getElementById("siteSearchMobile");
  const searchBtnMobile = document.getElementById("searchBtnMobile");

  const routes = {
    podcast: "#podcast",
    noticias: "#noticias",
    news: "#noticias",
    eventos: "#eventos",
    evento: "#evento",
    discover: "#discover",
    descubrir: "#descubrir",
    contacto: "#contacto",
    mapa: "#mapa",
    home: "#home",
    inicio: "#home",
  };

  function runSearch(value) {
    if (!value) return;
    const q = value.trim().toLowerCase();

    for (const key in routes) {
      if (q.includes(key)) {
        const target = document.querySelector(routes[key]);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
    }

    const allTextBlocks = document.querySelectorAll("section, article, .panel, .card");
    let found = null;

    allTextBlocks.forEach((el) => {
      if (found) return;
      const text = (el.textContent || "").toLowerCase();
      if (text.includes(q)) found = el;
    });

    if (found) {
      found.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  searchBtn?.addEventListener("click", () => runSearch(searchInput?.value));
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch(searchInput.value);
  });

  searchBtnMobile?.addEventListener("click", () => runSearch(searchInputMobile?.value));
  searchInputMobile?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch(searchInputMobile.value);
  });
})();

// =========================
// DISCOVER FILTROS
// =========================
(() => {
  const search = document.getElementById("discoverSearch");
  const cityFilter = document.getElementById("cityFilter");
  const typeFilter = document.getElementById("typeFilter");
  const cards = Array.from(document.querySelectorAll("#discoverGrid .artist-card"));

  if (!cards.length) return;

  function normalizeText(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function applyFilters() {
    const query = normalizeText(search?.value || "");
    const city = cityFilter?.value || "all";
    const type = typeFilter?.value || "all";

    cards.forEach((card) => {
      const cardSearch = normalizeText(card.dataset.search || "");
      const cardCity = card.dataset.city || "";
      const cardType = card.dataset.type || "";

      const matchQuery = !query || cardSearch.includes(query);
      const matchCity = city === "all" || cardCity === city;
      const matchType = type === "all" || cardType === type;

      card.style.display = matchQuery && matchCity && matchType ? "" : "none";
    });
  }

  search?.addEventListener("input", applyFilters);
  cityFilter?.addEventListener("change", applyFilters);
  typeFilter?.addEventListener("change", applyFilters);

  applyFilters();
})();

// =========================
// SPOTIFY EMBEDS EN DISCOVER
// =========================
(() => {
  const buttons = document.querySelectorAll("[data-open]");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-open");
      const panel = document.getElementById(targetId);
      if (!panel) return;

      const isHidden = panel.classList.contains("hidden");

      document.querySelectorAll(".artist-embed").forEach((embed) => {
        embed.classList.add("hidden");
      });

      if (isHidden) {
        panel.classList.remove("hidden");
      }
    });
  });
})();

// =========================
// MAPA MUNDIAL
// =========================
(() => {
  const MAP_DATA = {
    marroko: {
      name: "AKA.MARROKO",
      city: "Las Palmas",
      style: "VOY AMI",
      img: "assets/ARTIST/akaMarroko.jpeg",
      ig: "https://www.instagram.com/aka.maaaaaaaaaarroko?igsh=MWpweDd4dXN4Y2Y1ZQ==",
      sp: "https://open.spotify.com/artist/2Kq8reL54qJucfSl7eWiV8",
      yt: "https://youtube.com/@akamarroko?si=0hQWVTnWTqtqI9BE"
    },
    elasere: {
      name: "EL ASERE",
      city: "Las Palmas / Madrid / Paris / London",
      style: "Conciencia · Hardcore · Jazzy",
      img: "assets/ARTIST/ElAsere.jpg",
      ig: "https://www.instagram.com/elasereofficial/",
      sp: "https://open.spotify.com/artist/277kyAB17i5CgjdJtPPec6",
      yt: "https://youtube.com/@asereestaenlacasa?si=Qlv4NbeRU-RDHDoE"
    },
    bigdelitto: {
      name: "BIG DE LITTO",
      city: "Madrid",
      style: "Electrónica / HipHop",
      img: "assets/ARTIST/BigDeLitto.jpeg",
      ig: "https://www.instagram.com/bigdelitto?igsh=MTNxMm4yN3VwMDZycg%3D%3D&utm_source=qr",
      sp: "https://open.spotify.com/artist/1VMUauDPFXyBM4VTmQZREA",
      yt: "https://youtube.com/@bigdelitto?si=GIn7nhUlv2JajgPD"
    },
    kalatrava: {
      name: "KALATRAVA",
      city: "Madrid",
      style: "Rap / Urbano",
      img: "assets/ARTIST/KALATRAVA.jpeg",
      ig: "https://www.instagram.com/kalatrav4?igsh=Z3h1cHd5dHhtb2Fz",
      sp: "https://open.spotify.com/artist/6AnfmwUAyPF2nAhfQfhnD8",
      yt: "https://youtube.com/@kalatravaoficial?si=UfMKHCbGhwKN909k"
    },
    cardona: {
      name: "CARDONA INK",
      city: "Barcelona",
      style: "Tatuaje lettering · Freehand",
      img: "assets/ARTIST/CardonaInk.jpeg",
      ig: "https://www.instagram.com/cardona_ink?igsh=MXkyaGNscmZ6dHdsbw%3D%3D&utm_source=qr",
      sp: "",
      yt: ""
    }
  };

  const modal = document.getElementById("mapModal");
  const img = document.getElementById("mapImg");
  const name = document.getElementById("mapName");
  const tags = document.getElementById("mapTags");
  const actions = document.getElementById("mapActions");
  const embed = document.getElementById("mapEmbed");

  if (!modal) return;

  function spotifyEmbedFromUrl(url) {
    if (!url) return "";
    const artistMatch = url.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?artist\/([a-zA-Z0-9]+)/);
    if (artistMatch) return `https://open.spotify.com/embed/artist/${artistMatch[1]}`;

    const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) return `https://open.spotify.com/embed/track/${trackMatch[1]}`;

    return "";
  }

  function openMapModal(key) {
    const data = MAP_DATA[key];
    if (!data) return;

    img.src = data.img || "";
    img.alt = data.name || "";
    name.textContent = data.name || "";
    tags.textContent = `${data.city} · ${data.style}`;

    actions.innerHTML = "";
    if (data.ig) {
      actions.innerHTML += `<a class="btn btn-ghost btn-sm" href="${data.ig}" target="_blank" rel="noopener">Instagram</a>`;
    }
    if (data.yt) {
      actions.innerHTML += `<a class="btn btn-ghost btn-sm" href="${data.yt}" target="_blank" rel="noopener">YouTube</a>`;
    }
    if (data.sp) {
      actions.innerHTML += `<a class="btn btn-primary btn-sm" href="${data.sp}" target="_blank" rel="noopener">Spotify</a>`;
    }

    const embedUrl = spotifyEmbedFromUrl(data.sp);
    embed.innerHTML = embedUrl
      ? `<iframe src="${embedUrl}" width="100%" height="180" style="border:0;border-radius:18px;" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
      : "";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeMapModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    embed.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll(".map-pin").forEach((pin) => {
    pin.addEventListener("click", () => {
      openMapModal(pin.dataset.map);
    });
  });

  document.querySelectorAll("[data-map-close]").forEach((btn) => {
    btn.addEventListener("click", closeMapModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeMapModal();
    }
  });
})();
// =========================
// D3 MAPA MUNDIAL INTERACTIVO
// =========================
(() => {
  const mapRoot = document.getElementById("worldMap");
  const tooltip = document.getElementById("mapTooltip");
  const modal = document.getElementById("mapModal");

  if (!mapRoot) {
    console.log("No existe #worldMap");
    return;
  }

  console.log("Mapa encontrado");

  const ARTISTS = [
    {
      key: "marroko",
      name: "AKA.MARROKO",
      city: "Las Palmas",
      style: "VOY AMI",
      coords: [-15.43, 28.12],
      img: "assets/ARTIST/akaMarroko.jpeg",
      ig: "https://www.instagram.com/aka.maaaaaaaaaarroko?igsh=MWpweDd4dXN4Y2Y1ZQ==",
      sp: "https://open.spotify.com/artist/2Kq8reL54qJucfSl7eWiV8",
      yt: "https://youtube.com/@akamarroko?si=0hQWVTnWTqtqI9BE",
      alt: false
    },
    {
      key: "elasere",
      name: "EL ASERE",
      city: "Madrid",
      style: "Conciencia · Hardcore · Jazzy",
      coords: [-3.70, 40.41],
      img: "assets/ARTIST/ElAsere.jpg",
      ig: "https://www.instagram.com/elasereofficial/",
      sp: "https://open.spotify.com/artist/277kyAB17i5CgjdJtPPec6",
      yt: "https://youtube.com/@asereestaenlacasa?si=Qlv4NbeRU-RDHDoE",
      alt: false
    },
    {
      key: "bigdelitto",
      name: "BIG DE LITTO",
      city: "Madrid",
      style: "Electrónica / HipHop",
      coords: [-3.70, 40.41],
      img: "assets/ARTIST/BigDeLitto.jpeg",
      ig: "https://www.instagram.com/bigdelitto?igsh=MTNxMm4yN3VwMDZycg%3D%3D&utm_source=qr",
      sp: "https://open.spotify.com/artist/1VMUauDPFXyBM4VTmQZREA",
      yt: "https://youtube.com/@bigdelitto?si=GIn7nhUlv2JajgPD",
      alt: false
    },
    {
      key: "kalatrava",
      name: "KALATRAVA",
      city: "Madrid",
      style: "Rap / Urbano",
      coords: [-3.70, 40.41],
      img: "assets/ARTIST/KALATRAVA.jpeg",
      ig: "https://www.instagram.com/kalatrav4?igsh=Z3h1cHd5dHhtb2Fz",
      sp: "https://open.spotify.com/artist/6AnfmwUAyPF2nAhfQfhnD8",
      yt: "https://youtube.com/@kalatravaoficial?si=UfMKHCbGhwKN909k",
      alt: false
    },
    {
      key: "cardona",
      name: "CARDONA INK",
      city: "Barcelona",
      style: "Tatuaje lettering · Freehand",
      coords: [2.17, 41.38],
      img: "assets/ARTIST/CardonaInk.jpeg",
      ig: "https://www.instagram.com/cardona_ink?igsh=MXkyaGNscmZ6dHdsbw%3D%3D&utm_source=qr",
      sp: "",
      yt: "",
      alt: true
    }
  ];

  async function initMap() {
    try {
      const width = mapRoot.clientWidth || 1100;
      const height = 560;

      const svg = d3.select(mapRoot)
        .html("")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#0b1422");

      const projection = d3.geoMercator()
        .scale(width / 6.4)
        .translate([width / 2, height / 1.62]);

      const path = d3.geoPath(projection);

      const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
      const countries = topojson.feature(world, world.objects.countries);

      svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("class", "map-country")
        .attr("d", path);

      const markers = svg.append("g")
        .selectAll(".map-marker")
        .data(ARTISTS)
        .join("g")
        .attr("class", d => d.alt ? "map-marker alt" : "map-marker")
        .attr("transform", d => {
          const p = projection(d.coords);
          return `translate(${p[0]}, ${p[1]})`;
        });

      markers.append("circle")
        .attr("class", "pulse")
        .attr("r", 10);

      markers.append("circle")
        .attr("class", "main-dot")
        .attr("r", 8);

      markers
        .on("mouseenter", function (event, d) {
          if (!tooltip) return;
          tooltip.innerHTML = `<strong>${d.name}</strong><span>${d.city}</span>`;
          tooltip.style.transform = `translate(${event.offsetX + 18}px, ${event.offsetY - 12}px)`;
        })
        .on("mouseleave", function () {
          if (!tooltip) return;
          tooltip.style.transform = "translate(-9999px,-9999px)";
        });

      console.log("Mapa dibujado correctamente");
    } catch (err) {
      console.error("Error dibujando mapa:", err);
    }
  }

  initMap();
})();
try {

  initMap();

} catch(e) {
  console.error("Mapa error:", e);
}

})();