const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");

// Replace this with your deployed Google Apps Script web app URL
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwO0qJDse5zy5gkaH0_SwOoVaoNpR_VQKjiaA1r3mymzyTOha2UrClXK3ruKNNEN5dxsA/exec';

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

// Query forms → Google Sheets
document.querySelectorAll("[data-query-form]").forEach(form => {
  const note = form.querySelector("[data-form-note]");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const btn = form.querySelector("[type='submit']");
    const fd = new FormData(form);
    const payload = {
      name:     (fd.get("name")    || "").trim(),
      phone:    (fd.get("phone")   || "").trim(),
      email:    (fd.get("email")   || "").trim(),
      interest:  fd.get("interest") || "",
      message:  (fd.get("message") || "").trim(),
    };
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      const params = new URLSearchParams(payload);
      await fetch(SHEETS_URL, {
        method: "POST",
        body: params,
        mode: "no-cors",
      });
      form.reset();
      btn.textContent = "Query Sent ✓";
      if (note) note.textContent = "Thank you! We will get back to you shortly.";
    } catch {
      btn.disabled = false;
      btn.textContent = "Send Query";
      if (note) note.textContent = "Something went wrong. Please try WhatsApp or email directly.";
    }
  });
});
