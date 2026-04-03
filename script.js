// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB4DnVCaG56Lyzzq6Nu765UOONXpVGs9VA",
  authDomain: "pintrest-8370.firebaseapp.com",
  projectId: "pintrest-8370"
};

// INIT
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// LOGIN
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

// LOGOUT
function logout() {
  auth.signOut();
}

// AUTH STATE
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("user").innerText = "Welcome " + user.displayName;
    loadPins(user.uid);
  }
});

// SAVE PIN
function savePin() {
  const url = document.getElementById("pinUrl").value;
  const user = auth.currentUser;

  if (!user) {
    alert("Login first!");
    return;
  }

  db.collection("pins").add({
    uid: user.uid,
    url: url
  });
}

// LOAD PINS
function loadPins(uid) {
  db.collection("pins")
    .where("uid", "==", uid)
    .onSnapshot(snapshot => {
      let html = "";
      snapshot.forEach(doc => {
        html += `<img src="${doc.data().url}">`;
      });
      document.getElementById("grid").innerHTML = html;
    });
}
