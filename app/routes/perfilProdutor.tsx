import { Form } from "@remix-run/react";
import { Input } from "~/components/ui/Input";

export default function ProducerProfilePage() {
  return (
    <div className="bg-[#F0F0E5] min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-[#A0522D] mb-6">Perfil do Produtor</h1>
        
        <Form method="post" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome"
              name="name"
              id="name"
              className="col-span-2"
            />
            <Input
              label="CPF"
              name="cpf"
              id="cpf"
            />
            <Input
              label="Email"
              name="email"
              id="email"
            />
            <Input
              label="Telefone"
              name="phone"
              id="phone"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Rua"
              name="street"
              id="street"
            />
            <Input
              label="Número"
              name="number"
              id="number"
            />
            <Input
              label="Cidade"
              name="city"
              id="city"
            />
            <Input
              label="Estado"
              name="state"
              id="state"
            />
            <Input
              label="CEP"
              name="zipCode"
              id="zipCode"
              className="col-span-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Empresa/Propriedade"
              name="companyName"
              id="companyName"
            />
            <Input
              label="CNPJ"
              name="cnpj"
              id="cnpj"
            />
            <Input
              label="Inscrição Estadual"
              name="stateRegistration"
              id="stateRegistration"
              className="col-span-2"
            />
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
              Salvar
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}