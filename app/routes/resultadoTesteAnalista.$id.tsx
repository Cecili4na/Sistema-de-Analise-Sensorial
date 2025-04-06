import { useNavigate, useParams } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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
  respostas?: {
    julgadorId: string;
    nomeJulgador: string;
    notas: { [atributo: string]: number };
    comentarios?: string;
    intencaoCompra?: string;
    dataAvaliacao: string;
  }[];
  totalRespostas?: number;
  dataConclusao?: string;
}

export default function TestResults() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [teste, setTeste] = useState<Teste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      if (!firebaseApp || !id) return;

      try {
        const db = getFirestore(firebaseApp);
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

  const calcularMediaNotas = (atributo: string) => {
    if (!teste?.respostas || teste.respostas.length === 0) return 0;
    
    const soma = teste.respostas.reduce((acc, resposta) => acc + resposta.notas[atributo], 0);
    return (soma / teste.respostas.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex items-center justify-center">
        <p className="text-gray-600">Carregando resultados...</p>
      </div>
    );
  }

  if (error || !teste) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error || 'Erro ao carregar resultados'}</p>
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
          <h1 className="text-xl font-bold">Resultados do Teste</h1>
          <button
            onClick={() => navigate('/testesAnalista')}
            className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Informações do Teste */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#8BA989] mb-2">{teste.produto}</h2>
            <p className="text-gray-600">
              Data do Teste: {formatarData(teste.dataTeste)}<br />
              Local: {teste.localTeste}<br />
              Total de Respostas: {teste.totalRespostas || 0} de {teste.quantidadeAvaliadores}
            </p>
          </div>

          {/* Médias por Atributo */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#8BA989] mb-4">Médias por Atributo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teste.atributosAvaliados.map((atributo) => (
                <div key={atributo} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#8BA989]">{atributo}</h4>
                  <p className="text-2xl font-bold text-gray-700 mt-2">
                    {calcularMediaNotas(atributo)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Respostas Detalhadas */}
          <div>
            <h3 className="text-lg font-medium text-[#8BA989] mb-4">Respostas Detalhadas</h3>
            <div className="space-y-4">
              {teste.respostas?.map((resposta, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-700">{resposta.nomeJulgador}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(resposta.dataAvaliacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Notas:</h5>
                      {Object.entries(resposta.notas).map(([atributo, nota]) => (
                        <div key={atributo} className="flex justify-between text-sm">
                          <span className="text-gray-600">{atributo}:</span>
                          <span className="font-medium">{nota}</span>
                        </div>
                      ))}
                    </div>
                    
                    {resposta.intencaoCompra && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-1">Intenção de Compra:</h5>
                        <p className="text-sm">{resposta.intencaoCompra}</p>
                      </div>
                    )}
                  </div>

                  {resposta.comentarios && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Comentários:</h5>
                      <p className="text-sm text-gray-600">{resposta.comentarios}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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