import { useNavigate, useParams } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseApp } from '~/lib/firebase.client';

interface Julgador {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  dataCadastro: string;
  telefone?: string;
  idade?: number;
  genero?: string;
  experiencia?: string;
  restricoesAlimentares?: string[];
  alergias?: string[];
  disponibilidade?: string;
  observacoes?: string;
}

interface TesteParticipado {
  id: string;
  produto: string;
  dataTeste: string;
  status: string;
  resultado?: string;
}

export default function JudgeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [julgador, setJulgador] = useState<Julgador | null>(null);
  const [testes, setTestes] = useState<TesteParticipado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      if (!firebaseApp || !id) return;

      try {
        const db = getFirestore(firebaseApp);
        
        // Carregar dados do julgador
        const julgadorDoc = await getDoc(doc(db, 'julgadores', id));
        if (!julgadorDoc.exists()) {
          setError('Julgador não encontrado');
          setLoading(false);
          return;
        }

        setJulgador({
          id: julgadorDoc.id,
          ...julgadorDoc.data()
        } as Julgador);

        // Carregar testes que o julgador participou
        const testesRef = collection(db, 'testes');
        const q = query(testesRef, where('judgeIds', 'array-contains', id));
        const testesSnapshot = await getDocs(q);
        
        const testesData = testesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TesteParticipado[];

        setTestes(testesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do julgador');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex items-center justify-center">
        <p className="text-gray-600">Carregando dados do julgador...</p>
      </div>
    );
  }

  if (error || !julgador) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error || 'Erro ao carregar julgador'}</p>
        <button
          onClick={() => navigate('/listaJulgadoresAnalista')}
          className="text-[#8BA989] hover:underline"
        >
          Voltar para lista de julgadores
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Detalhes do Julgador</h1>
          <button
            onClick={() => navigate('/listaJulgadoresAnalista')}
            className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Informações Básicas */}
          <div className="flex items-start gap-6 mb-8">
            <img 
              src={julgador.foto || "/avatar.png"} 
              alt={`Foto de ${julgador.nome}`} 
              className="w-32 h-32 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-[#8BA989] mb-2">{julgador.nome}</h2>
              <p className="text-gray-600">{julgador.email}</p>
              <p className="text-gray-500">Cadastrado em: {formatarData(julgador.dataCadastro)}</p>
              {julgador.telefone && (
                <p className="text-gray-600 mt-2">Telefone: {julgador.telefone}</p>
              )}
            </div>
          </div>

          {/* Informações Detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-medium text-[#8BA989] mb-3">Informações Pessoais</h3>
              <div className="space-y-2">
                {julgador.idade && <p className="text-gray-600">Idade: {julgador.idade} anos</p>}
                {julgador.genero && <p className="text-gray-600">Gênero: {julgador.genero}</p>}
                {julgador.experiencia && (
                  <p className="text-gray-600">Experiência: {julgador.experiencia}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#8BA989] mb-3">Informações Alimentares</h3>
              <div className="space-y-2">
                {julgador.restricoesAlimentares && julgador.restricoesAlimentares.length > 0 && (
                  <div>
                    <p className="text-gray-600">Restrições Alimentares:</p>
                    <ul className="list-disc list-inside">
                      {julgador.restricoesAlimentares.map((restricao, index) => (
                        <li key={index} className="text-gray-600">{restricao}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {julgador.alergias && julgador.alergias.length > 0 && (
                  <div>
                    <p className="text-gray-600">Alergias:</p>
                    <ul className="list-disc list-inside">
                      {julgador.alergias.map((alergia, index) => (
                        <li key={index} className="text-gray-600">{alergia}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Disponibilidade e Observações */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#8BA989] mb-3">Informações Adicionais</h3>
            {julgador.disponibilidade && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Disponibilidade:</span> {julgador.disponibilidade}
              </p>
            )}
            {julgador.observacoes && (
              <p className="text-gray-600">
                <span className="font-medium">Observações:</span> {julgador.observacoes}
              </p>
            )}
          </div>

          {/* Histórico de Testes */}
          <div>
            <h3 className="text-lg font-medium text-[#8BA989] mb-4">Histórico de Testes</h3>
            {testes.length === 0 ? (
              <p className="text-gray-600">Nenhum teste realizado ainda.</p>
            ) : (
              <div className="space-y-4">
                {testes.map((teste) => (
                  <div 
                    key={teste.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-[#8BA989]">{teste.produto}</h4>
                        <p className="text-gray-600">Data: {formatarData(teste.dataTeste)}</p>
                        <p className="text-gray-600">Status: {teste.status}</p>
                        {teste.resultado && (
                          <p className="text-gray-600">Resultado: {teste.resultado}</p>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/testeAnalista/${teste.id}`)}
                        className="text-[#8BA989] hover:underline"
                      >
                        Ver Detalhes
                      </button>
                    </div>
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