import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '~/lib/firebase.client';

export default function DashboardAnalista() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!firebaseApp) return;
    
    const auth = getAuth(firebaseApp);
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login?role=analista');
        return;
      }

      try {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.role !== 'analista') {
          auth.signOut();
          navigate('/login?role=analista');
        }
      } catch (err) {
        console.error('Erro ao verificar papel do usuário:', err);
        auth.signOut();
        navigate('/login?role=analista');
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
      <header className="bg-[#8BA989] text-white py-4 shrink-0">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo-panc.png" 
              alt="PANC Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">Dashboard do Analista</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Card - Perfil */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 text-[#8BA989] mb-4">
              <span className="text-2xl">👤</span>
              <h2 className="text-xl font-semibold">Perfil</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Gerencie suas informações pessoais e dados profissionais.
            </p>
            <button
              onClick={() => navigate('/perfilAnalista')}
              className="w-full bg-[#8BA989] text-white py-2 rounded-lg 
                hover:bg-[#6E8F6E] transition"
            >
              Acessar Perfil
            </button>
          </div>

          {/* Card - Testes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 text-[#8BA989] mb-4">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-semibold">Testes</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Gerencie os testes sensoriais e acompanhe os resultados.
            </p>
            <button
              onClick={() => navigate('/testesAnalista')}
              className="w-full bg-[#8BA989] text-white py-2 rounded-lg 
                hover:bg-[#6E8F6E] transition"
            >
              Gerenciar Testes
            </button>
          </div>

          {/* Card - Julgadores */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 text-[#8BA989] mb-4">
              <span className="text-2xl">👥</span>
              <h2 className="text-xl font-semibold">Julgadores</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Gerencie a equipe de julgadores e acompanhe seu desempenho.
            </p>
            <button
              onClick={() => navigate('/listaJulgadoresAnalista')}
              className="w-full bg-[#8BA989] text-white py-2 rounded-lg 
                hover:bg-[#6E8F6E] transition"
            >
              Gerenciar Julgadores
            </button>
          </div>

          {/* Card - Teoria */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 text-[#8BA989] mb-4">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl font-semibold">Teoria</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Acesse o material teórico sobre análise sensorial.
            </p>
            <button
              onClick={() => navigate('/teoriaAnalista')}
              className="w-full bg-[#8BA989] text-white py-2 rounded-lg 
                hover:bg-[#6E8F6E] transition"
            >
              Acessar Material
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm mt-auto">
        <div className="container mx-auto">
          <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </div>
      </footer>
    </div>
  );
} 