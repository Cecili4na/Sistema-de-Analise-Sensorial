import { Form, Link } from "@remix-run/react";
import { PersonalFields, AddressFields } from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";

export default function JudgeRegistration() {
  return (
    <div className="min-h-screen bg-[#F0F0E5] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#C4A484]">
            Cadastro de Julgador
          </h1>
  
        </div>
        
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
              Informações Adicionais
            </h2>
            <Input
              label="Restrições Alimentares"
              id="dietaryRestrictions"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Link
              to="/cadastro"
              className="px-6 py-3 text-[#C4A484] border border-[#C4A484] rounded-lg 
                hover:bg-[#C4A484] hover:text-white transition"
            >
              Voltar
            </Link>
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