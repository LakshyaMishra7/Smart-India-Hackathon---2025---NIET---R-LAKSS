// Add in archive.js
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-image img');
  const scroll = window.scrollY;
  hero.style.transform = `translateY(${scroll * 0.3}px)`;
});

document.querySelectorAll('.archive-column').forEach(card => {
  const btn = document.createElement('button');
  btn.textContent = '🔊 Narrate';
  btn.className = 'card-narrate';
  card.appendChild(btn);

  btn.addEventListener('click', () => {
    const texts = Array.from(card.querySelectorAll('h2,h3,p,li')).map(el => el.textContent).join('. ');
    const utter = new SpeechSynthesisUtterance(texts);
    speechSynthesis.speak(utter);
  });
});

/* =========================
   NARRATOR TOGGLE BUTTON
========================= */
const narratorBtn = document.getElementById("narrator-btn");
if (narratorBtn) {
  narratorBtn.addEventListener("click", () => {
    narratorEnabled = !narratorEnabled;
    narratorBtn.textContent = narratorEnabled
      ? "🔊 Narrator: On"
      : "🔇 Narrator: Off";
    narrator(narratorEnabled ? "Narrator enabled." : "Narrator disabled.");
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

  // Narrator reads bot messages
  if (sender === "Bot") narrator(text);
}

function botReply(userMessage) {
  let reply = "I'm still learning! Can you ask me about monasteries or tours?";
  if (userMessage.toLowerCase().includes("hello")) reply = "Hi there! 👋";
  if (userMessage.toLowerCase().includes("monastery"))
    reply = "There are over 200 monasteries in Sikkim — want me to list some famous ones?";
  if (userMessage.toLowerCase().includes("route"))
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
