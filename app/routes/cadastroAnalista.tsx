import { Form } from "@remix-run/react";
import { PersonalFields, AddressFields, TextAreaField } from "~/components/ui/Form";

export default function AnalystRegistration() {
  return (
    <div className="min-h-screen bg-[#F0F0E5] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-[#8BA989] mb-6">
          Cadastro de Analista
        </h1>
        
        <Form method="post" className="space-y-8">
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

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Informações Profissionais
            </h2>
            <TextAreaField 
              label="Experiência em Análises Sensoriais" 
              id="experience"
              required
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
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