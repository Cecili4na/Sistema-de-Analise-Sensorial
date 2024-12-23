
import { Link, useNavigate } from 'react-router-dom';

const AnalystMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#8BA989]">Menu do Analista</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#8BA989] hover:bg-[#6a7a6a] text-white rounded-lg"
          >
            Voltar
          </button>
        </div>
        <div className="space-y-4">
          <Link
            to="/perfilAnalista"
            className="bg-[#8BA989] hover:bg-[#6a7a6a] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Perfil
          </Link>
          <Link
            to="/testesAnalista"
            className="bg-[#8BA989] hover:bg-[#6a7a6a] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Testes
          </Link>
          <Link
            to="/listaJulgadoresAnalista"
            className="bg-[#8BA989] hover:bg-[#6a7a6a] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Julgadores
          </Link>
          <Link
            to="/teoriaAnalista"
            className="bg-[#8BA989] hover:bg-[#6a7a6a] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Teoria
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalystMenu;