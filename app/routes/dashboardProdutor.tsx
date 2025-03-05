import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '~/lib/firebase.client';

export default function DashboardProdutor() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    
    // Verificar autenticação
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login?role=produtor');
        return;
      }

      // Verificar papel do usuário
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.role !== 'produtor') {
        auth.signOut();
        navigate('/login?role=produtor');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
      <header className="bg-[#A0522D] text-white py-4 shrink-0">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo-panc.png" 
              alt="PANC Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">Dashboard do Produtor</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white rounded-lg hover:bg-[#8B4513] transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Card - Perfil */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 text-[#A0522D] mb-4">
              <span className="text-2xl">👤</span>
              <h2 className="text-xl font-semibold">Perfil</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Gerencie suas informações pessoais e dados da propriedade.
            </p>
            <button
              onClick={() => navigate('/perfilProdutor')}
              className="w-full bg-[#A0522D] text-white py-2 rounded-lg 
                hover:bg-[#8B4513] transition"
            >
              Acessar Perfil
            </button>
          </div>

          {/* Card - Analistas Sensoriais */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 text-[#A0522D] mb-4">
              <span className="text-2xl">👥</span>
              <h2 className="text-xl font-semibold">Analistas Sensoriais</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Visualize e gerencie os analistas sensoriais vinculados.
            </p>
            <button
              onClick={() => navigate('/listaAnalistasProdutor')}
              className="w-full bg-[#A0522D] text-white py-2 rounded-lg 
                hover:bg-[#8B4513] transition"
            >
              Ver Analistas
            </button>
          </div>

          {/* Card - Testes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 text-[#A0522D] mb-4">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-semibold">Testes</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Acompanhe os testes em andamento e resultados das análises.
            </p>
            <button
              onClick={() => navigate('/testesProdutor')}
              className="w-full bg-[#A0522D] text-white py-2 rounded-lg 
                hover:bg-[#8B4513] transition"
            >
              Ver Testes
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-[#A0522D] text-white py-4 text-center text-sm shrink-0">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
} 