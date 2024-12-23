
import { Link, useNavigate } from 'react-router-dom';

const JudgeMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#C4A484]">Menu do Julgador</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#C4A484] hover:bg-[#a38562] text-white rounded-lg"
          >
            Voltar
          </button>
        </div>
        <div className="space-y-4">
          <Link
            to="/perfilJulgador"
            className="bg-[#C4A484] hover:bg-[#a38562] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Perfil
          </Link>
          <Link
            to="/testesJulgador"
            className="bg-[#C4A484] hover:bg-[#a38562] text-white font-medium py-3 px-6 rounded-lg block text-center"
          >
            Testes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JudgeMenu;