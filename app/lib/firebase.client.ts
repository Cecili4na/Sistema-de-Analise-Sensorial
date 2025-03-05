import { initializeApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDdNnQFQ04Pcszsc9xZiq6qwyyrMszEt8Y",
  authDomain: "analise-b39de.firebaseapp.com",
  projectId: "analise-b39de",
  storageBucket: "analise-b39de.appspot.com",
  messagingSenderId: "685477663321",
  appId: "1:685477663321:web:3ba7ef37caecde6ab65748",
  measurementId: "G-EZGVH2QFHM"
};

let firebaseApp: FirebaseApp | undefined;

// Inicializar apenas no cliente
if (typeof window !== "undefined") {
  try {
    console.log("Tentando inicializar Firebase com config:", {
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId
    });
    firebaseApp = initializeApp(firebaseConfig);
    console.log("Firebase inicializado com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
    if (error instanceof Error) {
      console.error("Detalhes do erro:", error.message);
    }
  }
}

export { firebaseApp }; 