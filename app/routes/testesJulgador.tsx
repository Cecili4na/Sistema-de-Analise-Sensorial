import { useNavigate } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { firebaseApp } from '~/lib/firebase.client';

interface Teste {
  id: string;
  produto: string;
  fabricante: string;
  tipoEmbalagem: string;
  pesoProduto: string;
  dataFabricacao: string;
  dataValidade: string;
  dataTeste: string;
  horarioTeste: string;
  localTeste: string;
  tipoTeste: string;
  quantidadeAvaliadores: number;
  atributosAvaliados: string[];
  tipoAnaliseEstatistica: string;
  status: string;
  dataCriacao: string;
}

export default function TestesJulgador() {
  const navigate = useNavigate();
  const [testes, setTestes] = useState<Teste[]>([]);
  const [loading, setLoading] = useState(true);
  const [testeExpandido, setTesteExpandido] = useState<string | null>(null);

  useEffect(() => {
    const carregarTestes = async () => {
      if (!firebaseApp) return;

      try {
        const db = getFirestore(firebaseApp);
        const testesRef = collection(db, 'testes');
        const q = query(testesRef, orderBy('dataCriacao', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const testesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Teste[];

        setTestes(testesData);
      } catch (error) {
        console.error('Erro ao carregar testes:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarTestes();
  }, []);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const traduzirTipoTeste = (tipo: string) => {
    const tipos = {
      escalaHedonica: 'Escala Hedônica',
      comparacaoPareada: 'Comparação Pareada',
      ordenacao: 'Ordenação',
      aceitacao: 'Aceitação'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const traduzirAnaliseEstatistica = (tipo: string) => {
    const tipos = {
      anova: 'ANOVA - Análise de Variância',
      testeMedia: 'Teste de Média'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#C4A484] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Testes de Análise Sensorial</h1>
          <button
            onClick={() => navigate('/dashboardJulgador')}
            className="bg-[#B08B64] hover:opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Carregando testes...</p>
          </div>
        ) : testes.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <p className="text-gray-600">Nenhum teste cadastrado no sistema.</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
            {testes.map((teste) => (
              <div key={teste.id} className="border-b border-gray-200 pb-4">
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => setTesteExpandido(testeExpandido === teste.id ? null : teste.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setTesteExpandido(testeExpandido === teste.id ? null : teste.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <h2 className="text-[#C4A484] font-medium text-lg">{teste.produto}</h2>
                    <p className="text-gray-600">
                      Data do Teste: {formatarData(teste.dataTeste)}<br />
                      Local: {teste.localTeste}<br />
                      Status: {teste.status}
                    </p>
                  </div>
                  <span className="text-[#C4A484] text-2xl">
                    {testeExpandido === teste.id ? '−' : '+'}
                  </span>
                </div>

                {testeExpandido === teste.id && (
                  <div className="mt-4 pl-4 space-y-4">
                    <div>
                      <h3 className="font-medium text-[#C4A484]">Dados do Produto</h3>
                      <p className="text-gray-600">
                        Fabricante: {teste.fabricante}<br />
                        Tipo de Embalagem: {teste.tipoEmbalagem}<br />
                        Peso: {teste.pesoProduto}<br />
                        Data de Fabricação: {formatarData(teste.dataFabricacao)}<br />
                        Data de Validade: {formatarData(teste.dataValidade)}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#C4A484]">Dados do Teste</h3>
                      <p className="text-gray-600">
                        Horário: {teste.horarioTeste}<br />
                        Tipo do Teste: {traduzirTipoTeste(teste.tipoTeste)}<br />
                        Quantidade de Avaliadores: {teste.quantidadeAvaliadores}<br />
                        Análise Estatística: {traduzirAnaliseEstatistica(teste.tipoAnaliseEstatistica)}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#C4A484]">Atributos Avaliados</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {teste.atributosAvaliados.map((atributo) => (
                          <span 
                            key={atributo}
                            className="bg-[#C4A484] text-white px-3 py-1 rounded-full text-sm"
                          >
                            {atributo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => navigate(`/testeJulgador/${teste.id}`)}
                        className="text-[#C4A484] hover:underline"
                      >
                        Ver Detalhes Completos
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#C4A484] text-white py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </div>
      </footer>
    </div>
  );
}