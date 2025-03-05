import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdmin } from "~/lib/firebase.server";

export const action: ActionFunction = async ({ request }) => {
  console.log("Iniciando setCustomClaim...");

  if (request.method !== "POST") {
    console.error("Método inválido:", request.method);
    return json({ error: "Método não permitido" }, { status: 405 });
  }

  try {
    const contentType = request.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Content-Type inválido:", contentType);
      return json({ error: "Content-Type deve ser application/json" }, { status: 400 });
    }

    const body = await request.json();
    console.log("Dados recebidos:", body);

    const { uid, role } = body;

    if (!uid || !role) {
      console.error("Dados inválidos:", { uid, role });
      return json({ error: "UID e role são obrigatórios" }, { status: 400 });
    }

    if (typeof uid !== "string" || typeof role !== "string") {
      console.error("Tipos inválidos:", { uid: typeof uid, role: typeof role });
      return json({ error: "UID e role devem ser strings" }, { status: 400 });
    }

    console.log("Inicializando Firebase Admin...");
    const app = getFirebaseAdmin();
    console.log("Firebase Admin inicializado");

    console.log("Obtendo instância do Auth...");
    const auth = getAuth(app);
    console.log("Auth obtido");
    
    console.log("Definindo custom claim para usuário:", uid, "com role:", role);
    await auth.setCustomUserClaims(uid, { role });
    console.log("Custom claim definida com sucesso");

    return json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro detalhado ao definir custom claim:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      if (error.message.includes('app/no-app')) {
        console.error("Erro de inicialização do Firebase Admin. Verificar variáveis de ambiente.");
        return json({ 
          error: "Erro de configuração do servidor. Por favor, contate o suporte." 
        }, { status: 500 });
      }

      if (error.message.includes('auth/invalid-uid')) {
        return json({ 
          error: "UID do usuário inválido" 
        }, { status: 400 });
      }

      return json({ 
        error: "Erro ao definir permissões do usuário: " + error.message 
      }, { status: 500 });
    }

    console.error("Erro desconhecido ao definir custom claim:", error);
    return json({ 
      error: "Erro interno do servidor" 
    }, { status: 500 });
  }
}; 