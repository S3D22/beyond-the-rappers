let allArtists = [];

document.addEventListener("DOMContentLoaded", async () => {
  initThemeMode();
  initMenu();
  initSearch();
  initPosterModal();
  initSpotifyModal();
  initCookieConsent();
  initSmoothInternalLinks();

  await loadArtists();
  initDiscoverFilters();
  await loadProducts();
  await initWorldMap();
});

/* =========================
   HELPERS
========================= */
function getSpotifyEmbedUrl(url) {
  if (!url) return "";

  const artistMatch = url.match(/spotify\.com\/(?:intl-[^/]+\/)?artist\/([a-zA-Z0-9]+)/i);
  if (artistMatch) {
    return `https://open.spotify.com/embed/artist/${artistMatch[1]}`;
  }

  const trackMatch = url.match(/spotify\.com\/(?:intl-[^/]+\/)?track\/([a-zA-Z0-9]+)/i);
  if (trackMatch) {
    return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
  }

  const albumMatch = url.match(/spotify\.com\/(?:intl-[^/]+\/)?album\/([a-zA-Z0-9]+)/i);
  if (albumMatch) {
    return `https://open.spotify.com/embed/album/${albumMatch[1]}`;
  }

  return "";
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

  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }

  if (savedContrast === "true") {
    body.classList.add("high-contrast");
  }

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem(
      "btr_theme_mode",
      body.classList.contains("dark-mode") ? "dark" : "light"
    );
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
    tienda: "#btr-shop",
    shop: "#btr-shop",
    merch: "#btr-shop",
    mapa: "#mapa",
    newsletter: "#newsletter",
    home: "#home",
    inicio: "#home"
  };

  function doSearch(inputEl) {
    if (!inputEl) return;

    const value = inputEl.value.trim().toLowerCase();
    if (!value) return;

    const target = routes[value];
    if (target) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
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
      description: artist.description || artist.bio || "",
      bio: artist.bio || artist.description || "",
      search:
        artist.search ||
        [
          artist.name || "",
          artist.city || "",
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

  grid.innerHTML = artists
    .map((artist) => {
      const spotifyBtn = artist.spotify
        ? `<a class="icon-link" href="${artist.spotify}" target="_blank" rel="noopener">Spotify</a>`
        : `<span class="icon-link icon-link--static">No Spotify</span>`;

      const youtubeBtn = artist.youtube
        ? `<a class="icon-link" href="${artist.youtube}" target="_blank" rel="noopener">YouTube</a>`
        : "";

      const instagramBtn = artist.instagram
        ? `<a class="icon-link" href="${artist.instagram}" target="_blank" rel="noopener">Instagram</a>`
        : "";

      const playBtn = artist.spotifyEmbed
        ? `<button class="icon-link" type="button" data-open-spotify="${artist.spotifyEmbed}">Play</button>`
        : "";

      return `
        <article class="artist-card"
          data-city="${artist.city || ""}"
          data-type="${artist.type || ""}"
          data-search="${artist.search || ""}">
          <header class="artist-top">
            <div class="artist-avatar">
              <img src="${artist.image || ""}" loading="lazy" alt="Foto de ${artist.name || ""}">
            </div>
            <div class="artist-head">
              <h3 class="artist-name">${artist.name || ""}</h3>
              <div class="artist-meta">
                <span class="badge">${artist.city || ""}</span>
                <span class="badge">${artist.status || ""}</span>
                <span class="badge">${artist.type || ""}</span>
              </div>
            </div>
          </header>

          <div class="artist-bio muted">${artist.bio || ""}</div>

          <div class="artist-actions">
            ${spotifyBtn}
            ${youtubeBtn}
            ${instagramBtn}
            ${playBtn}
          </div>
        </article>
      `;
    })
    .join("");
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
      const matchType = type === "all" || artist.type === type;
      return matchSearch && matchCity && matchType;
    });

    renderArtists(filtered);
  }

  search.addEventListener("input", applyFilters);
  cityFilter.addEventListener("change", applyFilters);
  typeFilter.addEventListener("change", applyFilters);
}

/* =========================
   PRODUCTOS DESDE JSON
========================= */
async function loadProducts() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;

  try {
    const response = await fetch("data/products.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const products = await response.json();

    grid.innerHTML = products
      .map(
        (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <p class="muted">${product.description}</p>
        <p class="price">${product.price}</p>
        <a href="${product.link}" target="_blank" rel="noopener">Comprar</a>
      </article>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error cargando productos:", error);
    grid.innerHTML = `<p class="muted">No se pudieron cargar los productos.</p>`;
  }
}

/* =========================
   MAPA MUNDIAL PRO
========================= */
async function initWorldMap() {
  const mapEl = document.getElementById("worldMap");
  const tooltip = document.getElementById("mapTooltip");
  const resetBtn = document.getElementById("mapResetBtn");
  const filterButtons = document.querySelectorAll("[data-map-filter]");

  if (!mapEl || typeof d3 === "undefined" || typeof topojson === "undefined") return;

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
    .select("#worldMap")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Mapa mundial interactivo de artistas Beyond The Rappers");

  const defs = svg.append("defs");

  const glow = defs.append("filter").attr("id", "pointGlow");

  glow.append("feGaussianBlur").attr("stdDeviation", "3.5").attr("result", "coloredBlur");

  const feMerge = glow.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const projection = d3
    .geoNaturalEarth1()
    .scale(width / 6.15)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection);

  svg.append("rect").attr("width", width).attr("height", height).attr("fill", bgColor);

  svg
    .append("ellipse")
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

  try {
    const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
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
  } catch (error) {
    console.error("Error cargando mapa mundial:", error);
    return;
  }

  const zoom = d3
    .zoom()
    .scaleExtent([1, 7])
    .translateExtent([
      [0, 0],
      [width, height]
    ])
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
    return base.filter((a) => a.type === currentFilter);
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

  function pointColor(type) {
    return type === "Tattoo" ? "#b45309" : "#0f62fe";
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
          return `<a class="btn btn-ghost btn-sm" href="${link}" target="_blank" rel="noopener">${a.name}</a>`;
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
        <div class="map-tooltip-title">${a.name}</div>
        <div class="map-tooltip-meta">${a.city} · ${a.type}</div>
      `;
    } else {
      tooltip.innerHTML = `
        <div class="map-tooltip-title">${cluster.items.length} perfiles cercanos</div>
        <div class="map-tooltip-meta">${cluster.items
          .slice(0, 4)
          .map((a) => a.name)
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

          group
            .append("circle")
            .attr("class", "map-point")
            .attr("r", 7)
            .attr("fill", pointColor(artist.type))
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2.5)
            .attr("filter", "url(#pointGlow)")
            .attr("opacity", 0.96);

          group
            .append("circle")
            .attr("class", "map-point")
            .attr("r", 14)
            .attr("fill", pointColor(artist.type))
            .attr("opacity", 0.12);
        } else {
          group
            .append("circle")
            .attr("class", "map-cluster")
            .attr("r", 14 + Math.min(d.items.length, 8))
            .attr("fill", "#111827")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2.5)
            .attr("opacity", 0.92);

          group
            .append("text")
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
  mapTags.textContent = [artist.city, artist.type, artist.status].filter(Boolean).join(" · ");

  const actions = [];
  if (artist.spotify) {
    actions.push(
      `<a class="btn btn-primary btn-sm" href="${artist.spotify}" target="_blank" rel="noopener">Spotify</a>`
    );
  }
  if (artist.youtube) {
    actions.push(
      `<a class="btn btn-ghost btn-sm" href="${artist.youtube}" target="_blank" rel="noopener">YouTube</a>`
    );
  }
  if (artist.instagram) {
    actions.push(
      `<a class="btn btn-ghost btn-sm" href="${artist.instagram}" target="_blank" rel="noopener">Instagram</a>`
    );
  }
  mapActions.innerHTML = actions.join("");

  if (artist.spotifyEmbed) {
    mapEmbed.innerHTML = `
      <iframe
        src="${artist.spotifyEmbed}"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>
    `;
  } else {
    mapEmbed.innerHTML = artist.bio
      ? `<p class="muted">${artist.bio}</p>`
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