import { initializeApp } from "https://www.gstatic.com/firebasejs/x.y.z/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/x.y.z/firebase-database.js";

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
    const votesRef = ref(database, 'votes');
    const userVoteRef = push(votesRef);
    const voteData = {
    productID: productID,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('es-ES'),
    time: new Date().toLocaleTimeString('es-ES')
    };
    return set(newVoteRef, voteData)
    .then(() => {
        return {
            success: true,
            message: 'Voto guardado exitosamente',
            voteId: newVoteRef.key
        };
    })
    .catch((error) => {
      console.error('Error guardando voto:', error);
      return {
        success: false,
        message: `Error al guardar el voto: ${error.message}`
      };
    });
}

/**
 * Obtiene todos los votos de la base de datos
 * @returns {Promise<{success: boolean, data: Object|string}>} - Resultado con los datos o mensaje de error
 */

const getVotes = async () => {
  try {
    const votesRef = ref(database, 'votes');
    const snapshot = await get(votesRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: true,
        data: {},
        message: 'No hay votos registrados'
      };
    }
  } catch (error) {
    console.error('Error obteniendo votos:', error);
    return {
      success: false,
      message: `Error al obtener los votos: ${error.message}`
    };
  }
};

export { database, ref, set, push, get, child,update,remove,saveVote,getVotes };