import { Link, useNavigate } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '~/lib/firebase.client';

interface Julgador {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  testesParticipados: string[];
  dataCadastro: string;
}

interface TesteBasico {
  id: string;
  produto: string;
  dataTeste: string;
}

export default function AnalystJudges() {
  const navigate = useNavigate();
  const [julgadores, setJulgadores] = useState<Julgador[]>([]);
  const [testes, setTestes] = useState<TesteBasico[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroTeste, setFiltroTeste] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      if (!firebaseApp) return;

      try {
        const db = getFirestore(firebaseApp);
        
        // Carregar julgadores
        const julgadoresRef = collection(db, 'julgadores');
        const julgadoresSnapshot = await getDocs(julgadoresRef);
        const julgadoresData = julgadoresSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Julgador[];
        setJulgadores(julgadoresData);

        // Carregar testes
        const testesRef = collection(db, 'testes');
        const testesSnapshot = await getDocs(testesRef);
        const testesData = testesSnapshot.docs.map(doc => ({
          id: doc.id,
          produto: doc.data().produto,
          dataTeste: doc.data().dataTeste
        }));
        setTestes(testesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const julgadoresFiltrados = julgadores.filter(julgador => {
    const matchNome = julgador.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const matchTeste = !filtroTeste || julgador.testesParticipados.includes(filtroTeste);
    return matchNome && matchTeste;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

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
              to="/novoJulgadorAnalista"
              className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              Cadastrar Novo Julgador
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Filtros */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filtroNome" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar por Nome
              </label>
              <input
                type="text"
                id="filtroNome"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Digite o nome do julgador"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
              />
            </div>
            <div>
              <label htmlFor="filtroTeste" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Teste
              </label>
              <select
                id="filtroTeste"
                value={filtroTeste}
                onChange={(e) => setFiltroTeste(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
              >
                <option value="">Todos os testes</option>
                {testes.map((teste) => (
                  <option key={teste.id} value={teste.id}>
                    {teste.produto} - {formatarData(teste.dataTeste)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Julgadores */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando julgadores...</p>
            </div>
          ) : julgadoresFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhum julgador encontrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {julgadoresFiltrados.map((julgador) => (
                <div 
                  key={julgador.id} 
                  className="border-b border-gray-200 pb-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={julgador.foto || "/avatar.png"} 
                        alt={`Foto de ${julgador.nome}`} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-[#8BA989] font-medium">{julgador.nome}</h3>
                        <p className="text-gray-500">{julgador.email}</p>
                        <p className="text-sm text-gray-400">
                          Cadastrado em: {formatarData(julgador.dataCadastro)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => navigate(`/julgadorAnalista/${julgador.id}`)}
                        className="text-[#8BA989] hover:underline"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </div>
      </footer>
    </div>
  );
}