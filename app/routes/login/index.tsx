// app/routes/login.tsx
import { useState } from 'react';
import { useSearchParams, useActionData, useNavigate, useSubmit } from '@remix-run/react';
import { json, ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from "~/lib/firebase.client";

interface ThemeColors {
  bg: string;
  hover: string;
  text: string;
  border: string;
}

type UserRole = 'produtor' | 'analista' | 'julgador';

const roleConfigs: Record<UserRole, ThemeColors> = {
  produtor: {
    bg: 'bg-[#A0522D]',
    hover: 'hover:bg-[#8B4513]',
    text: 'text-[#A0522D]',
    border: 'border-[#A0522D]'
  },
  analista: {
    bg: 'bg-[#8BA989]',
    hover: 'hover:bg-[#6E8F6E]',
    text: 'text-[#8BA989]',
    border: 'border-[#8BA989]'
  },
  julgador: {
    bg: 'bg-[#C4A484]',
    hover: 'hover:bg-[#B08B64]',
    text: 'text-[#C4A484]',
    border: 'border-[#C4A484]'
  }
};

export const loader: LoaderFunction = async () => {
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const idToken = formData.get("idToken");
  const role = formData.get("role");

  if (typeof idToken !== "string" || typeof role !== "string") {
    return json({ error: "Dados inválidos" }, { status: 400 });
  }

  try {
    const redirectMap: Record<string, string> = {
      produtor: "/dashboardProdutor",
      analista: "/dashboardAnalista",
      julgador: "/dashboardJulgador"
    };

    return redirect(redirectMap[role] || "/");
  } catch (error) {
    console.error("Erro ao processar login:", error);
    return json({ error: "Erro ao processar login" }, { status: 500 });
  }
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "produtor";
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const submit = useSubmit();
  const themeColor = roleConfigs[role as UserRole] || roleConfigs.produtor;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  if (!role || !Object.keys(roleConfigs).includes(role as UserRole)) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      if (!firebaseApp) {
        throw new Error("Firebase não inicializado");
      }

      const auth = getAuth(firebaseApp);
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Verificar se o usuário tem o papel correto
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      
      if (!idTokenResult.claims.role) {
        await auth.signOut();
        setError("Usuário não tem permissões configuradas");
        return;
      }

      if (idTokenResult.claims.role !== role) {
        await auth.signOut();
        setError(`Você não tem permissão para acessar como ${role}`);
        return;
      }

      // Obter token e enviar para o servidor
      const idToken = await userCredential.user.getIdToken();
      
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("idToken", idToken);
      formDataToSubmit.append("role", role);
      
      submit(formDataToSubmit, { method: "post" });
    } catch (error) {
      console.error("Erro na autenticação:", error);
      let errorMessage = "Email ou senha inválidos";
      
      if (error instanceof Error) {
        if ('code' in error) {
          const firebaseError = error as { code: string };
          if (firebaseError.code === "auth/user-not-found") {
            errorMessage = "Usuário não encontrado";
          } else if (firebaseError.code === "auth/wrong-password") {
            errorMessage = "Senha incorreta";
          } else if (firebaseError.code === "auth/invalid-email") {
            errorMessage = "Email inválido";
          } else if (firebaseError.code === "auth/network-request-failed") {
            errorMessage = "Erro de conexão. Verifique sua internet.";
          }
        }
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0E5] flex flex-col">
      <header className={themeColor.bg + " text-white py-4"}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img 
              src="/logo-panc.png" 
              alt="PANC - Plataforma de Análise Sensorial"
              className="h-16 w-auto"
            />
          </a>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`px-4 py-2 border border-white rounded-lg transition ${themeColor.hover}`}
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className={themeColor.bg + " text-white p-6 rounded-t-lg text-center"}>
            <h1 className="text-2xl font-bold">
              Login - {role.charAt(0).toUpperCase() + role.slice(1)}
            </h1>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-b-lg shadow-lg space-y-6"
          >
            {(error || actionData?.error) && (
              <div className="p-3 bg-red-100 text-red-600 rounded text-sm">
                {error || actionData.error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    email: e.target.value 
                  }))}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                    focus:ring-${themeColor.text.replace('text-', '')} transition-colors`}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    password: e.target.value 
                  }))}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                    focus:ring-${themeColor.text.replace('text-', '')} transition-colors`}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className={`${themeColor.bg} text-white px-6 py-3 rounded-lg 
                  hover:opacity-90 transition w-full`}
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 text-gray-600 border rounded-lg 
                  hover:bg-gray-50 transition w-full"
              >
                Voltar
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <span>Não tem uma conta? </span>
              <a 
                href="/cadastro" 
                className={themeColor.text + " hover:underline"}
              >
                Cadastre-se
              </a>
            </div>
          </form>
        </div>
      </main>

      <footer className={themeColor.bg + " text-white py-4 text-center text-sm mt-8"}>
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}