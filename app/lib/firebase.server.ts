import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

// Inicializar um objeto vazio para o caso de falha
let adminApp = {};

function getAdminApp() {
  // Durante o build, retornar um objeto vazio
  if (process.env.NODE_ENV === "production" && !projectId) {
    return {};
  }

  try {
    const apps = getApps();
    
    if (apps.length > 0) {
      return getApp();
    }

    // Só inicializar o app se tivermos todas as credenciais
    if (!projectId || !clientEmail || !privateKey) {
      console.error("Credenciais do Firebase Admin ausentes");
      return {};
    }

    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      })
    });

    return app;
  } catch (error) {
    console.error("Erro ao inicializar Firebase Admin:", error);
    return {};
  }
}

// Inicializar o app apenas se não estivermos em build de produção
if (process.env.NODE_ENV !== "production" || (process.env.NODE_ENV === "production" && projectId)) {
  adminApp = getAdminApp();
}

export { adminApp, getAdminApp as getFirebaseAdmin }; 