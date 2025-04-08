import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

// Não logar durante o build
if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
  console.log("Tentando inicializar Firebase Admin");
  console.log("Project ID presente:", !!projectId);
  console.log("Client Email presente:", !!clientEmail);
  console.log("Private Key presente:", !!privateKey);
}

// Inicializar um objeto vazio para o caso de falha
let adminApp = {};

// Não lançar erro durante o build
if (!projectId || !clientEmail || !privateKey) {
  if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
    console.error("Variáveis de ambiente faltando:", {
      projectId: !projectId,
      clientEmail: !clientEmail,
      privateKey: !privateKey
    });
  }
} else {
  // Após a verificação, sabemos que as variáveis existem
  const privateKeyString = privateKey as string;

  function getAdminApp() {
    try {
      const apps = getApps();
      if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
        console.log("Apps existentes:", apps.length);
      }
      
      if (apps.length > 0) {
        if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
          console.log("Retornando app existente");
        }
        const app = getApp();
        if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
          console.log("App obtido com sucesso");
        }
        return app;
      }

      if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
        console.log("Inicializando novo app com credenciais");
      }
      const app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKeyString.replace(/\\n/g, "\n"),
        })
      });
      if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
        console.log("App inicializado com sucesso");
      }
      return app;
    } catch (error) {
      if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
        console.error("Erro ao inicializar Firebase Admin:", error);
        if (error instanceof Error) {
          console.error("Detalhes do erro:", error.message);
          console.error("Stack trace:", error.stack);
        }
      }
      // Retornar um objeto vazio em vez de lançar um erro
      return {};
    }
  }

  if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production") {
    console.log("Obtendo instância do Firebase Admin");
  }
  adminApp = getAdminApp();
}

export { adminApp }; 