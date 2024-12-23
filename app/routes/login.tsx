import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from '@remix-run/react';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || '';

  const themeColor = {
    'produtor': {
      bg: 'bg-[#A0522D]',
      hover: 'hover:bg-[#8B4513]',
      text: 'text-[#A0522D]'
    },
    'analista': {
      bg: 'bg-[#8BA989]',
      hover: 'hover:bg-[#6E8F6E]',
      text: 'text-[#8BA989]'
    },
    'julgador': {
      bg: 'bg-[#C4A484]',
      hover: 'hover:bg-[#B08B64]',
      text: 'text-[#C4A484]'
    }
  }[role] || { bg: 'bg-[#8BA989]', hover: 'hover:bg-[#6E8F6E]', text: 'text-[#8BA989]' };

  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Fake login logic
      switch (role) {
        case 'produtor':
          navigate('/menuProdutor');
          break;
        case 'analista':
          navigate('/menuAnalista');
          break;
        case 'julgador':
          navigate('/menuJulgador');
          break;
        default:
          setError('Tipo de usuário inválido');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0E5] flex flex-col">
      <header className={`${themeColor.bg} text-white py-4`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/">
            <img 
              src="/logo-panc.png" 
              alt="PANC - Plataforma de Análise Sensorial"
              className="h-16 mx-auto mb-2"
            />
          </Link>
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 ${themeColor.bg} ${themeColor.hover} text-white rounded-lg`}
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className={`${themeColor.bg} text-white p-6 rounded-t-lg text-center`}>
            <h1 className="text-2xl font-bold">
              Login - {role.charAt(0).toUpperCase() + role.slice(1)}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-lg shadow-lg">
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-600 rounded text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-[#4A4A4A] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-[#4A4A4A] mb-2">
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className={`w-full ${themeColor.bg} ${themeColor.hover} text-white p-3 rounded 
                  transition flex items-center justify-center`}
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <p className="text-[#6C7878]">
                Não tem uma conta?{' '}
                <Link 
                  to={`/cadastro`}
                  className={`${themeColor.text} hover:underline`}
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      <footer className={`${themeColor.bg} text-white py-4 text-center text-sm`}>
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}