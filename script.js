// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB4DnVCaG56Lyzzq6Nu765UOONXpVGs9VA",
  authDomain: "pintrest-8370.firebaseapp.com",
  projectId: "pintrest-8370",
  storageBucket: "pintrest-8370.firebasestorage.app",
  messagingSenderId: "1050482929006",
  appId: "1:1050482929006:web:b7c95ee481f43140eca57f"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let allPins = [];

// Tabs
function switchTab(tab) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

// Login
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

// Logout
function logout() {
  auth.signOut();
}

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("user").innerText = "Welcome " + user.displayName;
    loadPins(user.uid);
  } else {
    document.getElementById("user").innerText = "Not logged in";
  }
});

// Save Pin
function savePin() {
  const url = document.getElementById("pinUrl").value;
  const user = auth.currentUser;

  if (!user) {
    alert("Login first!");
    return;
  }

  db.collection("pins").add({
    uid: user.uid,
    url: url,
    created: Date.now()
  });

  document.getElementById("pinUrl").value = "";
}

// Load Pins
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

        html += `<img src="${data.url}">`;
      });

      document.getElementById("grid").innerHTML = html;
    });
}

// Search
function searchPins() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allPins.filter(p =>
    p.url.toLowerCase().includes(query)
  );

  let html = "";
  filtered.forEach(p => {
    html += `<img src="${p.url}">`;
  });

  document.getElementById("grid").innerHTML = html;
}
