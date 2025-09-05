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
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  /* ---------------------------
     SMOOTH SCROLL ON NAVBAR
  ---------------------------- */
  const navLinks = document.querySelectorAll(".navbar a[href^='#'], .navbar a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetHref = link.getAttribute("href");
      if (targetHref.startsWith("#")) {
        e.preventDefault();
        const targetEl = document.getElementById(targetHref.substring(1));
        if (targetEl) {
          window.scrollTo({
            top: targetEl.offsetTop - 70,
            behavior: "smooth",
          });
        }
      }

      /* =========================
         FEATURES NAVBAR CLICK
      ========================== */
      if (targetHref.includes("features") && narratorOn) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        // Speak custom intro message
        speak("Hey there, these are the features which we have listed down below", () => {
          // After intro, read card titles one-by-one
          const cards = document.querySelectorAll("#features .card h3");
          readCardsSequentially(cards, 0);
        });
      }
    });
  });

  /* ---------------------------
     CHATBOT OPEN/CLOSE
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

  const appendMessage = (sender, text) => {
    if (!chatMessages) return;
    const p = document.createElement("p");
    p.innerHTML = `<b>${sender}:</b> ${text}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === "Bot" && narratorOn) speak(text);
  };

  const botReply = (msg) => {
    let reply = "I'm still learning! Can you ask me about monasteries?";
    const text = msg.toLowerCase();
    if (text.includes("hello")) reply = "Hi there! 👋";
    if (text.includes("monastery"))
      reply = "There are over 200 monasteries in Sikkim — want me to list some famous ones?";
    appendMessage("Bot", reply);
  };

  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", () => {
      const text = chatInput.value.trim();
      if (!text) return;
      appendMessage("You", text);
      chatInput.value = "";
      setTimeout(() => botReply(text), 500);
    });

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });
  }

  /* ---------------------------
     NARRATOR SETUP
  ---------------------------- */
  const narratorBtn = document.getElementById("narrator-btn");
  let narratorOn = true;

  // Generic speak function with callback
  function speak(text, callback) {
    if (!narratorOn) return;
    window.speechSynthesis.cancel(); // stop previous speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.onend = () => {
      if (callback) callback();
    };
    speechSynthesis.speak(utter);
  }



  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      narratorOn = !narratorOn;
      // Stop any ongoing speech immediately
      window.speechSynthesis.cancel();
      narratorBtn.innerHTML = narratorOn
        ? '<i class="fa-solid fa-volume-high"></i> Narrator: ON'
        : '<i class="fa-solid fa-volume-xmark"></i> Narrator: OFF';
    });
  }

  /* ---------------------------
     CARD SLIDE-IN ON SCROLL
  ---------------------------- */
  const cards = document.querySelectorAll(".card");
  if (cards.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);

          const title = entry.target.querySelector("h3");
          if (title && narratorOn) speak(title.textContent);
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
  }
});
