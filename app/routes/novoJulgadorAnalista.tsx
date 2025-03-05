import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from '~/lib/firebase.client';

export default function NewJudge() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!firebaseApp) {
      setError('Erro de inicialização do Firebase');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const julgadorData = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      telefone: formData.get('telefone'),
      dataCadastro: new Date().toISOString(),
      testesParticipados: []
    };

    try {
      const db = getFirestore(firebaseApp);
      await addDoc(collection(db, 'julgadores'), julgadorData);
      navigate('/listaJulgadoresAnalista');
    } catch (error) {
      console.error('Erro ao cadastrar julgador:', error);
      if (error instanceof Error) {
        setError(`Erro ao cadastrar julgador: ${error.message}`);
      } else {
        setError('Erro ao cadastrar julgador. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Cadastrar Novo Julgador</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-[#8BA989] mb-4">Informações Básicas</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="w-full">
                  <label htmlFor="nome" className="block mb-1 text-sm font-medium">Nome Completo</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    className="w-full border rounded p-2 text-base"
                    placeholder="Nome do julgador"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="email" className="block mb-1 text-sm font-medium">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border rounded p-2 text-base"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="telefone" className="block mb-1 text-sm font-medium">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    className="w-full border rounded p-2 text-base"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#7a987b] transition-colors"
              >
                Cadastrar Julgador
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