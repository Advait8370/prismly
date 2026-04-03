// =============================
// 🔥 FIREBASE CONFIG
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyB4DnVCaG56Lyzzq6Nu765UOONXpVGs9VA",
  authDomain: "pintrest-8370.firebaseapp.com",
  projectId: "pintrest-8370",
  storageBucket: "pintrest-8370.firebasestorage.app",
  messagingSenderId: "1050482929006",
  appId: "1:1050482929006:web:b7c95ee481f43140eca57f"
};

// =============================
// 🚀 INITIALIZE FIREBASE
// =============================
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let allPins = [];

// =============================
// 📱 TAB SWITCHING (SMOOTH)
// =============================
function switchTab(tab) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(tab);
  if (target) target.classList.add("active");
}

// =============================
// 🔐 LOGIN
// =============================
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(() => {
      console.log("Login success");
    })
    .catch(err => {
      console.error("Login error:", err);
      alert(err.message);
    });
}

// =============================
// 🚪 LOGOUT
// =============================
function logout() {
  auth.signOut();
}

// =============================
// 👤 AUTH STATE LISTENER
// =============================
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;

    document.getElementById("user").innerText =
      "Welcome " + user.displayName;

    loadPins(user.uid);
  } else {
    currentUser = null;
    document.getElementById("user").innerText =
      "Not logged in";

    document.getElementById("grid").innerHTML = "";
  }
});

// =============================
// 💾 SAVE PIN
// =============================
function savePin() {
  const input = document.getElementById("pinUrl");
  const url = input.value.trim();

  if (!currentUser) {
    alert("Login first!");
    return;
  }

  if (!url) {
    alert("Enter image URL");
    return;
  }

  db.collection("pins").add({
    uid: currentUser.uid,
    url: url,
    created: Date.now()
  })
  .then(() => {
    console.log("Pin saved");
    input.value = "";
  })
  .catch(err => {
    console.error("Save error:", err);
  });
}

// =============================
// 📥 LOAD PINS (REALTIME)
// =============================
function loadPins(uid) {
  db.collection("pins")
    .where("uid", "==", uid)
    .orderBy("created", "desc")
    .onSnapshot(snapshot => {

      allPins = [];
      let html = "";

      snapshot.forEach(doc => {
        const data = doc.data();
        allPins.push(data);

        html += `
          <img src="${data.url}" loading="lazy">
        `;
      });

      document.getElementById("grid").innerHTML = html;
    }, err => {
      console.error("Load error:", err);
    });
}

// =============================
// 🔍 SEARCH
// =============================
function searchPins() {
  const query = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  let html = "";

  allPins.forEach(pin => {
    if (pin.url.toLowerCase().includes(query)) {
      html += `<img src="${pin.url}" loading="lazy">`;
    }
  });

  document.getElementById("grid").innerHTML = html;
}

// =============================
// ⚡ OPTIONAL: AUTO SWITCH TO HOME AFTER SAVE
// =============================
function goHomeAfterSave() {
  switchTab("home");
}

// =============================
// 🧠 OPTIONAL: PREVENT IMAGE BREAK
// =============================
document.addEventListener("error", function(e) {
  if (e.target.tagName === "IMG") {
    e.target.style.display = "none";
  }
}, true);
