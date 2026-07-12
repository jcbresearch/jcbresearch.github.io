/* ============================================================
   STOCHAST — post.js
   Loads a research note (markdown), handles EN/ES sections.
   Post files live in /posts and contain two sections divided by
   the markers <!-- EN --> and <!-- ES -->.
   ============================================================ */

const UI = {
  en: {
    nav_research: "Research",
    nav_about: "About",
    nav_contact: "Contact",
    back: "← Research",
    not_found: "This note could not be found.",
    disclaimer:
      "<strong>Disclaimer.</strong> All writings and content published on this site reflect the personal views and analysis of Juan Carlos Baya and in no way constitute investment advice, an offer, or a recommendation to buy or sell any security or financial instrument. Readers should conduct their own research and consult a licensed financial advisor before making any investment decision.",
    footer_tag: "Independent market analysis"
  },
  es: {
    nav_research: "Análisis",
    nav_about: "Sobre mí",
    nav_contact: "Contacto",
    back: "← Análisis",
    not_found: "No se pudo encontrar esta nota.",
    disclaimer:
      "<strong>Aviso legal.</strong> Todos los escritos y contenidos publicados en este sitio reflejan la visión y el análisis personal de Juan Carlos Baya y de ninguna forma constituyen consejo de inversión, ni una oferta o recomendación de compra o venta de ningún valor o instrumento financiero. El lector debe realizar su propia investigación y consultar a un asesor financiero autorizado antes de tomar cualquier decisión de inversión.",
    footer_tag: "Análisis de mercados independiente"
  }
};

function getLang() {
  return localStorage.getItem("stochast_lang") || "en";
}
function setLang(lang) {
  localStorage.setItem("stochast_lang", lang);
  render();
}

let META = null;
let RAW = null;

function slugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("p");
}

async function load() {
  const slug = slugFromURL();
  try {
    const res = await fetch("posts/posts.json", { cache: "no-store" });
    const posts = await res.json();
    META = posts.find((p) => p.slug === slug) || null;
    if (META) {
      const md = await fetch(`posts/${META.file}`, { cache: "no-store" });
      RAW = await md.text();
    }
  } catch (e) {
    META = null;
  }
  render();
}

function sectionFor(lang) {
  if (!RAW) return "";
  const enMark = RAW.indexOf("<!-- EN -->");
  const esMark = RAW.indexOf("<!-- ES -->");
  if (enMark === -1 && esMark === -1) return RAW; // single-language post
  if (lang === "es" && esMark !== -1) {
    return esMark > enMark
      ? RAW.slice(esMark + 11)
      : RAW.slice(esMark + 11, enMark === -1 ? undefined : enMark);
  }
  if (enMark !== -1) {
    return enMark > esMark
      ? RAW.slice(enMark + 11)
      : RAW.slice(enMark + 11, esMark === -1 ? undefined : esMark);
  }
  return RAW;
}

function render() {
  const lang = getLang();
  const ui = UI[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (ui[key]) el.innerHTML = ui[key];
  });

  const toggle = document.getElementById("langToggle");
  if (toggle) toggle.textContent = lang === "en" ? "ES" : "EN";
  document.getElementById("backLink").textContent = ui.back;

  const titleEl = document.getElementById("articleTitle");
  const dateEl = document.getElementById("articleDate");
  const tagsEl = document.getElementById("articleTags");
  const contentEl = document.getElementById("articleContent");

  if (!META) {
    titleEl.textContent = ui.not_found;
    contentEl.innerHTML = "";
    return;
  }

  const title = lang === "es" ? META.title_es : META.title_en;
  titleEl.textContent = title;
  document.title = `Stochast — ${title}`;
  dateEl.textContent = META.date;
  tagsEl.innerHTML = (META.tags || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  contentEl.innerHTML = marked.parse(sectionFor(lang));
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("langToggle");
  if (toggle) {
    toggle.addEventListener("click", () => setLang(getLang() === "en" ? "es" : "en"));
  }
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  load();
});
