document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     HERO TEXT FADE + SLIDE IN
  ---------------------------- */
  const heroText = document.querySelector(".hero-text");
  if (heroText) {
    heroText.style.opacity = 0;
    heroText.style.transform = "translateY(40px)";
    setTimeout(() => {
      heroText.style.transition = "opacity 1s ease-out, transform 1s ease-out";
      heroText.style.opacity = 1;
      heroText.style.transform = "translateY(0)";
    }, 300);
  }

  /* ---------------------------
     NAVBAR SCROLL EFFECT
  ---------------------------- */
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* ---------------------------
     CHATBOT OPEN / CLOSE
  ---------------------------- */
  const chatbotBtn = document.getElementById("chatbot-btn");
  const chatbotWindow = document.getElementById("chatbot-window");
  if (chatbotBtn && chatbotWindow) {
    chatbotBtn.addEventListener("click", () => {
      chatbotWindow.classList.toggle("open");
    });
  }

  /* ---------------------------
     CHATBOT MESSAGE HANDLING
  ---------------------------- */
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");

  /* ---------------------------
     NARRATOR SETUP
  ---------------------------- */
  const narratorBtn = document.getElementById("narrator-btn");
  let narratorOn = true;

  function speak(text) {
    if (!narratorOn) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    speechSynthesis.speak(utter);
  }

  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      narratorOn = !narratorOn;
      narratorBtn.innerHTML = narratorOn
        ? '<i class="fa-solid fa-volume-high"></i> Narrator: ON'
        : '<i class="fa-solid fa-volume-xmark"></i> Narrator: OFF';

      // Speak hero title when turned ON
      if (narratorOn && heroText) {
        speak(heroText.textContent);
      }
    });
  }

  function appendMessage(sender, text) {
    const p = document.createElement("p");
    p.innerHTML = `<b>${sender}:</b> ${text}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Narrator reads bot messages
    if (sender === "Bot") speak(text);
  }

  function botReply(userMessage) {
    let reply = "I'm still learning! Can you ask me about monasteries?";
    if (userMessage.toLowerCase().includes("hello")) reply = "Hi there! 👋";
    if (userMessage.toLowerCase().includes("monastery"))
      reply = "There are over 200 monasteries in Sikkim — want me to list some famous ones?";
    appendMessage("Bot", reply);
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const text = chatInput.value.trim();
      if (text) {
        appendMessage("You", text);
        chatInput.value = "";
        setTimeout(() => botReply(text), 500);
      }
    });
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });
  }

  /* ---------------------------
     CARD SLIDE-IN ON SCROLL
  ---------------------------- */
  const cards = document.querySelectorAll(".card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);

          // Narrator reads card title when visible
          if (narratorOn) {
            const title = entry.target.querySelector("h3");
            if (title) speak(title.textContent);
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => observer.observe(card));
});
