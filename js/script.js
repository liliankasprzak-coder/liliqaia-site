const WHATSAPP_NUMBER = "5541992628078";

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CHAT_SCRIPT = [
  { who: "in", tag: "Cliente", text: "Oi, vocês têm mesa pra hoje à noite?" },
  { who: "out", tag: "Lia", text: "Boa noite! 😊 Temos sim. Pra quantas pessoas seria a reserva?" },
  { who: "in", tag: "Cliente", text: "4 pessoas, 20h" },
  { who: "out", tag: "Lia", text: "Perfeito! Só me confirma o nome pra reserva, por favor 📝" },
  { who: "in", tag: "Cliente", text: "Pode ser em nome de Marina" },
  { who: "out", tag: "Lia", text: "Reserva confirmada para Marina, 4 pessoas às 20h ✅ Posso te enviar o cardápio?" },
  { who: "in", tag: "Cliente", text: "Sim, por favor!" },
  { who: "out", tag: "Lia", text: "Aqui está! 📎 cardapio-pizzaria.pdf — Qualquer dúvida, é só chamar!" },
];

function renderBubble(msg) {
  const div = document.createElement("div");
  div.className = `bubble ${msg.who}`;
  div.innerHTML = `<span class="tag">${msg.tag}</span>${msg.text}`;
  return div;
}

function renderTyping() {
  const div = document.createElement("div");
  div.className = "bubble out typing";
  div.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  return div;
}

function scrollToBottom(log) {
  log.scrollTop = log.scrollHeight;
}

async function playChatOnce(log) {
  log.innerHTML = "";
  for (const msg of CHAT_SCRIPT) {
    await wait(msg.who === "in" ? 700 : 350);
    if (msg.who === "out") {
      const typing = renderTyping();
      log.appendChild(typing);
      scrollToBottom(log);
      await wait(1100);
      typing.remove();
    }
    const bubble = renderBubble(msg);
    log.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add("show"));
    scrollToBottom(log);
    await wait(250);
  }
}

async function startChatLoop() {
  const log = document.getElementById("chat-log");
  if (!log) return;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await playChatOnce(log);
    await wait(2600);
  }
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
  const revealTargets = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));

  startChatLoop();

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
    const number = el.getAttribute("data-wa-number") || WHATSAPP_NUMBER;
    const message = el.getAttribute("data-wa-message");
    el.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    el.target = "_blank";
    el.rel = "noopener";
  });

  // Formulário -> WhatsApp
  const form = document.getElementById("lead-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const solucoes = Array.from(
        form.querySelectorAll('input[name="solucao"]:checked')
      ).map((cb) => cb.value);

      if (!nome || solucoes.length === 0) {
        alert("Preencha o nome e selecione ao menos uma solução.");
        return;
      }

      const message =
        `Olá! Meu nome é ${nome}.\n` +
        `Tenho interesse em: ${solucoes.join(", ")}\n` +
        `Quero solicitar um diagnóstico gratuito.`;

      window.open(waLink(message), "_blank", "noopener");
    });
  }
});
