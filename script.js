// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB4DnVCaG56Lyzzq6Nu765UOONXpVGs9VA",
  authDomain: "pintrest-8370.firebaseapp.com",
  projectId: "pintrest-8370"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let allPins = [];

// =============================
// THEME SYSTEM
// =============================
(function () {
  const saved = localStorage.getItem("theme");

  if (saved) {
    document.body.classList.toggle("light", saved === "light");
  } else {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    document.body.classList.toggle("light", prefersLight);
  }
})();

function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// =============================
// NAVIGATION
// =============================
function switchTab(tab) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

// =============================
// AUTH
// =============================
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

auth.getRedirectResult();

function logout() {
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("user").innerText = "Welcome " + user.displayName;
    loadPins(user.uid);
  } else {
    document.getElementById("user").innerText = "Not logged in";
  }
});

// =============================
// SAVE PIN
// =============================
function savePin() {
  const url = document.getElementById("pinUrl").value;

  if (!currentUser) return alert("Login first!");

  db.collection("pins").add({
    uid: currentUser.uid,
    url,
    created: Date.now()
  });

  document.getElementById("pinUrl").value = "";
}

// =============================
// LOAD PINS
// =============================
function loadPins(uid) {
  db.collection("pins")
    .where("uid", "==", uid)
    .get()
    .then(snapshot => {
      allPins = [];
      let html = "";

      snapshot.forEach(doc => {
        const data = doc.data();
        allPins.push(data);
        html += `<img src="${data.url}">`;
      });

      document.getElementById("grid").innerHTML = html;
    });
}

// =============================
// SEARCH
// =============================
function searchPins() {
  const q = document.getElementById("searchInput").value.toLowerCase();

  let html = "";
  allPins.forEach(p => {
    if (p.url.toLowerCase().includes(q)) {
      html += `<img src="${p.url}">`;
    }
  });

  document.getElementById("grid").innerHTML = html;
}
