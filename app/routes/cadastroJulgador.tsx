import { Form, useActionData, useNavigate } from "@remix-run/react";
import { JudgeFields } from "~/components/ui/Form";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "~/lib/firebase.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  // Validação dos campos obrigatórios
  const requiredFields = [
    "name", "gender", "birthDate", "email", "password", "phone", "education"
  ];

  const formValues: Record<string, string> = {};
  const missingFields: string[] = [];

  requiredFields.forEach(field => {
    const value = formData.get(field)?.toString().trim();
    formValues[field] = value || "";
    if (!value) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return json({
      error: `Por favor, preencha os seguintes campos: ${missingFields.map(field => {
        const fieldNames: Record<string, string> = {
          name: "Nome",
          gender: "Sexo",
          birthDate: "Data de Nascimento",
          email: "E-mail",
          password: "Senha",
          phone: "Telefone",
          education: "Escolaridade"
        };
        return fieldNames[field] || field;
      }).join(", ")}`
    }, { status: 400 });
  }

  if (formValues.password.length < 6) {
    return json({
      error: "A senha deve ter pelo menos 6 caracteres"
    }, { status: 400 });
  }

  try {
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    // Criar usuário no Firebase Auth
    const userRecord = await auth.createUser({
      email: formValues.email,
      password: formValues.password,
      displayName: formValues.name
    });

    // Definir custom claim
    await auth.setCustomUserClaims(userRecord.uid, {
      role: "julgador"
    });

    // Criar documento do julgador no Firestore
    const judgeData = {
      name: formValues.name,
      gender: formValues.gender,
      birthDate: formValues.birthDate,
      email: formValues.email,
      phone: formValues.phone,
      education: formValues.education,
      role: "julgador",
      createdAt: new Date().toISOString(),
      profilePicture: null // Inicialmente nulo, será atualizado depois se houver upload
    };

    await db.collection("judges").doc(userRecord.uid).set(judgeData);

    return redirect("/login?role=julgador");

  } catch (error: unknown) {
    let errorMessage = "Erro ao cadastrar julgador";
    
    if (error instanceof Error) {
      if ('code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === "auth/email-already-in-use") {
          errorMessage = "Este email já está em uso";
        } else if (firebaseError.code === "auth/weak-password") {
          errorMessage = "A senha deve ter pelo menos 6 caracteres";
        } else if (firebaseError.code === "auth/invalid-email") {
          errorMessage = "Email inválido";
        }
      } else {
        errorMessage = error.message;
      }
    }

    return json({ error: errorMessage }, { status: 400 });
  }
};

export default function JudgeRegistration() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F0E5] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-[#C4A484] mb-6">
          Cadastro de Julgador
        </h1>

        <Form method="post" className="space-y-8">
          {actionData?.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {actionData.error}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Dados Pessoais
            </h2>
            <JudgeFields />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-[#C4A484] border border-[#C4A484] rounded-lg 
                hover:bg-[#C4A484] hover:text-white transition"
            >
              Voltar
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#C4A484] text-white px-6 py-3 rounded-lg 
                hover:bg-[#B08B64] transition"
            >
              Cadastrar
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}