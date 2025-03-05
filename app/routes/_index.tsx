import { Link, useNavigate } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';

type UserRole = 'produtor' | 'analista' | 'julgador';

export const loader: LoaderFunction = async () => {
  return json({});
};

export default function IndexPage() {
  const navigate = useNavigate();

  const handleProfileSelection = (role: UserRole) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#F0F0E5] flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="/logo-panc.png" 
            alt="PANC - Plataforma de Análise Sensorial"
            className="h-16 mx-auto mb-2"
          />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl font-bold text-[#4A4A4A] mb-12 text-center">
          Selecione seu perfil de acesso
        </h1>

        <div className="max-w-3xl w-full space-y-6">
          <button 
            onClick={() => handleProfileSelection('produtor')}
            className="w-full bg-[#A0522D] text-white p-8 rounded-lg 
              hover:opacity-90 transition text-center"
          >
            <div className="mb-2">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
            <div className="text-xl">Produtor</div>
          </button>

          <button 
            onClick={() => handleProfileSelection('analista')}
            className="w-full bg-[#8BA989] text-white p-8 rounded-lg 
              hover:opacity-90 transition text-center"
          >
            <div className="mb-2">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-xl">Analista</div>
          </button>

          <button 
            onClick={() => handleProfileSelection('julgador')}
            className="w-full bg-[#C4A484] text-white p-8 rounded-lg 
              hover:opacity-90 transition text-center"
          >
            <div className="mb-2">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
            <div className="text-xl">Julgador</div>
          </button>
        </div>

        <Link 
          to="/cadastro"
          className="mt-8 text-[#8BA989] hover:underline"
        >
          Cadastre-se
        </Link>
      </main>

      {/* Rodapé */}
      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}