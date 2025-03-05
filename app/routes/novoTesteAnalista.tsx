import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from '~/lib/firebase.client';
import { getAuth } from 'firebase/auth';

export default function NewTest() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState({
    aroma: false,
    cor: false,
    textura: false,
    sabor: false,
    aparenciaGlobal: false
  });

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
      atributosAvaliados: Object.entries(selectedAttributes)
        .filter(([_, value]) => value)
        .map(([key]) => key),
      tipoAnaliseEstatistica: formData.get('tipoAnaliseEstatistica'),
      status: 'pendente',
      dataCriacao: new Date().toISOString(),
      analistaId: user.uid,
      // Campos adicionais para controle
      criadoPor: user.email,
      atualizadoEm: new Date().toISOString()
    };

    try {
      const db = getFirestore(firebaseApp);
      await addDoc(collection(db, 'testes'), testData);
      navigate('/testesAnalista');
    } catch (error) {
      console.error('Erro ao criar teste:', error);
      if (error instanceof Error) {
        setError(`Erro ao criar teste: ${error.message}`);
      } else {
        setError('Erro ao criar teste. Por favor, tente novamente.');
      }
    }
  };

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
        <div className="bg-white shadow-lg rounded-lg p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-[#8BA989] font-medium text-lg mb-4">DADOS DO PRODUTO:</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="produto" className="block mb-1">Produto</label>
                <input 
                  id="produto" 
                  name="produto" 
                  type="text" 
                  required
                  className="w-full border rounded p-2"
                  title="Nome do produto"
                  placeholder="Ex: Queijo de Cabra"
                />
              </div>

              <div>
                <label htmlFor="fabricante" className="block mb-1">Fabricante</label>
                <input 
                  id="fabricante" 
                  name="fabricante" 
                  type="text" 
                  required
                  className="w-full border rounded p-2"
                  title="Nome do fabricante"
                  placeholder="Ex: Laticínios XYZ"
                />
              </div>

              <div>
                <label htmlFor="embalagem" className="block mb-1">Tipo de Embalagem</label>
                <input 
                  id="embalagem" 
                  name="embalagem" 
                  type="text" 
                  required
                  className="w-full border rounded p-2"
                  title="Tipo de embalagem"
                  placeholder="Ex: Plástico a vácuo"
                />
              </div>

              <div>
                <label htmlFor="peso" className="block mb-1">Peso do Produto</label>
                <input 
                  id="peso" 
                  name="peso" 
                  type="text" 
                  required
                  className="w-full border rounded p-2"
                  title="Peso do produto"
                  placeholder="Ex: 500g"
                />
              </div>

              <div>
                <label htmlFor="dataFabricacao" className="block mb-1">Data de Fabricação</label>
                <input 
                  id="dataFabricacao" 
                  name="dataFabricacao" 
                  type="date" 
                  required
                  className="w-full border rounded p-2"
                  title="Data de fabricação do produto"
                />
              </div>

              <div>
                <label htmlFor="dataValidade" className="block mb-1">Data de Validade</label>
                <input 
                  id="dataValidade" 
                  name="dataValidade" 
                  type="date" 
                  required
                  className="w-full border rounded p-2"
                  title="Data de validade do produto"
                />
              </div>
            </div>

            <h2 className="text-[#8BA989] font-medium text-lg mb-4 mt-8">DADOS DO TESTE:</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dataTeste" className="block mb-1">Data do Teste</label>
                <input 
                  id="dataTeste" 
                  name="dataTeste" 
                  type="date" 
                  required
                  className="w-full border rounded p-2"
                  title="Data de realização do teste"
                />
              </div>

              <div>
                <label htmlFor="horarioTeste" className="block mb-1">Horário do Teste</label>
                <input 
                  id="horarioTeste" 
                  name="horarioTeste" 
                  type="time" 
                  required
                  className="w-full border rounded p-2"
                  title="Horário de realização do teste"
                />
              </div>

              <div>
                <label htmlFor="localTeste" className="block mb-1">Local do Teste</label>
                <input 
                  id="localTeste" 
                  name="localTeste" 
                  type="text" 
                  required
                  className="w-full border rounded p-2"
                  title="Local de realização do teste"
                  placeholder="Ex: Laboratório de Análise Sensorial"
                />
              </div>

              <div>
                <label htmlFor="quantidadeAvaliadores" className="block mb-1">Quantidade de Avaliadores</label>
                <input 
                  id="quantidadeAvaliadores" 
                  name="quantidadeAvaliadores" 
                  type="number" 
                  min="1"
                  required
                  className="w-full border rounded p-2"
                  title="Número de avaliadores necessários"
                  placeholder="Ex: 10"
                />
              </div>

              <div>
                <label htmlFor="tipoTeste" className="block mb-1">Tipo do Teste</label>
                <select 
                  id="tipoTeste" 
                  name="tipoTeste" 
                  required
                  className="w-full border rounded p-2"
                  title="Tipo de teste sensorial"
                >
                  <option value="escalaHedonica">Escala Hedônica</option>
                  <option value="comparacaoPareada">Comparação Pareada</option>
                  <option value="ordenacao">Ordenação</option>
                  <option value="aceitacao">Aceitação</option>
                </select>
              </div>

              <div>
                <label htmlFor="tipoAnaliseEstatistica" className="block mb-1">Tipo de Análise Estatística</label>
                <select 
                  id="tipoAnaliseEstatistica" 
                  name="tipoAnaliseEstatistica" 
                  required
                  className="w-full border rounded p-2"
                  title="Tipo de análise estatística"
                >
                  <option value="anova">ANOVA - Análise de Variância</option>
                  <option value="testeMedia">Teste de Média</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="atributosAvaliados" className="block mb-2">Atributos Avaliados:</label>
              <div id="atributosAvaliados" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="aroma" 
                    checked={selectedAttributes.aroma}
                    onChange={(e) => setSelectedAttributes(prev => ({...prev, aroma: e.target.checked}))}
                    className="rounded"
                    title="Avaliar aroma"
                  />
                  <label htmlFor="aroma">Aroma</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="cor" 
                    checked={selectedAttributes.cor}
                    onChange={(e) => setSelectedAttributes(prev => ({...prev, cor: e.target.checked}))}
                    className="rounded"
                    title="Avaliar cor"
                  />
                  <label htmlFor="cor">Cor</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="textura" 
                    checked={selectedAttributes.textura}
                    onChange={(e) => setSelectedAttributes(prev => ({...prev, textura: e.target.checked}))}
                    className="rounded"
                    title="Avaliar textura"
                  />
                  <label htmlFor="textura">Textura</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="sabor" 
                    checked={selectedAttributes.sabor}
                    onChange={(e) => setSelectedAttributes(prev => ({...prev, sabor: e.target.checked}))}
                    className="rounded"
                    title="Avaliar sabor"
                  />
                  <label htmlFor="sabor">Sabor</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="aparenciaGlobal" 
                    checked={selectedAttributes.aparenciaGlobal}
                    onChange={(e) => setSelectedAttributes(prev => ({...prev, aparenciaGlobal: e.target.checked}))}
                    className="rounded"
                    title="Avaliar aparência global"
                  />
                  <label htmlFor="aparenciaGlobal">Aparência Global</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-[#8BA989] text-[#8BA989] rounded-lg hover:bg-[#8BA989] hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#8BA989] text-white rounded-lg hover:bg-[#6E8F6E] transition"
              >
                Confirmar Teste
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