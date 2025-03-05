import { useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '~/lib/firebase.client';

interface Analista {
  id: string;
  nome: string;
  email: string;
  especialidade: string;
  registroProfissional: string;
}

export default function ListaAnalistasJulgador() {
  const navigate = useNavigate();
  const [analistas, setAnalistas] = useState<Analista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseApp) {
      console.error('Firebase app não inicializado');
      navigate('/login?role=julgador');
      return;
    }

    const auth = getAuth(firebaseApp);
    
    // Verificar autenticação
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login?role=julgador');
        return;
      }

      // Verificar papel do usuário
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.role !== 'julgador') {
        auth.signOut();
        navigate('/login?role=julgador');
        return;
      }

      // Carregar analistas
      try {
        const db = getFirestore(firebaseApp);
        const analistasRef = collection(db, 'analistas');
        const analistasSnapshot = await getDocs(analistasRef);
        const analistasData = analistasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Analista[];
        setAnalistas(analistasData);
      } catch (error) {
        console.error('Erro ao carregar analistas:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
      <header className="bg-[#C4A484] text-white py-4 shrink-0">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo-panc.png" 
              alt="PANC Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">Analistas Sensoriais</h1>
          </div>
          <button
            onClick={() => navigate('/dashboardJulgador')}
            className="px-4 py-2 border border-white rounded-lg hover:bg-[#B08B64] transition"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Card - Analistas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 text-[#C4A484] mb-6">
              <span className="text-2xl">👥</span>
              <h2 className="text-xl font-semibold">Analistas Cadastrados</h2>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando analistas...</p>
              </div>
            ) : analistas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum analista cadastrado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analistas.map((analista) => (
                  <div key={analista.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-[#C4A484]">{analista.nome}</p>
                        <p className="text-sm text-gray-500">{analista.especialidade}</p>
                        <p className="text-sm text-gray-500">{analista.email}</p>
                        <p className="text-sm text-gray-500">Registro: {analista.registroProfissional}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/analistaJulgador/${analista.id}`)}
                        className="text-[#C4A484] text-sm hover:underline"
                      >
                        Ver perfil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#C4A484] text-white py-4 text-center text-sm shrink-0">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
} 