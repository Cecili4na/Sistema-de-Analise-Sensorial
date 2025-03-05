import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

console.log("Tentando inicializar Firebase Admin");
console.log("Project ID presente:", !!projectId);
console.log("Client Email presente:", !!clientEmail);
console.log("Private Key presente:", !!privateKey);

if (!projectId || !clientEmail || !privateKey) {
  console.error("Variáveis de ambiente faltando:", {
    projectId: !projectId,
    clientEmail: !clientEmail,
    privateKey: !privateKey
  });
  throw new Error("Variáveis de ambiente do Firebase Admin não configuradas");
}

// Após a verificação, sabemos que as variáveis existem
const privateKeyString = privateKey as string;

function getAdminApp() {
  try {
    const apps = getApps();
    console.log("Apps existentes:", apps.length);
    
    if (apps.length > 0) {
      console.log("Retornando app existente");
      const app = getApp();
      console.log("App obtido com sucesso");
      return app;
    }

    console.log("Inicializando novo app com credenciais");
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKeyString.replace(/\\n/g, "\n"),
      })
    });
    console.log("App inicializado com sucesso");
    return app;
  } catch (error) {
    console.error("Erro ao inicializar Firebase Admin:", error);
    if (error instanceof Error) {
      console.error("Detalhes do erro:", error.message);
      console.error("Stack trace:", error.stack);
    }
    throw error;
  }
}

console.log("Obtendo instância do Firebase Admin");
export const adminApp = getAdminApp(); 