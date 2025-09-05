document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar-container');
  const narratorBtn = document.getElementById('narrator-btn');
  const listEl = document.getElementById('event-list');
  const legendContainer = document.querySelector('.legend-items');
  const chatbotBtn = document.getElementById("chatbot-btn");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");

  let narratorOn = true;

  /* =========================
     NARRATOR FUNCTION
  ========================== */
  function narrator(text) {
    if (!narratorOn) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.rate = 0.9;
    utter.pitch = 1.0;
    speechSynthesis.speak(utter);
  }

  /* =========================
     EVENTS DATA
  ========================== */
  const events = [
    { title: 'Losar Festival', start: '2025-02-27', description: 'Tibetan New Year celebrated with prayers, dances, and feasting.', type: 'Losar' },
    { title: 'Saga Dawa', start: '2025-06-15', description: 'Buddhist holy month celebrating the birth, enlightenment, and Nirvana of Buddha.', type: 'Buddhist' },
    { title: 'Pang Lhabsol', start: '2025-09-11', description: 'Honoring Mt. Kanchenjunga with masked dances and prayers for peace.', type: 'Local' },
    { title: 'Dasain (Durga Puja)', start: '2025-10-02', end: '2025-10-07', description: 'Major Hindu festival in Sikkim with goddess worship and community celebrations.', type: 'Dashain' }, 
    { title: 'Vijayadashami (Dashain Main Day)', start: '2025-10-06', description: 'The main day of Dashain marking the victory of good over evil.', type: 'Dashain' },
    { title: 'Tihar (Deepawali Festival)', start: '2025-10-20', end: '2025-10-25', description: 'Festival of lights, animal worship, and sibling bonds.', type: 'Tihar' },
    { title: 'Bhai Tika (Tihar Main Day)', start: '2025-10-24', description: 'Brothers and sisters celebrate their bond with rituals and blessings.', type: 'Tihar' }
  ];

  const typeColors = {
    'Losar': '#FF7F50',
    'Buddhist': '#8FBC8F',
    'Local': '#6495ED',
    'Dashain': '#FFD700',
    'Tihar': '#FF69B4'
  };

  /* =========================
     INIT FULLCALENDAR
  ========================== */
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: events.map(e => ({
      ...e,
      backgroundColor: typeColors[e.type] || '#46d1ba',
      borderColor: typeColors[e.type] || '#46d1ba',
      textColor: '#fff'
    })),
    eventClick: function(info) {
      narrator(`Festival: ${info.event.title}. ${info.event.extendedProps.description}`);
    },
    eventDidMount: function(info) {
      if (info.event.extendedProps.description) {
        info.el.setAttribute("title", info.event.extendedProps.description);
      }
    }
  });
  calendar.render();

  /* =========================
     UPCOMING EVENTS
  ========================== */
  function renderUpcomingEvents() {
    listEl.innerHTML = '';
    const today = new Date();
    const upcoming = events
      .filter(e => new Date(e.start) >= today)
      .sort((a,b) => new Date(a.start) - new Date(b.start));

    if (!upcoming.length) {
      listEl.innerHTML = "<li>No upcoming festivals 🎉</li>";
      return;
    }

    upcoming.forEach(e => {
      const date = new Date(e.start).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });
      const li = document.createElement('li');
      li.textContent = `${date}: ${e.title}`;
      li.style.borderLeft = `6px solid ${typeColors[e.type] || '#46d1ba'}`;
      li.style.paddingLeft = '10px';
      li.style.marginBottom = '8px';
      li.style.borderRadius = '8px';
      li.style.background = `${typeColors[e.type] || '#46d1ba'}20`;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        narrator(`${e.title} on ${date}. ${e.description}`);
      });
      listEl.appendChild(li);
    });
  }
  renderUpcomingEvents();

  /* =========================
     NARRATOR TOGGLE
  ========================== */
  if (narratorBtn) {
    narratorBtn.addEventListener('click', () => {
      narratorOn = !narratorOn;
      narratorBtn.textContent = narratorOn ? "🔊 Narrator: On" : "🔇 Narrator: Off";

      if (narratorOn) {
        // read all upcoming events when turned on
        const lis = listEl.querySelectorAll('li');
        lis.forEach(li => {
          narrator(li.textContent);
        });
      }
    });
  }

  /* =========================
     FESTIVAL LEGENDS
  ========================== */
  if (legendContainer) {
    legendContainer.innerHTML = '';
    for (const [type, color] of Object.entries(typeColors)) {
      const span = document.createElement('span');
      span.classList.add('legend-item');
      span.textContent = type;
      span.style.backgroundColor = color;
      span.style.color = '#fff';
      span.style.padding = '4px 10px';
      span.style.borderRadius = '12px';
      span.style.marginRight = '8px';
      span.style.fontSize = '13px';
      legendContainer.appendChild(span);
    }
  }

  /* =========================
     CHATBOT IMPLEMENTATION
  ========================== */
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

    if (sender === "Bot") narrator(text);
  }

  function botReply(userMessage) {
    let reply = "I'm still learning! Ask me about festivals or Sikkim.";
    if (userMessage.toLowerCase().includes("hello")) reply = "Hi there! 👋";
    if (userMessage.toLowerCase().includes("monastery"))
      reply = "There are over 200 monasteries in Sikkim — want me to list some famous ones?";
    if (userMessage.toLowerCase().includes("festival"))
      reply = "You can click on the events or upcoming list to hear details.";
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

  /* =========================
     SWIPER INIT
  ========================== */
  if (typeof Swiper !== 'undefined') {
    new Swiper(".swiper", {
      loop: true,
      autoplay: { delay: 3000 },
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
    });
  }
});
