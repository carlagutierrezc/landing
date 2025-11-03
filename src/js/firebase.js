import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, push, get, update, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveVote = (productID) => {
  const votesRef = ref(database, "votes");
  const newVoteRef = push(votesRef); // <-- corregido
  const now = new Date();
  const voteData = {
    productID,
    timestamp: now.toISOString(),
    date: now.toLocaleDateString("es-ES"),
    time: now.toLocaleTimeString("es-ES"),
  };
  return set(newVoteRef, voteData)
    .then(() => ({
      success: true,
      message: "Voto guardado exitosamente",
      voteId: newVoteRef.key,
    }))
    .catch((error) => ({
      success: false,
      message: `Error al guardar el voto: ${error.message}`,
    }));
};

const getVotes = async () => {
  try {
    const votesRef = ref(database, "votes");
    const snapshot = await get(votesRef);
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: true, data: {}, message: "No hay votos registrados" };
    }
  } catch (error) {
    return { success: false, message: `Error al obtener los votos: ${error.message}` };
  }
};

export { database, ref, set, push, get, update, remove, saveVote, getVotes };