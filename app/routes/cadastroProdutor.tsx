import { Form } from "@remix-run/react";
import { PersonalFields, AddressFields } from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";

export default function ProducerRegistration() {
  return (
    <div className="min-h-screen bg-[#F0F0E5] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-[#A0522D] mb-6">Cadastro de Produtor</h1>

        <Form method="post" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Dados Pessoais</h2>
            <PersonalFields />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Endereço</h2>
            <AddressFields />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações da Empresa</h2>
            <div className="space-y-4">
              <Input
                label="Nome da Empresa/Propriedade"
                id="companyName"
                required
              />
              <Input
                label="CNPJ"
                id="cnpj"
                placeholder="00.000.000/0000-00"
                required
              />
              <Input
                label="Inscrição Estadual"
                id="stateRegistration"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
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