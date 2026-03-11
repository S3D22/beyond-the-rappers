// =========================
// MENÚ MÓVIL
// =========================
(() => {
  const menuBtn = document.getElementById("menuBtn");
  const menuClose = document.getElementById("menuClose");
  const menuPanel = document.getElementById("menuPanel");

  if (!menuBtn || !menuPanel) return;

  function openMenu() {
    menuPanel.classList.add("open");
    menuPanel.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("modal-open");
  }

  function closeMenu() {
    menuPanel.classList.remove("open");
    menuPanel.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("modal-open");
  }

  menuBtn.addEventListener("click", () => {
    menuPanel.classList.contains("open") ? closeMenu() : openMenu();
  });

  menuClose?.addEventListener("click", closeMenu);

  document.querySelectorAll(".menu-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

// =========================
// BUSCADOR GENERAL
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
    inicio: "#home"
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

    document.querySelector("#home")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
// DISCOVER: FILTROS
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
// DISCOVER: EMBEDS SPOTIFY
// =========================
(() => {
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open]");
    if (!openBtn) return;

    const id = openBtn.dataset.open;
    const panel = document.getElementById(id);
    if (!panel) return;

    const isHidden = panel.classList.contains("hidden");

    document.querySelectorAll(".artist-embed").forEach((embed) => {
      embed.classList.add("hidden");
    });

    if (isHidden) {
      panel.classList.remove("hidden");
    }
  });
})();
// =========================
// MODAL CARTELES / POSTERS
// =========================
(() => {
  const modal = document.getElementById("posterModal");
  const img = document.getElementById("posterModalImg");
  const title = document.getElementById("posterModalTitle");
  const meta = document.getElementById("posterModalMeta");

  if (!modal || !img || !title || !meta) return;

  function openPoster(src, ttl, mta) {
    img.src = src || "";
    img.alt = ttl || "Cartel completo";
    title.textContent = ttl || "";
    meta.textContent = mta || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closePoster() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll(".poster-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      openPoster(
        btn.getAttribute("data-poster-src"),
        btn.getAttribute("data-poster-title"),
        btn.getAttribute("data-poster-meta")
      );
    });
  });

  document.querySelectorAll("[data-poster-close]").forEach((btn) => {
    btn.addEventListener("click", closePoster);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closePoster();
    }
  });
})();

// =========================
// MAP MODAL
// =========================
(() => {
  const modal = document.getElementById("mapModal");
  const img = document.getElementById("mapImg");
  const name = document.getElementById("mapName");
  const tags = document.getElementById("mapTags");
  const actions = document.getElementById("mapActions");
  const embed = document.getElementById("mapEmbed");

  if (!modal || !img || !name || !tags || !actions || !embed) return;

  function spotifyEmbedFromUrl(url) {
    if (!url) return "";

    const artistMatch = url.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?artist\/([a-zA-Z0-9]+)/);
    if (artistMatch) return `https://open.spotify.com/embed/artist/${artistMatch[1]}`;

    const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) return `https://open.spotify.com/embed/track/${trackMatch[1]}`;

    return "";
  }

  window.openMapArtistModal = function (data) {
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
  };

  function closeMapModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    embed.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

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

  if (!mapRoot) {
    console.log("No existe #worldMap");
    return;
  }

  if (typeof d3 === "undefined" || typeof topojson === "undefined") {
    console.log("Faltan librerías D3 o TopoJSON");
    return;
  }

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
      alt: false,
      dx: -10,
      dy: 18
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
      alt: false,
      dx: 0,
      dy: -18
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
      alt: false,
      dx: 18,
      dy: 10
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
      alt: false,
      dx: -18,
      dy: -10
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
      alt: true,
      dx: 16,
      dy: -14
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
        .attr("class", "map-ocean")
        .attr("width", width)
        .attr("height", height);

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
          return `translate(${p[0] + (d.dx || 0)}, ${p[1] + (d.dy || 0)})`;
        })
        .style("cursor", "pointer");

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
          tooltip.style.opacity = "1";
        })
        .on("mousemove", function (event) {
          if (!tooltip) return;
          tooltip.style.transform = `translate(${event.offsetX + 18}px, ${event.offsetY - 12}px)`;
        })
        .on("mouseleave", function () {
          if (!tooltip) return;
          tooltip.style.transform = "translate(-9999px,-9999px)";
          tooltip.style.opacity = "0";
        })
        .on("click", function (_, d) {
          if (window.openMapArtistModal) {
            window.openMapArtistModal(d);
          }
        });

      console.log("Mapa dibujado correctamente");
    } catch (err) {
      console.error("Error dibujando mapa:", err);
    }
  }

  initMap();
})();