// ================================
// MAP PAGE SCRIPT (WITH CHATBOT)
// ================================
let map = L.map("mapid").setView([27.33, 88.61], 9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let tourSpots = [];
let markers = [];
let routingControl = null;
let pathHistory = 0;
let narratorEnabled = true; // default ON

/* =========================
   NARRATOR FUNCTION
========================= */
function narrator(text) {
  if (!narratorEnabled) return;
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-IN";
  speech.pitch = 1;
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
}

/* =========================
   ADD MONUMENT TO TOUR
========================= */
function addToTour(name, lat, lng) {
  tourSpots.push([lat, lng]);
  const marker = L.marker([lat, lng]).addTo(map).bindPopup(name);
  markers.push(marker);
  narrator(`Added ${name} to your tour.`);
  showMessage(`Added ${name}`);
  refreshRoute();
}

/* =========================
   REMOVE LAST STOP
========================= */
function removeLastStop() {
  if (tourSpots.length > 0) {
    tourSpots.pop();
    const marker = markers.pop();
    if (marker) map.removeLayer(marker);
    narrator("Removed last stop from the tour.");
    showMessage("Removed last stop.");
    refreshRoute();
  } else {
    showMessage("No stops to remove.");
  }
}

/* =========================
   RESET TOUR
========================= */
function resetTour() {
  tourSpots = [];
  markers.forEach((m) => map.removeLayer(m));
  markers = [];
  if (routingControl) map.removeControl(routingControl);
  showMessage("Tour reset.");
  narrator("Tour has been reset.");
  document.getElementById("transport").innerHTML = "No route planned yet.";
}

/* =========================
   SHOW ROUTE
========================= */
function showRoute() {
  if (tourSpots.length < 2) {
    showMessage("Add at least 2 stops to calculate a route.");
    narrator("Please add at least two stops to calculate a route.");
    return;
  }

  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: tourSpots.map(([lat, lng]) => L.latLng(lat, lng)),
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null,
    lineOptions: { styles: [{ color: "#77DD77", weight: 5 }] },
  })
    .on("routesfound", function (e) {
      const route = e.routes[0];
      const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
      recommendTransport(distanceKm);
      pathHistory++;
      document.getElementById("history").innerText =
        `History: ${pathHistory} routes planned`;
      narrator(`Route calculated. Total distance is ${distanceKm} kilometers.`);
    })
    .addTo(map);
}

/* =========================
   REFRESH ROUTE
========================= */
function refreshRoute() {
  if (routingControl) map.removeControl(routingControl);
  if (tourSpots.length >= 2) showRoute();
}

/* =========================
   RECOMMEND TRANSPORT
========================= */
function recommendTransport(km) {
  let transport =
    km < 2
      ? "🚶 Walk (short route)"
      : km < 15
      ? "🚕 Local Taxi Recommended"
      : "🚌 Use Cab / Private Vehicle";

  document.getElementById("transport").innerHTML =
    `Distance: ${km} km<br>${transport}`;
  narrator(`The total route distance is ${km} kilometers. Suggested transport: ${transport}`);
}

/* =========================
   SIMPLE NOTIFICATION
========================= */
function showMessage(msg) {
  let transportBox = document.getElementById("transport");
  transportBox.innerHTML = `<b>${msg}</b>`;
  setTimeout(() => (transportBox.innerHTML = ""), 3000);
}

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

