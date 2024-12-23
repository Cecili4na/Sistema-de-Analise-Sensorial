import { Link } from '@remix-run/react';

export default function ProducerAnalystPage() {
  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#A0522D] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Analistas Sensoriais</h1>
          <Link
            to="/produtor/analistas-sensoriais/novo"
            className="bg-[#8B4513] hover:opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Cadastrar Novo
          </Link>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col items-center justify-center p-4 border-r border-gray-200">
              <img src="/avatar.png" alt="Foto do Analista" className="w-24 h-24 rounded-full mb-4" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-[#A0522D]">Ana Silva</h3>
                <p className="text-gray-500">Analista Sensorial</p>
              </div>
            </div>
            <div className="col-span-2 p-4 space-y-2">
              <div>
                <h4 className="text-[#A0522D] font-medium">Informações:</h4>
                <p>
                  CPF: 123.456.789-00<br/>
                  Email: ana@example.com<br/>
                  Telefone: (83) 98765-4321
                </p>
              </div>
              <div>
                <h4 className="text-[#A0522D] font-medium">Especialidade:</h4>
                <p>Laticínios Caprinos</p>
              </div>
              <div>
                <h4 className="text-[#A0522D] font-medium">Registro Profissional:</h4>
                <p>CRA-PB 12345</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#A0522D] text-white py-4 text-center text-sm">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}