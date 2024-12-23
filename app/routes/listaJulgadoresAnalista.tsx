import { Link, useNavigate } from '@remix-run/react';

export default function AnalystJudges() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Julgadores</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              Voltar
            </button>
            <Link
              to="/analista/julgadores/novo"
              className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              Cadastrar Novo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              <img src="/avatar.png" alt="Foto do Julgador" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-[#8BA989] font-medium">João Oliveira</h3>
                <p className="text-gray-500">Julgador</p>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              <img src="/avatar.png" alt="Foto do Julgador" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-[#8BA989] font-medium">Maria Silva</h3>
                <p className="text-gray-500">Julgadora</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}