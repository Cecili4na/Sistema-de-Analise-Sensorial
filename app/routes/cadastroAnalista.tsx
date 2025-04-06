import { Form, useActionData, useNavigate } from "@remix-run/react";
import { PersonalFields, AddressFields } from "~/components/ui/Form";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "~/lib/firebase.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  // Validação dos campos obrigatórios
  const requiredFields = [
    "name", "gender", "birthDate", "email", "password", "phone", "education",
    "street", "number", "neighborhood", "zipCode", "city", "state"
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
          education: "Escolaridade",
          street: "Rua",
          number: "Número",
          neighborhood: "Bairro",
          zipCode: "CEP",
          city: "Cidade",
          state: "Estado"
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
      role: "analista"
    });

    // Criar documento do analista no Firestore
    const analystData = {
      name: formValues.name,
      gender: formValues.gender,
      birthDate: formValues.birthDate,
      email: formValues.email,
      phone: formValues.phone,
      education: formValues.education,
      address: {
        street: formValues.street,
        number: formValues.number,
        neighborhood: formValues.neighborhood,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode,
      },
      role: "analista",
      createdAt: new Date().toISOString(),
    };

    console.log('Tentando salvar dados do analista:', {
      userId: userRecord.uid,
      data: analystData
    });

    try {
      await db.collection("analists").doc(userRecord.uid).set(analystData);
      console.log('Dados do analista salvos com sucesso');

      // Verificar se os dados foram salvos
      const savedDoc = await db.collection("analists").doc(userRecord.uid).get();
      if (savedDoc.exists) {
        console.log('Dados salvos verificados:', savedDoc.data());
      } else {
        console.log('Documento não encontrado após salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar dados do analista:', error);
      throw error;
    }

    return redirect("/login?role=analista");

  } catch (error: unknown) {
    let errorMessage = "Erro ao cadastrar analista";
    
    if (error instanceof Error) {
      console.error("Erro detalhado:", error);
      if ('code' in error) {
        const firebaseError = error as { code: string };
        switch (firebaseError.code) {
          case "auth/email-already-in-use":
          case "auth/email-already-exists":
            errorMessage = "Este e-mail já está cadastrado em nossa plataforma. Por favor, use outro e-mail ou faça login se já possuir uma conta.";
            break;
          case "auth/weak-password":
            errorMessage = "A senha deve ter pelo menos 6 caracteres para garantir a segurança da sua conta.";
            break;
          case "auth/invalid-email":
            errorMessage = "O e-mail informado não é válido. Por favor, verifique e tente novamente.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "O cadastro de novos usuários está temporariamente desativado. Por favor, tente novamente mais tarde.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Erro de conexão. Por favor, verifique sua internet e tente novamente.";
            break;
          default:
            errorMessage = "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.";
        }
      } else {
        errorMessage = `Erro: ${error.message}`;
      }
    }

    return json({ error: errorMessage }, { status: 400 });
  }
};

export default function AnalystRegistration() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F0E5] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-[#8BA989] mb-6">
          Cadastro de Analista
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
            <PersonalFields />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Endereço
            </h2>
            <AddressFields />
          </div>


          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-[#8BA989] border border-[#8BA989] rounded-lg 
                hover:bg-[#8BA989] hover:text-white transition"
            >
              Voltar
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#8BA989] text-white px-6 py-3 rounded-lg 
                hover:bg-[#6E8F6E] transition"
            >
              Cadastrar
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}