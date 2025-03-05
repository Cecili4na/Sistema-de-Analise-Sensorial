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
      role: "produtor"
    });

    // Criar documento do produtor no Firestore
    const producerData = {
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
      role: "produtor",
      createdAt: new Date().toISOString(),
    };

    await db.collection("producers").doc(userRecord.uid).set(producerData);

    return redirect("/login?role=produtor");

  } catch (error: unknown) {
    let errorMessage = "Erro ao cadastrar produtor";
    
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

export default function ProducerRegistration() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F0E5] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-[#A0522D] mb-6">
          Cadastro de Produtor
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
              className="px-6 py-3 text-[#A0522D] border border-[#A0522D] rounded-lg 
                hover:bg-[#A0522D] hover:text-white transition"
            >
              Voltar
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#A0522D] text-white px-6 py-3 rounded-lg 
                hover:bg-[#8B4513] transition"
            >
              Cadastrar
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}