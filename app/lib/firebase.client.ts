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

// Verificar se estamos em ambiente de build
const isBuild = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "production";

// Inicializar apenas no cliente e não durante o build
if (typeof window !== "undefined" && !isBuild) {
  try {
    if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
      console.log("Tentando inicializar Firebase com config:", {
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId
      });
    }
    firebaseApp = initializeApp(firebaseConfig);
    if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
      console.log("Firebase inicializado com sucesso");
    }
    
    // Verificar se o app foi inicializado corretamente
    if (firebaseApp) {
      if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
        console.log("Firebase App está disponível");
      }
    } else {
      if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
        console.error("Firebase App não foi inicializado corretamente");
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
      console.error("Erro ao inicializar Firebase:", error);
      if (error instanceof Error) {
        console.error("Detalhes do erro:", error.message);
        console.error("Stack trace:", error.stack);
      }
    }
  }
} else {
  if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
    console.log("Firebase não será inicializado no servidor ou durante o build");
  }
}

export { firebaseApp }; 