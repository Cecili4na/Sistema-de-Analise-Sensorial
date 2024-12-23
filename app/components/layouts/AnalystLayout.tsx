import { useEffect } from 'react';
import { Outlet, Link, useNavigate } from '@remix-run/react';
import { auth } from '~/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function AnalystLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0E5] flex flex-col">
      <nav className="bg-[#8BA989] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/analista" className="text-xl font-bold">
            Painel do Analista
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              to="/analista/dashboard"
              className="hover:text-[#F0E6D2] transition"
            >
              Dashboard
            </Link>
            <Link 
              to="/analista/criar-teste"
              className="hover:text-[#F0E6D2] transition"
            >
              Criar Teste
            </Link>
            <Link 
              to="/analista/testes"
              className="hover:text-[#F0E6D2] transition"
            >
              Testes
            </Link>
            <button 
              onClick={handleSignOut}
              className="bg-white text-[#8BA989] px-4 py-2 rounded-lg 
                hover:bg-[#F0E6D2] transition"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto py-8 px-4 flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-[#6E8F6E] text-white py-4">
        <div className="container mx-auto text-center">
          <p>© 2024 Análise Sensorial de Laticínios</p>
        </div>
      </footer>
    </div>
  );
}