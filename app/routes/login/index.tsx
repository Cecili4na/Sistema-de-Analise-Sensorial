// app/routes/login.tsx
import { useState } from 'react';
import { useActionData, useNavigate, useSubmit } from '@remix-run/react';
import { json, ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from "~/lib/firebase.client";

const colors = {
  primary: {
    bg: 'bg-[#8BA989]',      // Verde claro
    hover: 'hover:bg-[#6B8E6B]',
    text: 'text-[#8BA989]',
    border: 'border-[#8BA989]'
  },
  secondary: {
    bg: 'bg-[#DEB887]',      // Marrom claro (burlywood)
    hover: 'hover:bg-[#CDA777]',
    text: 'text-[#DEB887]',
    border: 'border-[#DEB887]'
  },
  accent: {
    bg: 'bg-[#8B4513]',      // Marrom avermelhado (saddle brown)
    hover: 'hover:bg-[#7A3503]',
    text: 'text-[#8B4513]',
    border: 'border-[#8B4513]'
  }
};

export const loader: LoaderFunction = async () => {
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const idToken = formData.get("idToken");

  if (typeof idToken !== "string") {
    return json({ error: "Dados inválidos" }, { status: 400 });
  }

  try {
    return redirect("/dashboardAnalista");
  } catch (error) {
    console.error("Erro ao processar login:", error);
    return json({ error: "Erro ao processar login" }, { status: 500 });
  }
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

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

      if (idTokenResult.claims.role !== 'analista') {
        await auth.signOut();
        setError("Você não tem permissão para acessar como analista");
        return;
      }

      // Obter token e enviar para o servidor
      const idToken = await userCredential.user.getIdToken();
      
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("idToken", idToken);
      
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
      <header className={colors.primary.bg + " text-white py-4"}>
        <div className="container mx-auto px-4 flex items-center justify-center">
          <a href="/" className="flex items-center">
            <img 
              src="/logo-panc.png" 
              alt="PANC - Plataforma de Análise Sensorial"
              className="h-16 w-auto"
            />
          </a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className={colors.primary.bg + " text-white p-6 rounded-t-lg text-center"}>
            <h1 className="text-2xl font-bold">
              Login
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
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                    focus:ring-[#8BA989] transition-colors"
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
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                    focus:ring-[#8BA989] transition-colors"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className={`${colors.primary.bg} text-white px-6 py-3 rounded-lg 
                  hover:bg-[#6B8E6B] transition w-full font-medium`}
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className={`px-6 py-3 border ${colors.primary.border} ${colors.primary.text} rounded-lg 
                  hover:bg-[#8BA989] hover:text-white transition w-full font-medium`}
              >
                Voltar
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <span>Não tem uma conta? </span>
              <a 
                href="/cadastroAnalista" 
                className={`${colors.primary.text} hover:text-[#6B8E6B] hover:underline font-medium`}
              >
                Cadastre-se
              </a>
            </div>
          </form>
        </div>
      </main>

      <footer className={colors.primary.bg + " text-white py-4 text-center text-sm mt-8"}>
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}