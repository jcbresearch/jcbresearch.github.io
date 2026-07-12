/* ============================================================
   STOCHAST — main.js
   Handles: language toggle (EN/ES), posts list, hero animation
   ============================================================ */

/* ---------- i18n dictionary ---------- */
const I18N = {
  en: {
    nav_research: "Research",
    nav_about: "About",
    nav_contact: "Contact",
    hero_title: "Aiming with method at an uncertain target.",
    hero_etym:
      "From the Greek stochastēs — one who conjectures with skill. Independent, concise analysis of global markets: equities, commodities and digital assets.",
    hero_byline: "Market analysis by <strong>Juan Carlos Baya</strong>",
    research_label: "Research Notes",
    research_title: "Latest views",
    about_label: "The Analyst",
    about_role: "Independent Market Analyst",
    contact_label: "Contact",
    contact_title: "Work with me",
    contact_text:
      "If you manage a fund or portfolio and would like independent, direct market views — or a second opinion on your current positioning — I am available for advisory engagements and bespoke research.",
    disclaimer:
      "<strong>Disclaimer.</strong> All writings and content published on this site reflect the personal views and analysis of Juan Carlos Baya and in no way constitute investment advice, an offer, or a recommendation to buy or sell any security or financial instrument. Readers should conduct their own research and consult a licensed financial advisor before making any investment decision.",
    footer_tag: "Independent market analysis",
    empty_posts: "New research notes are published here regularly. Check back soon.",
    read_note: "Read note",
    bio: [
      "Juan Carlos Baya is an independent market analyst with more than five years of experience covering global financial markets. His research spans <strong>equities, commodities and digital assets</strong>, with a focus on medium- and long-term investment horizons.",
      "His process combines top-down macro analysis with asset-level fundamentals to identify durable trends and asymmetric opportunities across asset classes. He has advised private clients on <strong>portfolio construction</strong>, translating market views into allocations aligned with each client's objectives, constraints and risk tolerance.",
      "Stochast is his research platform: concise, direct market commentary written for investors and fund managers who value independent thinking over consensus."
    ]
  },
  es: {
    nav_research: "Análisis",
    nav_about: "Sobre mí",
    nav_contact: "Contacto",
    hero_title: "Apuntar con método a un blanco incierto.",
    hero_etym:
      "Del griego stochastēs — el que conjetura con destreza. Análisis independiente y directo de los mercados globales: acciones, materias primas y activos digitales.",
    hero_byline: "Análisis de mercados por <strong>Juan Carlos Baya</strong>",
    research_label: "Notas de Análisis",
    research_title: "Visiones recientes",
    about_label: "El Analista",
    about_role: "Analista de Mercados Independiente",
    contact_label: "Contacto",
    contact_title: "Trabaja conmigo",
    contact_text:
      "Si gestionas un fondo o un portafolio y buscas una visión de mercado independiente y directa — o una segunda opinión sobre tu posicionamiento actual — estoy disponible para asesorías y research a medida.",
    disclaimer:
      "<strong>Aviso legal.</strong> Todos los escritos y contenidos publicados en este sitio reflejan la visión y el análisis personal de Juan Carlos Baya y de ninguna forma constituyen consejo de inversión, ni una oferta o recomendación de compra o venta de ningún valor o instrumento financiero. El lector debe realizar su propia investigación y consultar a un asesor financiero autorizado antes de tomar cualquier decisión de inversión.",
    footer_tag: "Análisis de mercados independiente",
    empty_posts: "Aquí se publican regularmente nuevas notas de análisis. Vuelve pronto.",
    read_note: "Leer nota",
    bio: [
      "Juan Carlos Baya es un analista de mercados independiente con más de cinco años de experiencia cubriendo los mercados financieros globales. Su análisis abarca <strong>acciones, materias primas y activos digitales</strong>, con un enfoque en horizontes de inversión de mediano y largo plazo.",
      "Su proceso combina análisis macro top-down con fundamentales a nivel de activo para identificar tendencias duraderas y oportunidades asimétricas entre clases de activos. Ha asesorado a clientes privados en la <strong>construcción de portafolios</strong>, traduciendo visiones de mercado en asignaciones alineadas con los objetivos, restricciones y tolerancia al riesgo de cada cliente.",
      "Stochast es su plataforma de research: comentario de mercado conciso y directo, escrito para inversionistas y gestores que valoran el pensamiento independiente por encima del consenso."
    ]
  }
};

/* ---------- language state ---------- */
function getLang() {
  return localStorage.getItem("stochast_lang") || "en";
}
function setLang(lang) {
  localStorage.setItem("stochast_lang", lang);
  applyLang();
}

function applyLang() {
  const lang = getLang();
  const dict = I18N[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerHTML = dict[key];
  });

  const toggle = document.getElementById("langToggle");
  if (toggle) toggle.textContent = lang === "en" ? "ES" : "EN";

  const bio = document.getElementById("bioContainer");
  if (bio) bio.innerHTML = dict.bio.map((p) => `<p>${p}</p>`).join("");

  renderPosts();
}

/* ---------- posts list ---------- */
let POSTS = [];

async function loadPosts() {
  try {
    const res = await fetch("posts/posts.json", { cache: "no-store" });
    POSTS = await res.json();
    POSTS.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (e) {
    POSTS = [];
  }
  renderPosts();
}

function renderPosts() {
  const list = document.getElementById("postList");
  if (!list) return;
  const lang = getLang();
  const dict = I18N[lang];

  if (!POSTS.length) {
    list.innerHTML = `<li class="empty-state">${dict.empty_posts}</li>`;
    return;
  }

  list.innerHTML = POSTS.map((p) => {
    const title = lang === "es" ? p.title_es : p.title_en;
    const summary = lang === "es" ? p.summary_es : p.summary_en;
    const tags = (p.tags || []).map((t) => `<span class="tag">${t}</span>`).join("");
    return `
      <li class="post-item">
        <div>
          <div class="post-meta">${p.date}</div>
          <div class="post-tags">${tags}</div>
        </div>
        <div class="post-body">
          <h3><a href="post.html?p=${encodeURIComponent(p.slug)}">${title}</a></h3>
          <p class="post-summary">${summary}</p>
        </div>
      </li>`;
  }).join("");
}

/* ---------- hero: stochastic paths animation ---------- */
function initPaths() {
  const canvas = document.getElementById("paths-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W, H, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", () => { resize(); drawStatic(); });

  const N = 16; // number of random walks
  // Palette: Aegean blue, Greek bronze, market green, muted crimson
  const COLORS = [
    { line: "rgba(35, 62, 139, 0.30)",  dot: "rgba(35, 62, 139, 0.85)",  w: 0.42 },
    { line: "rgba(156, 122, 60, 0.34)", dot: "rgba(156, 122, 60, 0.9)",  w: 0.24 },
    { line: "rgba(23, 111, 82, 0.28)",  dot: "rgba(23, 111, 82, 0.85)",  w: 0.20 },
    { line: "rgba(158, 55, 62, 0.22)",  dot: "rgba(158, 55, 62, 0.8)",   w: 0.14 }
  ];
  function pickColor() {
    let r = Math.random(), acc = 0;
    for (const c of COLORS) { acc += c.w; if (r <= acc) return c; }
    return COLORS[0];
  }
  const walks = [];
  function initWalks() {
    walks.length = 0;
    for (let i = 0; i < N; i++) {
      walks.push({
        x: -20,
        y: H * (0.15 + 0.7 * Math.random()),
        pts: [],
        speed: 0.55 + Math.random() * 0.7,
        vol: 0.6 + Math.random() * 1.1,
        color: pickColor()
      });
    }
  }

  function stepWalk(w) {
    w.x += w.speed;
    w.y += (Math.random() - 0.5) * 2 * w.vol * 2.2;
    // gentle mean reversion toward the vertical center — the "target"
    w.y += (H * 0.5 - w.y) * 0.0012;
    w.pts.push([w.x, w.y]);
    if (w.pts.length > 260) w.pts.shift();
    if (w.x > W + 30) {
      w.x = -20;
      w.y = H * (0.15 + 0.7 * Math.random());
      w.pts = [];
      w.color = pickColor();
    }
  }

  function draw(withDots) {
    ctx.clearRect(0, 0, W, H);
    for (const w of walks) {
      if (w.pts.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(w.pts[0][0], w.pts[0][1]);
      for (let i = 1; i < w.pts.length; i++) ctx.lineTo(w.pts[i][0], w.pts[i][1]);
      ctx.strokeStyle = w.color.line;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // glowing leading point — the "tip" of each trajectory
      if (withDots) {
        const [hx, hy] = w.pts[w.pts.length - 1];
        ctx.beginPath();
        ctx.arc(hx, hy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = w.color.dot;
        ctx.shadowColor = w.color.dot;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function loop() {
    for (const w of walks) stepWalk(w);
    draw(true);
    requestAnimationFrame(loop);
  }

  function drawStatic() {
    initWalks();
    for (const w of walks) {
      const steps = Math.floor(Math.random() * 400) + 200;
      for (let i = 0; i < steps; i++) stepWalk(w);
    }
    draw(false);
  }

  if (reduced) {
    drawStatic();
  } else {
    initWalks();
    // pre-roll so lines are visible immediately
    for (let i = 0; i < 160; i++) for (const w of walks) stepWalk(w);
    loop();
  }
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("langToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      setLang(getLang() === "en" ? "es" : "en");
    });
  }
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  applyLang();
  loadPosts();
  initPaths();
});
