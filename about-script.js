document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     NAVBAR SMOOTH SCROLL
  ---------------------------- */
  document.querySelectorAll(".nav-center a").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");

      // Only intercept if it is a hash link (e.g., #section-id)
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
      // Otherwise, let browser follow link normally (for other pages)
    });
  });

  /* ---------------------------
     MODAL FUNCTIONALITY
  ---------------------------- */
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  if (modal && modalContent) {
    document.querySelectorAll(".archive-column").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".card-narrate")) return;
        const description = card.querySelector(".description");
        if (description) {
          modalContent.innerHTML = description.innerHTML;
          modal.classList.add("open");
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", () => modal.classList.remove("open"));
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  /* ---------------------------
     NARRATOR SETUP
  ---------------------------- */
  const narratorBtn = document.getElementById("narrator-btn");
  let narratorOn = true;

  function speak(text, callback) {
    if (!narratorOn) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.onend = () => { if (callback) callback(); };
    window.speechSynthesis.speak(utter);
  }

  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      narratorOn = !narratorOn;
      window.speechSynthesis.cancel();
      narratorBtn.innerHTML = narratorOn
        ? '<i class="fa-solid fa-volume-high"></i> Narrator: ON'
        : '<i class="fa-solid fa-volume-xmark"></i> Narrator: OFF';
    });
  }

  /* ---------------------------
     CHATBOT IMPLEMENTATION
  ---------------------------- */
  const chatbotBtn = document.getElementById("chatbot-btn");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");

  if (chatbotBtn && chatbotWindow) {
    chatbotBtn.addEventListener("click", () => {
      chatbotWindow.classList.toggle("open");
    });
  }

  function appendMessage(sender, text) {
    if (!chatMessages) return;
    const p = document.createElement("p");
    p.innerHTML = `<b>${sender}:</b> ${text}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === "Bot") speak(text);
  }

  function botReply(userMessage) {
    let reply = "I'm still learning! Can you ask me about monasteries or tours?";
    const msg = userMessage.toLowerCase();

    if (msg.includes("hello")) reply = "Hi there! 👋";
    else if (msg.includes("monastery"))
      reply = "There are over 200 monasteries in Sikkim — want me to list some famous ones?";
    else if (msg.includes("route"))
      reply = "You can plan your tour by adding stops on the map. I can guide you!";

    appendMessage("Bot", reply);
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", () => {
      const text = chatInput.value.trim();
      if (text) {
        appendMessage("You", text);
        chatInput.value = "";
        setTimeout(() => botReply(text), 500);
      }
    });

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });
  }
});
