export default function SensoryAnalystsList() {
  return (
    <div className="bg-[#F0F0E5] min-h-screen">
      <header className="bg-[#8B4513] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Analistas Sensoriais</h1>
        <button onClick={() => window.history.back()} className="bg-[#A0522D] px-4 py-2 rounded hover:opacity-90">
          Voltar
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded p-6">
          <h2 className="bg-[#8B4513] text-white px-2 py-1 text-lg mb-4">ANALISTAS SENSORIAIS CADASTRADOS</h2>
          
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">João Silva</p>
              <p className="text-sm text-gray-500 mt-1">Em atividade</p>
            </div>

            <div className="border-b pb-2">
              <p className="font-medium">Maria Santos</p>
              <p className="text-sm text-gray-500 mt-1">Em atividade</p>
            </div>

            <div className="border-b pb-2">
              <p className="font-medium">Pedro Oliveira</p>
              <p className="text-sm text-gray-500 mt-1">Em atividade</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}