/* =========================
   CARD TOGGLE HANDLING
========================= */
document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("open");
    btn.textContent = content.classList.contains("open")
      ? "Hide Details"
      : "View Details";
  });
});

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
    window.speechSynthesis.cancel(); // stop any ongoing speech
    narratorBtn.innerHTML = narratorOn
      ? '<i class="fa-solid fa-volume-high"></i> Narrator: ON'
      : '<i class="fa-solid fa-volume-xmark"></i> Narrator: OFF';
  });
}

/* =========================
   CHATBOT IMPLEMENTATION
========================= */
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
  const p = document.createElement("p");
  p.innerHTML = `<b>${sender}:</b> ${text}`;
  chatMessages.appendChild(p);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Only speak bot replies
  if (sender === "Bot") speak(text);
}

function botReply(userMessage) {
  let reply = "I'm still learning! Can you ask me about monasteries or tours?";
  const msg = userMessage.toLowerCase();

  if (msg.includes("hello")) reply = "Hi there! 👋";
  if (msg.includes("monastery"))
    reply = "There are over 200 monasteries in Sikkim — want me to list some famous ones?";
  if (msg.includes("route"))
    reply = "You can plan your tour by adding stops on the map. I can guide you!";

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
