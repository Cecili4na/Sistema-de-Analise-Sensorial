import React, { useEffect, useState } from 'react';
import { getFirestore, getDoc, doc, setDoc, deleteDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { firebaseApp } from '~/lib/firebase.client';
import { useNavigate, useParams } from '@remix-run/react';

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
  respostas: any[];
  totalRespostas: number;
}

const ResponderTeste: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [teste, setTeste] = useState<Teste | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [respostas, setRespostas] = useState<{ [key: string]: number }>({});
  const [comentarios, setComentarios] = useState('');
  const [nomeJulgador, setNomeJulgador] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [intencaoCompra, setIntencaoCompra] = useState<string>('');
  const [termosAceitos, setTermosAceitos] = useState<boolean>(false);

  useEffect(() => {
    const carregarTeste = async () => {
      if (!firebaseApp || !id) {
        setError('Erro ao carregar o teste');
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore(firebaseApp);
        const testeRef = doc(db, 'testes_pendentes', id);
        const testeDoc = await getDoc(testeRef);
        
        if (!testeDoc.exists()) {
          setError('Teste não encontrado');
          setLoading(false);
          return;
        }

        const dados = testeDoc.data();
        const testeData = {
          id: testeDoc.id,
          ...dados
        } as Teste;

        setTeste(testeData);

        // Inicializar respostas com 0 para cada atributo
        const respostasIniciais: { [key: string]: number } = {};
        testeData.atributosAvaliados.forEach(atributo => {
          respostasIniciais[atributo] = 0;
        });
        setRespostas(respostasIniciais);
      } catch (error) {
        console.error('Erro ao carregar teste:', error);
        setError('Erro ao carregar dados do teste');
      } finally {
        setLoading(false);
      }
    };

    carregarTeste();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teste || !firebaseApp || !nomeJulgador.trim()) {
      setError('Por favor, preencha seu nome');
      return;
    }

    try {
      const db = getFirestore(firebaseApp);
      
      // Verificar se o teste ainda existe e está pendente
      const testeRef = doc(db, 'testes_pendentes', teste.id);
      const testeDoc = await getDoc(testeRef);
      
      if (!testeDoc.exists()) {
        setError('Este teste não está mais disponível para respostas');
        return;
      }

      // Criar a nova resposta
      const novaResposta = {
        notas: respostas,
        comentarios,
        nomeJulgador: nomeJulgador.trim(),
        dataAvaliacao: new Date().toISOString(),
        intencaoCompra
      };

      // Se atingiu o número máximo de respostas, mover para testes confirmados
      const dadosAtualizados = testeDoc.data();
      if (dadosAtualizados.totalRespostas >= teste.quantidadeAvaliadores) {
        const testeConfirmado = {
          ...dadosAtualizados,
          status: 'confirmado',
          dataConclusao: new Date().toISOString(),
          analistaId: teste.analistaId,
          criadoPor: teste.criadoPor
        };
        
        // Salvar na coleção de testes confirmados
        await setDoc(doc(db, 'testes', teste.id), testeConfirmado);
        
        // Deletar o teste pendente
        await deleteDoc(testeRef);
      } else {
        // Se ainda não atingiu o número máximo, apenas atualizar o teste pendente
        await updateDoc(testeRef, {
          respostas: arrayUnion(novaResposta),
          totalRespostas: increment(1),
          atualizadoEm: new Date().toISOString()
        });
      }

      setEnviado(true);
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      setError('Erro ao enviar resposta. Por favor, tente novamente.');
    }
  };

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      {!termosAceitos ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">Termos e Permissões</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Bem-vindo(a) ao teste sensorial. Antes de prosseguir, é importante que você esteja ciente dos seguintes pontos:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Seus dados e respostas serão utilizados exclusivamente para fins de pesquisa</li>
                <li>As informações fornecidas serão tratadas com confidencialidade</li>
                <li>Os resultados serão utilizados de forma agregada, sem identificação individual</li>
                <li>Você tem o direito de recusar participar do teste a qualquer momento</li>
                <li>Ao prosseguir, você concorda com o uso dos dados fornecidos para fins de pesquisa</li>
              </ul>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Não aceito
                </button>
                <button
                  onClick={() => setTermosAceitos(true)}
                  className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#7a987b] transition-colors"
                >
                  Aceito os termos
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Responder Teste Sensorial</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando teste...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : teste && !enviado ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nomeJulgador" className="block text-sm font-medium text-gray-700 mb-1">
                  Seu Nome*
                </label>
                <input
                  type="text"
                  id="nomeJulgador"
                  value={nomeJulgador}
                  onChange={(e) => setNomeJulgador(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                  required
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-medium text-[#8BA989] mb-4">Informações do Teste</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Produto</p>
                    <p className="font-medium">{teste.produto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fabricante</p>
                    <p className="font-medium">{teste.fabricante}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Embalagem</p>
                    <p className="font-medium">{teste.tipoEmbalagem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Peso do Produto</p>
                    <p className="font-medium">{teste.pesoProduto}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-[#8BA989] mb-4">Avaliação dos Atributos</h2>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Legenda da Avaliação:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>1 - Desgostei muito</div>
                    <div>2 - Desgostei ligeiramente</div>
                    <div>3 - Indiferente</div>
                    <div>4 - Gostei ligeiramente</div>
                    <div>5 - Gostei muito</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {teste.atributosAvaliados.map((atributo) => (
                    <div key={atributo} className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {atributo.charAt(0).toUpperCase() + atributo.slice(1)}
                      </label>
                      <div className="flex items-center space-x-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((nota) => (
                          <label key={nota} className="flex items-center">
                            <input
                              type="radio"
                              name={atributo}
                              value={nota}
                              checked={respostas[atributo] === nota}
                              onChange={(e) => setRespostas({ ...respostas, [atributo]: Number(e.target.value) })}
                              className="h-4 w-4 text-[#8BA989] focus:ring-[#8BA989]"
                              required
                            />
                            <span className="ml-1 text-sm text-gray-700">{nota}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-[#8BA989] mb-4">Intenção de Compra</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Se eu encontrasse o produto {teste.produto} à venda eu:
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="intencaoCompra"
                        value="certamente_compraria"
                        checked={intencaoCompra === "certamente_compraria"}
                        onChange={(e) => setIntencaoCompra(e.target.value)}
                        className="h-4 w-4 text-[#8BA989] focus:ring-[#8BA989]"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">Certamente compraria</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="intencaoCompra"
                        value="provavelmente_compraria"
                        checked={intencaoCompra === "provavelmente_compraria"}
                        onChange={(e) => setIntencaoCompra(e.target.value)}
                        className="h-4 w-4 text-[#8BA989] focus:ring-[#8BA989]"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">Provavelmente compraria</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="intencaoCompra"
                        value="tenho_duvidas"
                        checked={intencaoCompra === "tenho_duvidas"}
                        onChange={(e) => setIntencaoCompra(e.target.value)}
                        className="h-4 w-4 text-[#8BA989] focus:ring-[#8BA989]"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">Tenho dúvidas se compraria</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="intencaoCompra"
                        value="provavelmente_nao_compraria"
                        checked={intencaoCompra === "provavelmente_nao_compraria"}
                        onChange={(e) => setIntencaoCompra(e.target.value)}
                        className="h-4 w-4 text-[#8BA989] focus:ring-[#8BA989]"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">Provavelmente não compraria</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="intencaoCompra"
                        value="certamente_nao_compraria"
                        checked={intencaoCompra === "certamente_nao_compraria"}
                        onChange={(e) => setIntencaoCompra(e.target.value)}
                        className="h-4 w-4 text-[#8BA989] focus:ring-[#8BA989]"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">Certamente não compraria</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-[#8BA989] mb-4">Comentários Adicionais</h2>
                <textarea
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                  rows={4}
                  placeholder="Digite seus comentários sobre o produto..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#7a987b] transition-colors"
                >
                  Enviar Resposta
                </button>
              </div>
            </form>
          ) : enviado ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-[#8BA989] mb-4">Resposta Enviada com Sucesso!</h2>
              <p className="text-gray-600 mb-4">Obrigado por participar do teste sensorial.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#7a987b] transition-colors"
              >
                Voltar para a Página Inicial
              </button>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </div>
      </footer>
    </div>
  );
};

export default ResponderTeste; 