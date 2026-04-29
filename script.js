let allArtists = [];
let worldMapResizeTimeout = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    initThemeMode();
    initMenu();
    initSearch();
    initPosterModal();
    initSpotifyModal();
    initCookieConsent();
    initSmoothInternalLinks();

    await loadArtists();
    initDiscoverFilters();
    await initWorldMap();

    window.addEventListener("resize", () => {
      clearTimeout(worldMapResizeTimeout);
      worldMapResizeTimeout = setTimeout(() => {
        initWorldMap();
      }, 180);
    });
  } catch (error) {
    console.error("Error inicializando la web:", error);
  }
});

/* =========================
   HELPERS
========================= */
function getSpotifyEmbedUrl(url) {
  if (!url) return "";

  const artistMatch = url.match(/spotify\.com\/(?:intl-[^/]+\/)?artist\/([a-zA-Z0-9]+)/i);
  if (artistMatch) return `https://open.spotify.com/embed/artist/${artistMatch[1]}`;

  const trackMatch = url.match(/spotify\.com\/(?:intl-[^/]+\/)?track\/([a-zA-Z0-9]+)/i);
  if (trackMatch) return `https://open.spotify.com/embed/track/${trackMatch[1]}`;

  const albumMatch = url.match(/spotify\.com\/(?:intl-[^/]+\/)?album\/([a-zA-Z0-9]+)/i);
  if (albumMatch) return `https://open.spotify.com/embed/album/${albumMatch[1]}`;

  return "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   THEME / CONTRAST
========================= */
function initThemeMode() {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const contrastToggle = document.getElementById("contrastToggle");

  const savedTheme = localStorage.getItem("btr_theme_mode");
  const savedContrast = localStorage.getItem("btr_high_contrast");

  if (savedTheme === "dark") body.classList.add("dark-mode");
  if (savedContrast === "true") body.classList.add("high-contrast");

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem(
      "btr_theme_mode",
      body.classList.contains("dark-mode") ? "dark" : "light"
    );
    initWorldMap();
  });

  contrastToggle?.addEventListener("click", () => {
    body.classList.toggle("high-contrast");
    localStorage.setItem(
      "btr_high_contrast",
      body.classList.contains("high-contrast") ? "true" : "false"
    );
  });
}

/* =========================
   MENÚ MÓVIL
========================= */
function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const menuClose = document.getElementById("menuClose");
  const menuPanel = document.getElementById("menuPanel");
  const menuLinks = document.querySelectorAll(".menu-link");

  if (!menuBtn || !menuPanel) return;

  function openMenu() {
    menuPanel.classList.add("open");
    menuPanel.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menuPanel.classList.remove("open");
    menuPanel.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  menuBtn.addEventListener("click", () => {
    if (menuPanel.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuClose?.addEventListener("click", closeMenu);
  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* =========================
   BUSCADOR
========================= */
function initSearch() {
  const siteSearch = document.getElementById("siteSearch");
  const searchBtn = document.getElementById("searchBtn");
  const siteSearchMobile = document.getElementById("siteSearchMobile");
  const searchBtnMobile = document.getElementById("searchBtnMobile");

  const routes = {
    podcast: "#podcast",
    noticias: "#noticias",
    eventos: "#eventos",
    discover: "#discover",
    descubrir: "#descubrir",
    contacto: "#contacto",
    mapa: "#mapa",
    home: "#home",
    inicio: "#home",
    tienda: "https://shop.beyondtherappers.com",
    shop: "https://shop.beyondtherappers.com",
    merch: "https://shop.beyondtherappers.com"
  };

  function doSearch(inputEl) {
    if (!inputEl) return;

    const value = inputEl.value.trim().toLowerCase();
    if (!value) return;

    const target = routes[value];
    if (target) {
      if (target.startsWith("http")) {
        window.open(target, "_blank", "noopener");
        return;
      }

      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    const allSections = document.querySelectorAll("section[id]");
    const found = Array.from(allSections).find((section) =>
      section.id.toLowerCase().includes(value)
    );

    if (found) {
      found.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      alert("No se encontró ninguna sección con ese nombre.");
    }
  }

  searchBtn?.addEventListener("click", () => doSearch(siteSearch));
  searchBtnMobile?.addEventListener("click", () => doSearch(siteSearchMobile));

  siteSearch?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch(siteSearch);
  });

  siteSearchMobile?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch(siteSearchMobile);
  });
}

/* =========================
   LINKS INTERNOS
========================= */
function initSmoothInternalLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* =========================
   MODAL CARTEL
========================= */
function initPosterModal() {
  const modal = document.getElementById("posterModal");
  const img = document.getElementById("posterModalImg");
  const title = document.getElementById("posterModalTitle");
  const meta = document.getElementById("posterModalMeta");
  const closers = document.querySelectorAll("[data-poster-close]");

  if (!modal || !img || !title || !meta) return;

  function openModal(src, posterTitle, posterMeta) {
    img.src = src || "";
    img.alt = posterTitle || "Cartel";
    title.textContent = posterTitle || "";
    meta.textContent = posterMeta || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    img.src = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".poster-trigger");
    if (!trigger) return;

    openModal(
      trigger.dataset.posterSrc,
      trigger.dataset.posterTitle,
      trigger.dataset.posterMeta
    );
  });

  closers.forEach((c) => c.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* =========================
   MODAL SPOTIFY
========================= */
function initSpotifyModal() {
  const modal = document.getElementById("spotifyModal");
  const frameWrap = document.getElementById("spotifyModalFrame");
  const closeEls = modal ? modal.querySelectorAll("[data-close]") : [];

  if (!modal || !frameWrap) return;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-spotify]");
    if (!btn) return;

    const embed = btn.getAttribute("data-open-spotify");
    if (!embed) return;

    frameWrap.innerHTML = `
      <iframe
        src="${embed}"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    frameWrap.innerHTML = "";
    document.body.style.overflow = "";
  }

  closeEls.forEach((el) => el.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* =========================
   ARTISTAS DESDE JSON
========================= */
async function loadArtists() {
  const grid = document.getElementById("discoverGrid");
  if (!grid) return;

  try {
    const response = await fetch("data/artists.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const artists = await response.json();

    allArtists = artists.map((artist) => ({
      ...artist,
      nationality: artist.nationality || "",
      section: artist.section || artist.type || "Music",
      description: artist.description || artist.bio || "",
      bio: artist.bio || artist.description || "",
      search:
        artist.search ||
        [
          artist.name || "",
          artist.city || "",
          artist.nationality || "",
          artist.section || "",
          artist.description || "",
          artist.bio || "",
          artist.type || "",
          artist.status || ""
        ]
          .join(" ")
          .toLowerCase(),
      spotifyEmbed: artist.spotifyEmbed || getSpotifyEmbedUrl(artist.spotify),
      lat:
        typeof artist.lat === "number"
          ? artist.lat
          : typeof artist.coords?.lat === "number"
          ? artist.coords.lat
          : null,
      lng:
        typeof artist.lng === "number"
          ? artist.lng
          : typeof artist.coords?.lng === "number"
          ? artist.coords.lng
          : null,
      type: artist.type || "Artista",
      status: artist.status || "Activo"
    }));

    renderArtists(allArtists);
  } catch (error) {
    console.error("Error cargando artistas:", error);
    grid.innerHTML = `<p class="muted">No se pudieron cargar los artistas.</p>`;
  }
}

function renderArtists(artists) {
  const grid = document.getElementById("discoverGrid");
  if (!grid) return;

  const sections = [
    { key: "Music", title: "Cantantes / MCs" },
    { key: "Tattoo", title: "Tatuadores" },
    { key: "Visual", title: "Fotógrafos / Filmmakers" }
  ];

  function renderCard(artist) {
    const name = escapeHtml(artist.name || "");
    const city = escapeHtml(artist.city || "");
    const nationality = escapeHtml(artist.nationality || "");
    const status = escapeHtml(artist.status || "");
    const type = escapeHtml(artist.type || "");
    const bio = escapeHtml(artist.bio || "");
    const image = escapeHtml(artist.image || "");
    const spotify = escapeHtml(artist.spotify || "");
    const youtube = escapeHtml(artist.youtube || "");
    const instagram = escapeHtml(artist.instagram || "");
    const spotifyEmbed = escapeHtml(artist.spotifyEmbed || "");

    const spotifyBtn = artist.spotify
      ? `<a class="icon-link" href="${spotify}" target="_blank" rel="noopener">Spotify</a>`
      : `<span class="icon-link icon-link--static">No Spotify</span>`;

    const youtubeBtn = artist.youtube
      ? `<a class="icon-link" href="${youtube}" target="_blank" rel="noopener">YouTube</a>`
      : "";

    const instagramBtn = artist.instagram
      ? `<a class="icon-link" href="${instagram}" target="_blank" rel="noopener">Instagram</a>`
      : "";

    const playBtn = artist.spotifyEmbed
      ? `<button class="icon-link" type="button" data-open-spotify="${spotifyEmbed}">Play</button>`
      : "";

    return `
      <article class="artist-card"
        data-city="${city}"
        data-type="${type}"
        data-search="${escapeHtml(artist.search || "")}"
        style="position:relative; overflow:hidden; isolation:isolate;">
        
        <div
          class="artist-card-bg"
          style="
            position:absolute;
            inset:0;
            background-image:url('${image}');
            background-size:cover;
            background-position:center;
            opacity:0.14;
            filter:blur(0px);
            transform:scale(1.05);
            z-index:0;
            pointer-events:none;
          "></div>

        <div
          class="artist-card-overlay"
          style="
            position:absolute;
            inset:0;
            background:linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.88) 48%, rgba(255,255,255,0.95) 100%);
            z-index:0;
            pointer-events:none;
          "></div>

        <div style="position:relative; z-index:1;">
          <header class="artist-top">
            <div class="artist-avatar">
              <img src="${image}" loading="lazy" alt="Foto de ${name}">
            </div>
            <div class="artist-head">
              <h3 class="artist-name">${name}</h3>
              <div class="artist-meta">
                <span class="badge">${city}</span>
                <span class="badge">${nationality}</span>
                <span class="badge">${status}</span>
                <span class="badge">${type}</span>
              </div>
            </div>
          </header>

          <div class="artist-bio muted">${bio}</div>

          <div class="artist-actions">
            ${spotifyBtn}
            ${youtubeBtn}
            ${instagramBtn}
            ${playBtn}
          </div>
        </div>
      </article>
    `;
  }

  const html = sections
    .map((section) => {
      const items = artists.filter((artist) => artist.section === section.key);
      if (!items.length) return "";

      return `
        <section class="discover-section-block" style="margin-bottom:48px;">
          <div class="discover-section-head" style="margin-bottom:18px;">
            <h3 class="discover-section-title" style="margin:0; font-size:1.35rem; text-transform:uppercase; letter-spacing:0.04em;">
              ${section.title}
            </h3>
          </div>

          <div
            class="discover-grid-inner"
            style="
              display:grid;
              grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));
              gap:24px;
            ">
            ${items.map(renderCard).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  grid.innerHTML = html || `<p class="muted">No se encontraron artistas.</p>`;
}

/* =========================
   FILTROS DISCOVER
========================= */
function initDiscoverFilters() {
  const search = document.getElementById("discoverSearch");
  const cityFilter = document.getElementById("cityFilter");
  const typeFilter = document.getElementById("typeFilter");

  if (!search || !cityFilter || !typeFilter) return;

  function applyFilters() {
    const q = search.value.trim().toLowerCase();
    const city = cityFilter.value;
    const type = typeFilter.value;

    const filtered = allArtists.filter((artist) => {
      const artistSearch = (artist.search || "").toLowerCase();
      const matchSearch = !q || artistSearch.includes(q);
      const matchCity = city === "all" || artist.city === city;
      const matchType = type === "all" || artist.type === type || artist.section === type;
      return matchSearch && matchCity && matchType;
    });

    renderArtists(filtered);
  }

  search.addEventListener("input", applyFilters);
  cityFilter.addEventListener("change", applyFilters);
  typeFilter.addEventListener("change", applyFilters);
}

/* =========================
   MAPA MUNDIAL PRO
========================= */
async function initWorldMap() {
  const mapEl = document.getElementById("worldMap");
  const tooltip = document.getElementById("mapTooltip");
  const resetBtn = document.getElementById("mapResetBtn");
  const filterButtons = document.querySelectorAll("[data-map-filter]");

  if (!mapEl) {
    console.error("No existe #worldMap en el HTML");
    return;
  }

  if (typeof d3 === "undefined") {
    console.error("D3 no está cargado");
    mapEl.innerHTML = `<p class="muted">Error: D3 no cargó.</p>`;
    return;
  }

  if (typeof topojson === "undefined") {
    console.error("TopoJSON no está cargado");
    mapEl.innerHTML = `<p class="muted">Error: TopoJSON no cargó.</p>`;
    return;
  }

  mapEl.innerHTML = "";
  mapEl.style.position = "relative";

  const width = Math.max(mapEl.clientWidth || 1000, 320);
  const height = 560;

  const isDark = document.body.classList.contains("dark-mode");
  const bgColor = isDark ? "#0b1220" : "#f8fafc";
  const oceanGlow = isDark ? "#0f172a" : "#eef4fb";
  const countryColor = isDark ? "#243244" : "#dbe7f3";
  const countryStroke = isDark ? "#5b6b80" : "#aab8c8";

  const svg = d3
    .select(mapEl)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Mapa mundial interactivo de artistas Beyond The Rappers");

  const defs = svg.append("defs");

  const glow = defs.append("filter").attr("id", "pointGlow");
  glow.append("feGaussianBlur")
    .attr("stdDeviation", "3.5")
    .attr("result", "coloredBlur");

  const feMerge = glow.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const projection = d3
    .geoNaturalEarth1()
    .scale(width / 6.15)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", bgColor);

  svg.append("ellipse")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("rx", width * 0.43)
    .attr("ry", height * 0.36)
    .attr("fill", oceanGlow)
    .attr("opacity", 0.85);

  const mainGroup = svg.append("g").attr("class", "map-main-group");
  const countriesGroup = mainGroup.append("g").attr("class", "map-countries-group");
  const pointsGroup = mainGroup.append("g").attr("class", "map-points-group");

  let currentFilter = "all";
  let world;

  try {
    world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
  } catch (error) {
    console.error("Error cargando mapa mundial:", error);
    mapEl.innerHTML = `<p class="muted">No se pudo cargar el mapa mundial.</p>`;
    return;
  }

  const countries = topojson.feature(world, world.objects.countries);

  countriesGroup
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("class", "map-country")
    .attr("d", path)
    .attr("fill", countryColor)
    .attr("stroke", countryStroke)
    .attr("stroke-width", 0.7);

  const zoom = d3
    .zoom()
    .scaleExtent([1, 7])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", (event) => {
      mainGroup.attr("transform", event.transform);
    });

  svg.call(zoom);

  resetBtn?.addEventListener("click", () => {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-map-filter") || "all";
      renderMapPoints();
    });
  });

  const hint = document.createElement("div");
  hint.className = "map-zoom-hint";
  hint.textContent = "Zoom con rueda o dedos";
  mapEl.appendChild(hint);

  function getFilteredArtists() {
    const base = allArtists.filter(
      (a) => typeof a.lat === "number" && typeof a.lng === "number"
    );

    if (currentFilter === "all") return base;
    return base.filter((a) => a.type === currentFilter || a.section === currentFilter);
  }

  function buildClusters(artists) {
    const clustered = [];
    const threshold = 18;

    artists.forEach((artist) => {
      const projected = projection([artist.lng, artist.lat]);
      if (!projected) return;

      const [x, y] = projected;
      let found = null;

      for (const cluster of clustered) {
        const dx = cluster.x - x;
        const dy = cluster.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          found = cluster;
          break;
        }
      }

      if (found) {
        found.items.push(artist);
        found.x = (found.x * (found.items.length - 1) + x) / found.items.length;
        found.y = (found.y * (found.items.length - 1) + y) / found.items.length;
      } else {
        clustered.push({
          x,
          y,
          items: [artist]
        });
      }
    });

    return clustered;
  }

  function pointColor(type, section) {
    if (type === "Tattoo" || section === "Tattoo") return "#b45309";
    if (type === "Filmmaker" || type === "Photo" || section === "Visual") return "#7c3aed";
    return "#0f62fe";
  }

  function openArtistOrCluster(cluster) {
    if (cluster.items.length === 1) {
      openMapModal(cluster.items[0]);
      return;
    }

    const first = cluster.items[0];
    const synthetic = {
      name: `Zona con ${cluster.items.length} perfiles`,
      city: first.city || "Varias ciudades",
      type: "Mixto",
      status: "Grupo",
      image: first.image || "",
      spotify: "",
      youtube: "",
      instagram: "",
      spotifyEmbed: "",
      bio: cluster.items.map((a) => `• ${a.name}`).join(" · ")
    };

    openMapModal(synthetic);

    const actions = document.getElementById("mapActions");
    const embed = document.getElementById("mapEmbed");

    if (actions) {
      actions.innerHTML = cluster.items
        .map((a) => {
          const link = a.instagram || a.spotify || a.youtube || "#";
          return `<a class="btn btn-ghost btn-sm" href="${escapeHtml(link)}" target="_blank" rel="noopener">${escapeHtml(a.name)}</a>`;
        })
        .join("");
    }

    if (embed) {
      embed.innerHTML = `<p class="muted">Pulsa uno de los nombres para abrir sus enlaces.</p>`;
    }
  }

  function showTooltip(event, cluster) {
    if (!tooltip) return;

    if (cluster.items.length === 1) {
      const a = cluster.items[0];
      tooltip.innerHTML = `
        <div class="map-tooltip-title">${escapeHtml(a.name)}</div>
        <div class="map-tooltip-meta">${escapeHtml(a.city)} · ${escapeHtml(a.type)}</div>
      `;
    } else {
      tooltip.innerHTML = `
        <div class="map-tooltip-title">${cluster.items.length} perfiles cercanos</div>
        <div class="map-tooltip-meta">${cluster.items
          .slice(0, 4)
          .map((a) => escapeHtml(a.name))
          .join(", ")}${cluster.items.length > 4 ? "..." : ""}</div>
      `;
    }

    tooltip.style.opacity = "1";
    tooltip.style.left = `${event.clientX + 14}px`;
    tooltip.style.top = `${event.clientY + 14}px`;
  }

  function moveTooltip(event) {
    if (!tooltip) return;
    tooltip.style.left = `${event.clientX + 14}px`;
    tooltip.style.top = `${event.clientY + 14}px`;
  }

  function hideTooltip() {
    if (!tooltip) return;
    tooltip.style.opacity = "0";
  }

  function renderMapPoints() {
    const filtered = getFilteredArtists();
    const clusters = buildClusters(filtered);

    const pointSelection = pointsGroup
      .selectAll(".map-marker-wrap")
      .data(clusters, (_, i) => `cluster-${i}`);

    pointSelection.exit().remove();

    const enter = pointSelection
      .enter()
      .append("g")
      .attr("class", "map-marker-wrap")
      .style("cursor", "pointer");

    enter
      .merge(pointSelection)
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .each(function (d) {
        const group = d3.select(this);
        group.selectAll("*").remove();

        if (d.items.length === 1) {
          const artist = d.items[0];

          group.append("circle")
            .attr("class", "map-point")
            .attr("r", 7)
            .attr("fill", pointColor(artist.type, artist.section))
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2.5)
            .attr("filter", "url(#pointGlow)")
            .attr("opacity", 0.96);

          group.append("circle")
            .attr("class", "map-point")
            .attr("r", 14)
            .attr("fill", pointColor(artist.type, artist.section))
            .attr("opacity", 0.12);
        } else {
          group.append("circle")
            .attr("class", "map-cluster")
            .attr("r", 14 + Math.min(d.items.length, 8))
            .attr("fill", "#111827")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2.5)
            .attr("opacity", 0.92);

          group.append("text")
            .attr("class", "map-cluster-label")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .text(d.items.length);
        }
      })
      .on("mouseenter", function (event, d) {
        showTooltip(event, d);
      })
      .on("mousemove", function (event) {
        moveTooltip(event);
      })
      .on("mouseleave", function () {
        hideTooltip();
      })
      .on("click", function (_, d) {
        openArtistOrCluster(d);
      });
  }

  renderMapPoints();
}

/* =========================
   MODAL MAPA
========================= */
function openMapModal(artist) {
  const modal = document.getElementById("mapModal");
  const mapImg = document.getElementById("mapImg");
  const mapName = document.getElementById("mapName");
  const mapTags = document.getElementById("mapTags");
  const mapActions = document.getElementById("mapActions");
  const mapEmbed = document.getElementById("mapEmbed");

  if (!modal || !mapImg || !mapName || !mapTags || !mapActions || !mapEmbed) return;

  mapImg.src = artist.image || "";
  mapImg.alt = artist.name || "";
  mapName.textContent = artist.name || "";
  mapTags.textContent = [
    artist.city,
    artist.nationality,
    artist.type,
    artist.status
  ].filter(Boolean).join(" · ");

  const actions = [];
  if (artist.spotify) {
    actions.push(
      `<a class="btn btn-primary btn-sm" href="${escapeHtml(artist.spotify)}" target="_blank" rel="noopener">Spotify</a>`
    );
  }
  if (artist.youtube) {
    actions.push(
      `<a class="btn btn-ghost btn-sm" href="${escapeHtml(artist.youtube)}" target="_blank" rel="noopener">YouTube</a>`
    );
  }
  if (artist.instagram) {
    actions.push(
      `<a class="btn btn-ghost btn-sm" href="${escapeHtml(artist.instagram)}" target="_blank" rel="noopener">Instagram</a>`
    );
  }
  mapActions.innerHTML = actions.join("");

  if (artist.spotifyEmbed) {
    mapEmbed.innerHTML = `
      <iframe
        src="${escapeHtml(artist.spotifyEmbed)}"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>
    `;
  } else {
    mapEmbed.innerHTML = artist.bio
      ? `<p class="muted">${escapeHtml(artist.bio)}</p>`
      : `<p class="muted">Este perfil no tiene embed de Spotify.</p>`;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMapModal() {
  const modal = document.getElementById("mapModal");
  const mapEmbed = document.getElementById("mapEmbed");
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (mapEmbed) mapEmbed.innerHTML = "";
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-map-close]")) {
    closeMapModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMapModal();
  }
});

/* =========================
   COOKIES
========================= */
function initCookieConsent() {
  const root = document.getElementById("cookieConsent");
  const settingsBtn = document.getElementById("cookieSettingsBtn");
  const rejectBtn = document.getElementById("cookieRejectBtn");
  const acceptBtn = document.getElementById("cookieAcceptBtn");
  const saveBtn = document.getElementById("cookieSaveBtn");
  const settings = document.getElementById("cookieSettings");
  const analytics = document.getElementById("cookieAnalytics");
  const marketing = document.getElementById("cookieMarketing");

  if (!root) return;

  const saved = localStorage.getItem("btr_cookie_prefs");
  if (!saved) root.hidden = false;

  settingsBtn?.addEventListener("click", () => {
    if (settings) settings.hidden = !settings.hidden;
  });

  acceptBtn?.addEventListener("click", () => {
    localStorage.setItem(
      "btr_cookie_prefs",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true
      })
    );
    root.hidden = true;
  });

  rejectBtn?.addEventListener("click", () => {
    localStorage.setItem(
      "btr_cookie_prefs",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false
      })
    );
    root.hidden = true;
  });

  saveBtn?.addEventListener("click", () => {
    localStorage.setItem(
      "btr_cookie_prefs",
      JSON.stringify({
        necessary: true,
        analytics: !!analytics?.checked,
        marketing: !!marketing?.checked
      })
    );
    root.hidden = true;
  });
}
/* =========================
   EVENTO JUNIO / VENTA DE ENTRADAS
========================= */
const BTR_EVENT_DATE = new Date("2026-06-20T20:00:00");
const BTR_TICKET_URL = "https://vivetix.com/es/entradas-beyond-the-rappers-oopk?s=link";

function initBtrTicketLanding() {
  const btn = document.getElementById("ticketBtn");
  const note = document.getElementById("ticketNote");
  const pill = document.getElementById("ticketStatusPill");
  const mini = document.getElementById("ticketMiniStatus");

  if (btn) {
    const status = btn.dataset.status || "presale";

    if (status === "coming") {
      btn.textContent = "🔒 Próximamente";
      btn.removeAttribute("href");
      if (note) note.innerHTML = 'Entradas limitadas. Link oficial para compartir: <strong>beyondtherappers.com/#evento-junio</strong>';
      if (pill) pill.textContent = "PREVENTA PRÓXIMAMENTE";
      if (mini) mini.textContent = "Próximamente";
    }

    if (status === "presale") {
      btn.textContent = "🎟 Comprar entradas";
      btn.href = BTR_TICKET_URL;
      btn.target = "_blank";
      btn.rel = "noopener";
      if (note) note.innerHTML = 'Preventa activa. Aforo limitado. Link oficial: <strong>beyondtherappers.com/#evento-junio</strong>';
      if (pill) pill.textContent = "PREVENTA ACTIVA";
      if (mini) mini.textContent = "Preventa";
    }

    if (status === "soldout") {
      btn.textContent = "❌ Sold Out";
      btn.removeAttribute("href");
      if (note) note.textContent = "Entradas agotadas. Sigue atento a próximas ediciones.";
      if (pill) pill.textContent = "SOLD OUT";
      if (mini) mini.textContent = "Sold Out";
    }
  }

  const days = document.getElementById("ticketDays");
  const hours = document.getElementById("ticketHours");
  const minutes = document.getElementById("ticketMinutes");
  const seconds = document.getElementById("ticketSeconds");

  if (!days || !hours || !minutes || !seconds) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = BTR_EVENT_DATE.getTime() - now;

    if (distance <= 0) {
      days.textContent = "00";
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";
      return;
    }

    days.textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0");
    hours.textContent = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    minutes.textContent = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0");
    seconds.textContent = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", initBtrTicketLanding);