
import { Link, useNavigate } from 'react-router-dom';

const ProducerMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#A0522D]">Menu do Produtor</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#A0522D] hover:bg-[#8B4513] text-white rounded-lg"
          >
            Voltar
          </button>
        </div>
        <div className="space-y-4">
          <Link
            to="/perfilProdutor"
            className="bg-[#A0522D] hover:bg-[#8B4513] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Perfil
          </Link>
          <Link
            to="/listaAnalistasProdutor"
            className="bg-[#A0522D] hover:bg-[#8B4513] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Analistas Sensoriais
          </Link>
          <Link
            to="/testesProdutor"
            className="bg-[#A0522D] hover:bg-[#8B4513] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Testes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProducerMenu;