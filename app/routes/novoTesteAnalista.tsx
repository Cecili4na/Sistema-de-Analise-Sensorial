import { useNavigate } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from '~/lib/firebase.client';
import { getAuth } from 'firebase/auth';
import QRCode from 'qrcode';

export default function NewTest() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [testCreated, setTestCreated] = useState(false);
  const [testUrl, setTestUrl] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState({
    aroma: false,
    cor: false,
    textura: false,
    sabor: false,
    aparenciaGlobal: false
  });
  const [customAttributes, setCustomAttributes] = useState<string[]>([]);
  const [newAttribute, setNewAttribute] = useState("");

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

  const handleAddAttribute = () => {
    if (newAttribute.trim()) {
      setCustomAttributes([...customAttributes, newAttribute.trim()]);
      setNewAttribute("");
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  };

  const generateTestUrl = (testId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/responderTeste/${testId}`;
  };

  const generateQRCode = async (url: string) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  };

  useEffect(() => {
    if (testUrl) {
      generateQRCode(testUrl);
    }
  }, [testUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!firebaseApp) {
      setError('Erro de inicialização do Firebase');
      return;
    }

    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    console.log('Criando teste para o usuário:', user.uid);

    const formData = new FormData(e.currentTarget);
    const testData = {
      produto: formData.get('produto'),
      fabricante: formData.get('fabricante'),
      tipoEmbalagem: formData.get('embalagem'),
      pesoProduto: formData.get('peso'),
      dataFabricacao: formData.get('dataFabricacao'),
      dataValidade: formData.get('dataValidade'),
      dataTeste: formData.get('dataTeste'),
      horarioTeste: formData.get('horarioTeste'),
      localTeste: formData.get('localTeste'),
      tipoTeste: formData.get('tipoTeste'),
      quantidadeAvaliadores: Number(formData.get('quantidadeAvaliadores')),
      atributosAvaliados: [
        ...Object.entries(selectedAttributes)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        ...customAttributes
      ],
      status: 'pendente',
      dataCriacao: new Date().toISOString(),
      analistaId: user.uid,
      criadoPor: user.email,
      atualizadoEm: new Date().toISOString(),
      respostas: [],
      totalRespostas: 0
    };

    try {
      console.log('Tentando criar teste pendente com dados:', testData);
      const db = getFirestore(firebaseApp);
      const docRef = await addDoc(collection(db, 'testes_pendentes'), testData);
      console.log('Teste pendente criado com ID:', docRef.id);
      
      const testUrl = generateTestUrl(docRef.id);
      console.log('URL do teste gerada:', testUrl);
      setTestUrl(testUrl);
      setTestCreated(true);
    } catch (error) {
      console.error('Erro detalhado ao criar teste:', error);
      if (error instanceof Error) {
        setError(`Erro ao criar teste: ${error.message}`);
      } else {
        setError('Erro ao criar teste. Por favor, tente novamente.');
      }
    }
  };

  if (testCreated && testUrl) {
    return (
      <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
        <header className="bg-[#8BA989] text-white py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Teste Criado com Sucesso!</h1>
            <button
              onClick={() => navigate('/testesAnalista')}
              className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              Voltar para Testes
            </button>
          </div>
        </header>

        <main className="flex-grow p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#8BA989] mb-4">Link do Teste</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Compartilhe este link com os julgadores:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testUrl}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(testUrl);
                      alert('Link copiado para a área de transferência!');
                    }}
                    className="bg-[#8BA989] text-white px-4 py-2 rounded-lg hover:bg-[#6E8F6E] transition"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#8BA989] mb-4">QR Code</h2>
              <div className="bg-white p-4 rounded-lg inline-block">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code do teste" className="w-48 h-48" />
                )}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Os julgadores podem escanear este QR Code para acessar o teste diretamente
              </p>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/testesAnalista')}
                className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#7a987b] transition-colors"
              >
                Voltar para Lista de Testes
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Cadastrar Novo Teste</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Informações do Produto */}
            <div>
              <h2 className="text-lg font-medium text-[#8BA989] mb-4">Informações do Produto</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="produto" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    id="produto"
                    name="produto"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                    placeholder="Nome do produto"
                  />
                </div>
                <div>
                  <label htmlFor="fabricante" className="block text-sm font-medium text-gray-700 mb-1">
                    Fabricante
                  </label>
                  <input
                    type="text"
                    id="fabricante"
                    name="fabricante"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                    placeholder="Nome do fabricante"
                  />
                </div>
                <div>
                  <label htmlFor="embalagem" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Embalagem
                  </label>
                  <input
                    type="text"
                    id="embalagem"
                    name="embalagem"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                    placeholder="Tipo de embalagem"
                  />
                </div>
                <div>
                  <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                    Peso do Produto
                  </label>
                  <input
                    type="text"
                    id="peso"
                    name="peso"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                    placeholder="Peso do produto"
                  />
                </div>
              </div>
            </div>

            {/* Datas */}
            <div>
              <h2 className="text-lg font-medium text-[#8BA989] mb-4">Datas</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="dataFabricacao" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fabricação
                  </label>
                  <input
                    type="date"
                    id="dataFabricacao"
                    name="dataFabricacao"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                  />
                </div>
                <div>
                  <label htmlFor="dataValidade" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Validade
                  </label>
                  <input
                    type="date"
                    id="dataValidade"
                    name="dataValidade"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                  />
                </div>
                <div>
                  <label htmlFor="dataTeste" className="block text-sm font-medium text-gray-700 mb-1">
                    Data do Teste
                  </label>
                  <input
                    type="date"
                    id="dataTeste"
                    name="dataTeste"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                  />
                </div>
                <div>
                  <label htmlFor="horarioTeste" className="block text-sm font-medium text-gray-700 mb-1">
                    Horário do Teste
                  </label>
                  <input
                    type="time"
                    id="horarioTeste"
                    name="horarioTeste"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                  />
                </div>
              </div>
            </div>

            {/* Local e Tipo de Teste */}
            <div>
              <h2 className="text-lg font-medium text-[#8BA989] mb-4">Local e Tipo de Teste</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="localTeste" className="block text-sm font-medium text-gray-700 mb-1">
                    Local do Teste
                  </label>
                  <input
                    type="text"
                    id="localTeste"
                    name="localTeste"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                    placeholder="Local onde será realizado o teste"
                  />
                </div>
                <div>
                  <label htmlFor="tipoTeste" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Teste
                  </label>
                  <select
                    id="tipoTeste"
                    name="tipoTeste"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                  >
                    <option value="">Selecione o tipo de teste</option>
                    <option value="descritivo">Descritivo</option>
                    <option value="afetivo">Afetivo</option>
                    <option value="discriminativo">Discriminativo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantidadeAvaliadores" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade de Avaliadores
                  </label>
                  <input
                    type="number"
                    id="quantidadeAvaliadores"
                    name="quantidadeAvaliadores"
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                    placeholder="Número de avaliadores"
                  />
                </div>
              </div>
            </div>

            {/* Atributos a Serem Avaliados */}
            <div>
              <h2 className="text-lg font-medium text-[#8BA989] mb-4">Atributos a Serem Avaliados</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAttributes.aroma}
                      onChange={(e) => setSelectedAttributes({ ...selectedAttributes, aroma: e.target.checked })}
                      className="rounded text-[#8BA989] focus:ring-[#8BA989]"
                    />
                    <span>Aroma</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAttributes.cor}
                      onChange={(e) => setSelectedAttributes({ ...selectedAttributes, cor: e.target.checked })}
                      className="rounded text-[#8BA989] focus:ring-[#8BA989]"
                    />
                    <span>Cor</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAttributes.textura}
                      onChange={(e) => setSelectedAttributes({ ...selectedAttributes, textura: e.target.checked })}
                      className="rounded text-[#8BA989] focus:ring-[#8BA989]"
                    />
                    <span>Textura</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAttributes.sabor}
                      onChange={(e) => setSelectedAttributes({ ...selectedAttributes, sabor: e.target.checked })}
                      className="rounded text-[#8BA989] focus:ring-[#8BA989]"
                    />
                    <span>Sabor</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAttributes.aparenciaGlobal}
                      onChange={(e) => setSelectedAttributes({ ...selectedAttributes, aparenciaGlobal: e.target.checked })}
                      className="rounded text-[#8BA989] focus:ring-[#8BA989]"
                    />
                    <span>Aparência Global</span>
                  </label>
                </div>

                {/* Atributos Personalizados */}
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Atributos Personalizados</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAttribute}
                      onChange={(e) => setNewAttribute(e.target.value)}
                      placeholder="Digite um novo atributo"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                    />
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="bg-[#8BA989] text-white px-4 py-2 rounded-lg hover:bg-[#6E8F6E] transition"
                    >
                      Adicionar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {customAttributes.map((attr, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{attr}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#7a987b] transition-colors"
              >
                Criar Teste
              </button>
            </div>
          </form>
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