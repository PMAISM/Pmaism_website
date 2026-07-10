const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

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

// Contact form → mailto
if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = (data.get("name") || "").trim();
    const email = (data.get("email") || "").trim();
    const profile = (data.get("profile") || "").trim();
    const interest = data.get("interest") || "";
    const message = (data.get("message") || "").trim();

    const subject = encodeURIComponent(`Consultation request from ${name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        profile ? `Profile: ${profile}` : null,
        interest ? `Area of interest: ${interest}` : null,
        "",
        "Requirement:",
        message,
      ].filter(Boolean).join("\n")
    );

    window.location.href = `mailto:contact@additsol.com?subject=${subject}&body=${body}`;
    if (formNote) {
      formNote.textContent = "Your email app should open with the consultation request ready to send.";
    }
  });
}
