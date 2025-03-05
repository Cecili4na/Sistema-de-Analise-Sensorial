import { useNavigate, useParams } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
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
  analistaId: string;
  criadoPor: string;
  atualizadoEm: string;
  judgeIds?: string[];
  resultados?: {
    [key: string]: {
      notas: { [atributo: string]: number };
      comentarios?: string;
      dataAvaliacao: string;
    };
  };
}

interface Julgador {
  id: string;
  nome: string;
  email: string;
}

export default function TestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [teste, setTeste] = useState<Teste | null>(null);
  const [julgadores, setJulgadores] = useState<Julgador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      if (!firebaseApp || !id) return;

      try {
        const db = getFirestore(firebaseApp);
        
        // Carregar dados do teste
        const testeDoc = await getDoc(doc(db, 'testes', id));
        if (!testeDoc.exists()) {
          setError('Teste não encontrado');
          setLoading(false);
          return;
        }

        const testeData = {
          id: testeDoc.id,
          ...testeDoc.data()
        } as Teste;
        setTeste(testeData);

        // Carregar dados dos julgadores
        if (testeData.judgeIds && testeData.judgeIds.length > 0) {
          const julgadoresPromises = testeData.judgeIds.map(judgeId =>
            getDoc(doc(db, 'julgadores', judgeId))
          );
          const julgadoresSnapshots = await Promise.all(julgadoresPromises);
          const julgadoresData = julgadoresSnapshots
            .filter(doc => doc.exists())
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Julgador[];
          setJulgadores(julgadoresData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do teste');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

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

  const atualizarStatusTeste = async (novoStatus: string) => {
    if (!firebaseApp || !id || !teste) return;

    try {
      const db = getFirestore(firebaseApp);
      await updateDoc(doc(db, 'testes', id), {
        status: novoStatus,
        atualizadoEm: new Date().toISOString()
      });

      setTeste({
        ...teste,
        status: novoStatus,
        atualizadoEm: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setError('Erro ao atualizar status do teste');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex items-center justify-center">
        <p className="text-gray-600">Carregando dados do teste...</p>
      </div>
    );
  }

  if (error || !teste) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error || 'Erro ao carregar teste'}</p>
        <button
          onClick={() => navigate('/testesAnalista')}
          className="text-[#8BA989] hover:underline"
        >
          Voltar para lista de testes
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Detalhes do Teste</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/testesAnalista')}
              className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              Voltar
            </button>
            <button
              onClick={() => setEditando(!editando)}
              className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              {editando ? 'Cancelar Edição' : 'Editar Teste'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Status do Teste */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#8BA989] mb-2">{teste.produto}</h2>
              <p className="text-gray-600">Status: {teste.status}</p>
            </div>
            <div className="flex gap-2">
              {teste.status === 'pendente' && (
                <button
                  onClick={() => atualizarStatusTeste('em_andamento')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Iniciar Teste
                </button>
              )}
              {teste.status === 'em_andamento' && (
                <button
                  onClick={() => atualizarStatusTeste('concluido')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Concluir Teste
                </button>
              )}
              {teste.status === 'concluido' && (
                <button
                  onClick={() => navigate(`/resultadoTesteAnalista/${teste.id}`)}
                  className="bg-[#8BA989] text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Ver Resultados
                </button>
              )}
            </div>
          </div>

          {/* Dados do Produto */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#8BA989] mb-4">Dados do Produto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><span className="font-medium">Fabricante:</span> {teste.fabricante}</p>
                <p className="text-gray-600"><span className="font-medium">Tipo de Embalagem:</span> {teste.tipoEmbalagem}</p>
                <p className="text-gray-600"><span className="font-medium">Peso:</span> {teste.pesoProduto}</p>
              </div>
              <div>
                <p className="text-gray-600"><span className="font-medium">Data de Fabricação:</span> {formatarData(teste.dataFabricacao)}</p>
                <p className="text-gray-600"><span className="font-medium">Data de Validade:</span> {formatarData(teste.dataValidade)}</p>
              </div>
            </div>
          </div>

          {/* Dados do Teste */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#8BA989] mb-4">Dados do Teste</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><span className="font-medium">Data:</span> {formatarData(teste.dataTeste)}</p>
                <p className="text-gray-600"><span className="font-medium">Horário:</span> {teste.horarioTeste}</p>
                <p className="text-gray-600"><span className="font-medium">Local:</span> {teste.localTeste}</p>
              </div>
              <div>
                <p className="text-gray-600"><span className="font-medium">Tipo de Teste:</span> {traduzirTipoTeste(teste.tipoTeste)}</p>
                <p className="text-gray-600"><span className="font-medium">Análise Estatística:</span> {traduzirAnaliseEstatistica(teste.tipoAnaliseEstatistica)}</p>
                <p className="text-gray-600"><span className="font-medium">Quantidade de Avaliadores:</span> {teste.quantidadeAvaliadores}</p>
              </div>
            </div>
          </div>

          {/* Atributos Avaliados */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#8BA989] mb-4">Atributos Avaliados</h3>
            <div className="flex flex-wrap gap-2">
              {teste.atributosAvaliados.map((atributo) => (
                <span 
                  key={atributo}
                  className="bg-[#8BA989] text-white px-3 py-1 rounded-full text-sm"
                >
                  {atributo}
                </span>
              ))}
            </div>
          </div>

          {/* Julgadores */}
          <div>
            <h3 className="text-lg font-medium text-[#8BA989] mb-4">Julgadores Participantes</h3>
            {julgadores.length === 0 ? (
              <p className="text-gray-600">Nenhum julgador atribuído ainda.</p>
            ) : (
              <div className="space-y-4">
                {julgadores.map((julgador) => (
                  <div 
                    key={julgador.id}
                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                  >
                    <div>
                      <p className="font-medium text-[#8BA989]">{julgador.nome}</p>
                      <p className="text-gray-600">{julgador.email}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/julgadorAnalista/${julgador.id}`)}
                      className="text-[#8BA989] hover:underline"
                    >
                      Ver Perfil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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