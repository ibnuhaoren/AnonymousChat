// Import firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBnpCjrKuGcAkuIuza189PtiOr5c7KnTwM",
  authDomain: "anonymous-chat-ibnu.firebaseapp.com",
  databaseURL: "https://anonymous-chat-ibnu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anonymous-chat-ibnu",
  storageBucket: "anonymous-chat-ibnu.appspot.com",
  messagingSenderId: "1002473606963",
  appId: "1:1002473606963:web:593f2eef1e6d2476e0f846",
  measurementId: "G-VBQF8NKPJB"
};

// Init firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM
const chatArea = document.getElementById('chatArea');

window.sendMessage = function () {
  const Username = document.getElementById('nameInput').value.trim();
  const message = document.getElementById('messageInput').value.trim();
  
  if (!Username || !message) {
    alert('Nama dan pesan jangan dikosongin!');
    return;
  }

  // kirim ke firebase
  push(ref(db, 'chats'), {
    name: Username,
    message: message,
    time: Date.now()
  });

  document.getElementById('messageInput').value = "";
};

// cler chat
import { remove, ref as dbRef } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// ...existing code...

window.clearchat = function() {
  // Hapus chat di tampilan
  chatArea.innerHTML = "";
  // Hapus chat di localStorage
  localStorage.removeItem("chatHistory");
  // Hapus chat di Firebase
  remove(dbRef(db, 'chats'));
}

function clearChat() {
  const pass = document.getElementById("adminPassword").value;
  if (pass !== "haoren1186") {
    alert("Awokawok salah ya.");
    return;
  }

  // Hapus data di Firebase
  firebase.database().ref("messages").remove()
    .then(() => {
      alert("Semua chat sudah dihapus.");
      document.getElementById("chatArea").innerHTML = "";
    })
    .catch((error) => {
      alert("yee gabisa dihapus ya: " + error.message);
    });
}

// ambil data realtime dari firebase
const chatRef = ref(db, 'chats');
onValue(chatRef, snapshot => {
  chatArea.innerHTML = "";
  const data = snapshot.val();

  for (let key in data) {
    const chat = data[key];
    const chatBubble = document.createElement("div");
    chatBubble.innerText = `${chat.name}: ${chat.message}`;
    chatBubble.style.marginBottom = "10px";
    chatArea.appendChild(chatBubble);
  }

  chatArea.scrollTop = chatArea.scrollHeight;
  // 🔔 Play notification sound
  const sound = document.getElementById("notifSound");
  sound.play().catch(() => {}); // buat mencegah error kalau user belum klik halaman
});
