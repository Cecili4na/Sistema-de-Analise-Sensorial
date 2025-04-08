import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

let adminApp = null;

function getAdminApp() {
  try {
    // Se já existe uma instância, retorna ela
    if (adminApp) {
      return adminApp;
    }

    // Verifica se já existe um app inicializado
    const apps = getApps();
    if (apps.length > 0) {
      adminApp = getApp();
      return adminApp;
    }

    // Verifica se todas as credenciais estão presentes
    if (!projectId || !clientEmail || !privateKey) {
      console.error("Credenciais do Firebase Admin ausentes:", {
        projectId: !!projectId,
        clientEmail: !!clientEmail,
        privateKey: !!privateKey
      });
      throw new Error("Credenciais do Firebase Admin ausentes");
    }

    // Inicializa o app com as credenciais
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      })
    });

    return adminApp;
  } catch (error) {
    console.error("Erro ao inicializar Firebase Admin:", error);
    throw error; // Propaga o erro para ser tratado adequadamente
  }
}

// Inicializa o app
try {
  adminApp = getAdminApp();
} catch (error) {
  console.error("Falha ao inicializar Firebase Admin:", error);
}

export { adminApp, getAdminApp }; 