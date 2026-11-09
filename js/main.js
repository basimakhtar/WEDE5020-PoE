// VoltStream site behaviour - Part 3.
// All features are plain modern JavaScript. jQuery was deliberately
// skipped: the site is small, and native APIs keep the page lighter
// and faster, which helps the page-speed part of the SEO work.

// Small helpers -------------------------------------------------

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function makeErrorField(control, text) {
  // every invalid field gets a small red note directly under it
  // (checkboxes sit inside their label, so the note goes after the label)
  const anchor = control.type === "checkbox" ? control.closest("label") : control;
  let note = anchor.nextElementSibling;
  if (!note || !note.classList.contains("field-error")) {
    note = document.createElement("small");
    note.className = "field-error";
    anchor.insertAdjacentElement("afterend", note);
  }
  note.textContent = text;
  control.setAttribute("aria-invalid", "true");
}

function clearError(control) {
  const anchor = control.type === "checkbox" ? control.closest("label") : control;
  const note = anchor.nextElementSibling;
  if (note && note.classList.contains("field-error")) note.remove();
  control.removeAttribute("aria-invalid");
}

// Shared page-wide features ------------------------------------

function initHeaderShadow() {
  const header = $("header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initRevealOnScroll() {
  // sections fade up as they scroll into view
  const sections = $$("main > section");
  if (!sections.length) return;
  sections.forEach((s) => s.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) {
    sections.forEach((s) => s.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  sections.forEach((s) => io.observe(s));
}

function initBackToTop() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "to-top";
  btn.innerHTML = "&#8593; Back to top";
  btn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(btn);
  const toggle = () => btn.classList.toggle("show", window.scrollY > 600);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initFooterYear() {
  $$("body > footer > p").forEach((p) => {
    p.textContent = p.textContent.replace("2026", new Date().getFullYear());
  });
}

// Home page: gallery, filters and lightbox ----------------------

function initGallery() {
  const grid = $("#gallery-grid");
  if (!grid) return;

  const render = (filter) => {
    grid.innerHTML = "";
    recentWork
      .filter((item) => filter === "all" || item.category === filter)
      .forEach((item, index) => {
        const fig = document.createElement("figure");
        fig.className = "gallery-item";
        fig.dataset.index = index;
        const img = document.createElement("img");
        img.src = item.thumb;
        img.alt = item.alt;
        img.width = 480;
        img.height = 320;
        img.loading = "lazy";
        const cap = document.createElement("figcaption");
        cap.textContent = item.caption;
        fig.append(img, cap);
        fig.addEventListener("click", () => openLightbox(filter, index));
        grid.appendChild(fig);
      });
  };

  // filter buttons
  const bar = $(".filter-bar");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    $$("button", bar).forEach((b) => b.classList.toggle("active", b === btn));
    render(btn.dataset.filter);
  });

  // lightbox with prev/next and keyboard control
  const box = $("#lightbox");
  const boxImg = $("#lightbox img");
  const boxCap = $("#lightbox figcaption");
  let openFilter = "all";
  let current = 0;

  function listFor(filter) {
    return recentWork.filter((i) => filter === "all" || i.category === filter);
  }

  function openLightbox(filter, index) {
    const list = listFor(filter);
    openFilter = filter;
    current = Math.min(index, list.length - 1);
    show(list[current]);
    box.hidden = false;
    document.body.classList.add("no-scroll");
    $("#lightbox-close").focus();
  }

  function show(item) {
    boxImg.src = item.src;
    boxImg.alt = item.alt;
    boxCap.textContent = item.caption;
  }

  function step(dir) {
    const list = listFor(openFilter);
    current = (current + dir + list.length) % list.length;
    show(list[current]);
  }

  $("#lightbox-close").addEventListener("click", closeBox);
  $("#lightbox-prev").addEventListener("click", () => step(-1));
  $("#lightbox-next").addEventListener("click", () => step(1));
  box.addEventListener("click", (e) => {
    if (e.target === box) closeBox();
  });

  function closeBox() {
    box.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") closeBox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  render("all");
}

function initTestimonials() {
  const list = $("#testimonial-list");
  if (!list) return;
  testimonials.forEach((t) => {
    const q = document.createElement("blockquote");
    const p = document.createElement("p");
    p.textContent = t.quote;
    const foot = document.createElement("footer");
    foot.textContent = "- " + t.name + ", " + t.area;
    q.append(p, foot);
    list.appendChild(q);
  });
}

// About page: tabs and team modals ------------------------------

function initTabs() {
  const tabs = $(".tabs");
  if (!tabs) return;
  const buttons = $$('[role="tab"]', tabs);
  const panels = $$('[role="tabpanel"]', tabs);

  function select(index) {
    buttons.forEach((b, i) => {
      const on = i === index;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, i) => {
      p.hidden = i !== index;
    });
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => select(i));
    btn.addEventListener("keydown", (e) => {
      // arrow keys move between tabs
      if (e.key === "ArrowRight") {
        e.preventDefault();
        select((i + 1) % buttons.length);
        buttons[(i + 1) % buttons.length].focus();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (i - 1 + buttons.length) % buttons.length;
        select(prev);
        buttons[prev].focus();
      }
    });
  });

  select(0);
}

function initTeamModals() {
  const cards = $$("[data-bio]");
  if (!cards.length) return;
  const modal = $("#bio-modal");
  const nameEl = $("#bio-name");
  const roleEl = $("#bio-role");
  const bioEl = $("#bio-text");
  const detailEl = $("#bio-detail");
  const closeBtn = $("#bio-close");

  function open(key) {
    const info = teamBios[key];
    if (!info) return;
    nameEl.textContent = info.name;
    roleEl.textContent = info.role;
    bioEl.textContent = info.bio;
    detailEl.textContent = info.detail;
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  cards.forEach((card) => card.addEventListener("click", () => open(card.dataset.bio)));
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") close();
  });
}

// Services page: search filter and FAQ accordion ----------------

function initServiceSearch() {
  const input = $("#service-search");
  if (!input) return;
  const items = $$(".service-items li");
  const groups = $$(".service-group");
  const emptyNote = $("#no-results");

  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach((li) => {
      const match = li.textContent.toLowerCase().includes(term);
      li.hidden = !match;
      if (match) visible++;
    });
    groups.forEach((g) => {
      const anyVisible = $$("li", g).some((li) => !li.hidden);
      g.hidden = !anyVisible;
    });
    emptyNote.hidden = visible !== 0;
  });
}

function initAccordion() {
  const list = $(".faq-list");
  if (!list) return;

  // the questions are rendered from js/data.js, then behave as an
  // accordion: opening one question closes the others
  faqs.forEach((item) => {
    const wrap = document.createElement("div");
    wrap.className = "faq";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "faq-q";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = item.question;

    const panel = document.createElement("div");
    panel.className = "faq-a";
    panel.hidden = true;
    const p = document.createElement("p");
    p.textContent = item.answer;
    panel.appendChild(p);

    wrap.append(btn, panel);
    list.appendChild(wrap);
  });

  const buttons = $$(".faq-q", list);
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      buttons.forEach((b) => b.setAttribute("aria-expanded", "false"));
      $$(".faq-a", list).forEach((a) => (a.hidden = true));
      if (!open) {
        btn.setAttribute("aria-expanded", "true");
        btn.nextElementSibling.hidden = false;
      }
    });
  });
}

// Contact page: Leaflet maps and the message form ---------------

function initMaps() {
  const sandton = $("#map-sandton");
  const randburg = $("#map-randburg");
  if (!sandton || !randburg || typeof L === "undefined") return;

  const tiles = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const credit =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function makeMap(el, coords, title, address) {
    const map = L.map(el).setView(coords, 14);
    L.tileLayer(tiles, { attribution: credit }).addTo(map);
    L.marker(coords)
      .addTo(map)
      .bindPopup("<strong>" + title + "</strong><br>" + address)
      .openPopup();
  }

  makeMap(sandton, [-26.0961, 28.0568], "Head Office - Sandton", "Unit 4, 12 Rivonia Road");
  makeMap(randburg, [-26.0997, 28.0025], "Branch - Randburg", "88 Jan Smuts Avenue");
}

const CONTACT_EMAIL = "info@voltstream.co.za"; // the recipient stated in the code

function initContactForm() {
  const form = $("#contact-form");
  if (!form) return;
  const note = $("#contact-note");

  const fields = {
    name: $("#contact-name"),
    email: $("#contact-email"),
    phone: $("#contact-phone"),
    type: $("#contact-type"),
    message: $("#contact-message")
  };

  function valid() {
    let ok = true;

    const name = fields.name.value.trim();
    if (name.length < 2 || !/^[A-Za-z .'-]+$/.test(name)) {
      makeErrorField(fields.name, "Please enter your first and last name (letters only).");
      ok = false;
    } else clearError(fields.name);

    const email = fields.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      makeErrorField(fields.email, "That email address does not look right.");
      ok = false;
    } else clearError(fields.email);

    const phone = fields.phone.value.replace(/[\s\-()]/g, "");
    if (!/^(0\d{9}|\+27\d{9})$/.test(phone)) {
      makeErrorField(fields.phone, "Use a South African number, like 082 555 0147.");
      ok = false;
    } else clearError(fields.phone);

    if (!fields.type.value) {
      makeErrorField(fields.type, "Please choose what your message is about.");
      ok = false;
    } else clearError(fields.type);

    const message = fields.message.value.trim();
    if (message.length < 10) {
      makeErrorField(fields.message, "Please write a little more detail (at least 10 characters).");
      ok = false;
    } else clearError(fields.message);

    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valid()) return;

    // the message is compiled into an email and handed to the user's
    // mail app, addressed to the recipient above
    const subject = "Website message (" + fields.type.value + ") - " + fields.name.value.trim();
    const body =
      "Name: " + fields.name.value.trim() + "\n" +
      "Email: " + fields.email.value.trim() + "\n" +
      "Phone: " + fields.phone.value.trim() + "\n" +
      "Type: " + fields.type.value + "\n\n" +
      fields.message.value.trim();

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    note.hidden = false;
  });
}

// Enquiry page: validation and the AJAX quote response ----------

function initEnquiryForm() {
  const form = $("#enquiry-form");
  if (!form) return;
  const result = $("#quote-result");
  const button = $('button[type="submit"]', form);

  const fields = {
    name: $("#full-name"),
    email: $("#email"),
    phone: $("#phone"),
    type: $("#service-type"),
    area: $("#area"),
    date: $("#preferred-date"),
    message: $("#message"),
    consent: $("#consent")
  };

  function valid() {
    let ok = true;

    const name = fields.name.value.trim();
    if (name.length < 2 || !/^[A-Za-z .'-]+$/.test(name)) {
      makeErrorField(fields.name, "Please enter your full name.");
      ok = false;
    } else clearError(fields.name);

    const email = fields.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      makeErrorField(fields.email, "Please check the email address.");
      ok = false;
    } else clearError(fields.email);

    const phone = fields.phone.value.replace(/[\s\-()]/g, "");
    if (!/^(0\d{9}|\+27\d{9})$/.test(phone)) {
      makeErrorField(fields.phone, "Use a South African number, like 082 555 0147.");
      ok = false;
    } else clearError(fields.phone);

    if (!fields.type.value) {
      makeErrorField(fields.type, "Choose the closest service type.");
      ok = false;
    } else clearError(fields.type);

    if (fields.date.value) {
      const chosen = new Date(fields.date.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) {
        makeErrorField(fields.date, "That date is in the past - pick today or later.");
        ok = false;
      } else clearError(fields.date);
    }

    const message = fields.message.value.trim();
    if (message.length < 20) {
      makeErrorField(fields.message, "A little more detail helps us quote accurately (at least 20 characters).");
      ok = false;
    } else clearError(fields.message);

    if (!fields.consent.checked) {
      makeErrorField(fields.consent, "We need your consent to contact you about this enquiry.");
      ok = false;
    } else clearError(fields.consent);

    return ok;
  }

  function showResult(data, area) {
    const info = data.services[fields.type.value] || data.services.other;
    $("#result-name").textContent = fields.name.value.trim();
    $("#result-service").textContent = info.label;
    $("#result-estimate").textContent = info.estimate;
    $("#result-lead").textContent = info.lead;
    $("#result-area").textContent = area || "your area";
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!valid()) return;

    button.disabled = true;
    button.textContent = "Working...";

    // AJAX: the pricing data is fetched asynchronously instead of
    // reloading the page, then the response is built from the result
    try {
      const res = await fetch("js/quotes.json");
      const data = await res.json();
      showResult(data, fields.area.value.trim());
    } catch (err) {
      // the response still appears if the data file cannot be loaded
      showResult({ services: { other: { label: "your request", estimate: "confirmed by phone", lead: "within 15 minutes" } } }, fields.area.value.trim());
    }

    button.disabled = false;
    button.textContent = "Send Enquiry";
    form.reset();
  });
}

// Boot ----------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initHeaderShadow();
  initRevealOnScroll();
  initBackToTop();
  initFooterYear();
  initGallery();
  initTestimonials();
  initTabs();
  initTeamModals();
  initServiceSearch();
  initAccordion();
  initMaps();
  initContactForm();
  initEnquiryForm();
});
