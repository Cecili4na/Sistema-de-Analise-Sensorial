import { getAuth } from "firebase-admin/auth";
import { adminApp } from "./firebase.server";
import { redirect } from "@remix-run/node";

export async function requireUser(request: Request) {
  const session = request.headers.get("Cookie")?.split(";")
    .find(c => c.trim().startsWith("session="))
    ?.split("=")[1];

  if (!session) {
    throw redirect("/login");
  }

  try {
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifySessionCookie(session, true);
    return decodedToken;
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    throw redirect("/login");
  }
}

export async function requireRole(request: Request, role: string) {
  const decodedToken = await requireUser(request);
  
  if (decodedToken.role !== role) {
    throw redirect("/login");
  }

  return decodedToken;
}

export async function createUserSession(idToken: string, redirectTo: string) {
  console.log("Iniciando createUserSession");
  
  try {
    if (!adminApp) {
      console.error("Firebase Admin não inicializado");
      throw new Error("Firebase Admin não inicializado");
    }

    const auth = getAuth(adminApp);
    console.log("Firebase Admin Auth obtido");
    
    // Verificar o token antes de criar o cookie
    await auth.verifyIdToken(idToken);
    console.log("Token ID verificado com sucesso");
    
    // Criar cookie de sessão que expira em 5 dias
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias em milissegundos
    
    console.log("Criando cookie de sessão...");
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    if (!sessionCookie) {
      console.error("Falha ao criar cookie de sessão");
      throw new Error("Falha ao criar cookie de sessão");
    }

    console.log("Cookie de sessão criado com sucesso");
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": `session=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn}`
      }
    });
  } catch (error) {
    console.error("Erro detalhado ao criar sessão:", error);
    if (error instanceof Error) {
      console.error("Mensagem de erro:", error.message);
    }
    throw error;
  }
} 