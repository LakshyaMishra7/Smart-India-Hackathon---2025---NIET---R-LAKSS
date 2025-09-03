// ============================
// Leaflet Map Initialization
// ============================
const map = L.map("mapid", {
  scrollWheelZoom: true,
  zoomControl: true,
}).setView([27.33, 88.61], 9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let tourSpots = [];
let polyline = null;

// ============================
// Notification Toast
// ============================
function showMessage(msg) {
  const box = document.getElementById("message-box");
  box.textContent = msg;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 3000);
}

// ============================
// Add Monument to Tour
// ============================
function addToTour(name, lat, lng) {
  const spot = { name, lat, lng };
  tourSpots.push(spot);
  L.marker([lat, lng]).addTo(map).bindPopup(`<b>${name}</b>`);
  showMessage(`✅ ${name} added to your tour`);
}

// ============================
// Distance Calculations
// ============================
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function recommendTransport(distanceKm) {
  if (distanceKm < 2) return "🚶 Walking";
  if (distanceKm < 10) return "🚌 Bus/Shared Cab";
  return "🚕 Private Cab/Taxi";
}

async function getRoadDistance(lat1, lon1, lat2, lon2) {
  const apiKey = "<YOUR_ORS_API_KEY>";
  try {
    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lon1},${lat1}&end=${lon2},${lat2}`
    );
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    return data.routes[0].summary.distance / 1000;
  } catch (e) {
    console.warn("⚠️ Fallback to Haversine:", e.message);
    return getDistance(lat1, lon1, lat2, lon2);
  }
}

async function showRoute() {
  if (tourSpots.length < 2) {
    showMessage("⚠️ Add at least 2 monuments to show a route.");
    return;
  }

  if (polyline) map.removeLayer(polyline);

  const latlngs = tourSpots.map(s => [s.lat, s.lng]);
  polyline = L.polyline(latlngs, { color: "#0077ff", weight: 4 }).addTo(map);
  map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

  let totalDistance = 0;
  for (let i = 0; i < tourSpots.length - 1; i++) {
    totalDistance += await getRoadDistance(
      tourSpots[i].lat,
      tourSpots[i].lng,
      tourSpots[i + 1].lat,
      tourSpots[i + 1].lng
    );
  }

  document.getElementById("transport").innerHTML = `
    <strong>Total Distance:</strong> ${totalDistance.toFixed(2)} km<br>
    <strong>Recommended:</strong> ${recommendTransport(totalDistance)}
  `;
}

function resetTour() {
  tourSpots = [];
  if (polyline) {
    map.removeLayer(polyline);
    polyline = null;
  }
  document.getElementById("transport").innerHTML = "";
  showMessage("🔄 Tour has been reset.");
}

// ============================
// Smooth Scroll + Scroll Spy
// ============================
document.querySelectorAll(".nav-center a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) window.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" });
  });
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-center li a");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      navLinks.forEach(link => {
        link.parentElement.classList.remove("active");
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.parentElement.classList.add("active");
        }
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => observer.observe(section));

// ============================
// Photo Sphere Viewer
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const panoElements = document.querySelectorAll(".pano");
  const modal = document.getElementById("viewer-modal");
  const container = document.getElementById("viewer-container");
  const closeBtn = document.getElementById("close-viewer");
  let viewer = null;

  panoElements.forEach(el => {
    el.addEventListener("click", () => {
      modal.style.display = "flex";
      if (viewer) viewer.destroy();
      viewer = new PhotoSphereViewer.Viewer({
        container,
        panorama: el.dataset.src,
        navbar: ["zoom", "fullscreen"],
        mousewheel: true,
        touchmoveTwoFingers: true,
        defaultYaw: "130deg",
        autorotateDelay: 400,
        autorotateSpeed: "1rpm",
      });
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    if (viewer) viewer.destroy();
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
      if (viewer) viewer.destroy();
    }
  });
});

// ============================
// Festival Calendar
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar-container");
  if (!calendarEl) return;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,listMonth"
    },
    events: [
      { title: "Losar Festival", start: "2025-02-26" },
      { title: "Saga Dawa", start: "2025-06-05" },
      { title: "Pang Lhabsol", start: "2025-09-01" },
      { title: "Bumchu Festival", start: "2025-03-10" },
    ]
  });
  calendar.render();
});
