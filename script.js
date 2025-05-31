// iimport modul firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// konfig firebase
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

// inisialisasi firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Login anonim otomatis
signInAnonymously(auth)
    .then(() => {
        console.log("Berhasil login anonim");
    })
    .catch((err) => {
        console.error("Login gagal:", err);
    });

// Setelah login berhasil
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        const userChatRef = ref(db, 'messages/' + uid);

        // ambil dan tampilkan chat milik user ini
        onValue(userChatRef, (snapshot) => {
            const chatArea = document.getElementById('chatArea');
            chatArea.innerHTML = "";

            snapshot.forEach((child) => {
                const data = child.val();

                const chatBubble = document.createElement('div');
                chatBubble.innerText = `${data.name}: ${data.message}`;
                chatBubble.style.marginBottom = "10px";

                chatArea.appendChild(chatBubble);
            });

            chatArea.scrollTop = chatArea.scrollHeight;
        });
    }
});

// fungsi untuk kirim pesan
window.sendMessage = function () {
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');
    const chatArea = document.getElementById('chatArea');

    const username = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!username || !message) {
        alert('Nama dan pesan tidak boleh kosong!');
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert('Sedang login, tunggu sebentar...');
        return;
    }

    const uid = user.uid;
    const messageRef = push(ref(db, 'messages/' + uid));

    set(messageRef, {
        name: username,
        message: message,
        timestamp: Date.now()
    }).then(() => {
        messageInput.value = '';
    }).catch((err) => {
        console.error("Gagal kirim pesan:", err);
    });
}
