// ================================
// VIRTUAL-SCRIPT.JS
// ================================

// Narrator state
let narratorEnabled = false;

// Grab DOM elements
const narratorBtn = document.getElementById("narrator-btn");
const streetviewCards = document.querySelectorAll(".streetview");
const modelViewer = document.querySelector("model-viewer");

// ================================
// NARRATOR TOGGLE
// ================================
if (narratorBtn) {
  narratorBtn.addEventListener("click", () => {
    narratorEnabled = !narratorEnabled;
    narratorBtn.innerHTML = narratorEnabled
      ? "🔊 Narrator: On"
      : "🔇 Narrator: Off";

    // Play confirmation voice
    speak(
      narratorEnabled
        ? "Narrator has been enabled."
        : "Narrator has been disabled."
    );
  });
}

// Narration helper using Web Speech API
function speak(text) {
  if (!narratorEnabled || !window.speechSynthesis) return;
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-IN";
  speech.pitch = 1;
  speech.rate = 1;
  window.speechSynthesis.cancel(); // stop overlapping speech
  window.speechSynthesis.speak(speech);
}

// ================================
// CARD REVEAL ANIMATION
// (on scroll - fadeInUp from CSS)
// ================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.6s ease forwards";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

streetviewCards.forEach((card) => {
  card.style.opacity = "0";
  observer.observe(card);
});

// ================================
// MODEL VIEWER HOVER NARRATION
// ================================
if (modelViewer) {
  modelViewer.addEventListener("mouseenter", () => {
    speak("This is a 3D model of a Buddhist monastery.");
  });
}

// ================================
// AUTO NARRATE FIRST CARD
// ================================
window.addEventListener("load", () => {
  setTimeout(() => {
    if (narratorEnabled && streetviewCards[0]) {
      speak(
        "Welcome to Virtual Monastery Tours. Here is Pemayangtse Monastery in Google Street View."
      );
    }
  }, 800);
});
