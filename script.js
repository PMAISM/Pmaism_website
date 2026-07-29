const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");

// Replace this with your deployed Google Apps Script web app URL
//const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwO0qJDse5zy5gkaH0_SwOoVaoNpR_VQKjiaA1r3mymzyTOha2UrClXK3ruKNNEN5dxsA/exec';
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwCItnpg0nAAx6E4MDGK_8YIJA6E3r60WSmYZzcOxTDBmqGLpi6wkYybvT4aKM45ghPgg/exec";
//const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyn13ybIVbmmfiX6iNjlsJ37FJxLzPaWGqEAD9yWYSEaFQMcK_bT3xGcKAd2xerILnTYw/exec";

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function closeNav() {
  if (!nav || !navToggle || !header) return;
  document.body.classList.remove("nav-open");
  nav.classList.remove("is-open");
  header.classList.remove("nav-active");
  navToggle.setAttribute("aria-expanded", "false");
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (year) year.textContent = new Date().getFullYear();

if (navToggle && nav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    header.classList.toggle("nav-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (nav) {
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNav));
}

// FAQ accordion
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains("is-open");

    document.querySelectorAll(".faq-question").forEach(q => {
      q.classList.remove("is-open");
      q.setAttribute("aria-expanded", "false");
      if (q.nextElementSibling) q.nextElementSibling.classList.remove("is-open");
    });

    if (!isOpen) {
      btn.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      if (answer) answer.classList.add("is-open");
    }
  });
});

// Scroll reveal
if ("IntersectionObserver" in window) {
  const revealObs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));
}

// Query forms → Google Sheets via hidden iframe (no CORS issues)
(function () {
  const forms = document.querySelectorAll("[data-query-form]");
  if (!forms.length) return;

  // Single hidden iframe shared by all forms on the page
  const iframe = document.createElement("iframe");
  iframe.name = "query_target";
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = "display:none;width:0;height:0;border:0;position:absolute";
  document.body.appendChild(iframe);

  forms.forEach(form => {
    const note = form.querySelector("[data-form-note]");
    form.setAttribute("action", SHEETS_URL);
    form.setAttribute("method", "POST");
    form.setAttribute("target", "query_target");

    form.addEventListener("submit", () => {
      const btn = form.querySelector("[type='submit']");
      btn.disabled = true;
      btn.textContent = "Sending…";

      iframe.addEventListener("load", function onLoad() {
        iframe.removeEventListener("load", onLoad);
        form.reset();
        btn.textContent = "Query Sent ✓";
        if (note) note.textContent = "Thank you! We will get back to you shortly.";
        // Fire Google Ads conversion only after successful submission
        if (typeof gtag === "function") {
          gtag("event", "conversion", {
            send_to: "AW-18344588739/QhL7CJ_Y4tccEMPrsKtE",
            value: 1.0,
            currency: "INR"
          });
        }
      });
    });
  });
}());
