import { Link, useNavigate } from '@remix-run/react';

export default function JudgeTests() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#C4A484] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Testes de Análise Sensorial</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#a38562] hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              Voltar
            </button>
         
          </div>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-[#C4A484] font-medium text-lg">Teste 1</h2>
            <p>
              Produto: Queijo de Cabra<br/>
              Data: 10/05/2023<br/>
              Local: Laboratório de Análise Sensorial
            </p>
            <div className="mt-2">
              <Link
                to="/julgador/testes/1"
                className="text-[#C4A484] hover:underline"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-[#C4A484] font-medium text-lg">Teste 2</h2>
            <p>
              Produto: Iogurte de Cabra<br/>
              Data: 20/06/2023<br/>
              Local: Laboratório de Análise Sensorial
            </p>
            <div className="mt-2">
              <Link
                to="/julgador/testes/2"
                className="text-[#C4A484] hover:underline"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#C4A484] text-white py-4 text-center text-sm">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}