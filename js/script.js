const WHATSAPP_NUMBER = "5541992628078";

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // Fade-in ao rolar
  const revealTargets = document.querySelectorAll(".fade-in, .chat-log");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible", "active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-answer").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // Links de WhatsApp com mensagem pronta
  document.querySelectorAll("[data-wa-message]").forEach((el) => {
    el.href = waLink(el.getAttribute("data-wa-message"));
    el.target = "_blank";
    el.rel = "noopener";
  });

  // Formulário -> WhatsApp
  const form = document.getElementById("lead-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const whats = form.whatsapp.value.trim();
      const solucoes = Array.from(
        form.querySelectorAll('input[name="solucao"]:checked')
      ).map((cb) => cb.value);

      if (!nome || !whats || solucoes.length === 0) {
        alert("Preencha nome, WhatsApp e selecione ao menos uma solução.");
        return;
      }

      const message =
        `Olá! Meu nome é ${nome}.\n` +
        `Meu WhatsApp: ${whats}\n` +
        `Tenho interesse em: ${solucoes.join(", ")}\n` +
        `Quero solicitar um diagnóstico gratuito.`;

      window.open(waLink(message), "_blank", "noopener");
    });
  }
});
