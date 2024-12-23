import { useNavigate } from '@remix-run/react';

export default function NewTest() {
  const navigate = useNavigate();

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
          <form className="space-y-4">
            <h2 className="text-[#8BA989] font-medium text-lg mb-4">DADOS DO PRODUTO:</h2>
            
            <div className="grid gap-4">
              <div>
                <label htmlFor="produto" className="block mb-1">PRODUTO</label>
                <input id="produto" type="text" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="fabricante" className="block mb-1">FABRICANTE</label>
                <input id="fabricante" type="text" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="embalagem" className="block mb-1">TIPO DE EMBALAGEM</label>
                <input id="embalagem" type="text" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="peso" className="block mb-1">PESO DO PRODUTO</label>
                <input id="peso" type="text" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="dataFabricacao" className="block mb-1">DATA DE FABRICAÇÃO DO PRODUTO</label>
                <input id="dataFabricacao" type="date" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="dataValidade" className="block mb-1">DATA DE VALIDADE DO PRODUTO</label>
                <input id="dataValidade" type="date" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="dataTeste" className="block mb-1">DATA DO TESTE</label>
                <input id="dataTeste" type="date" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="horarioTeste" className="block mb-1">HORÁRIO DO TESTE</label>
                <input id="horarioTeste" type="time" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="localTeste" className="block mb-1">LOCAL DO TESTE</label>
                <input id="localTeste" type="text" className="w-full border rounded p-2" />
              </div>

              <div>
                <label htmlFor="tipoTeste" className="block mb-1">TIPO DO TESTE:</label>
                <div className="flex items-center gap-2">
                  <input id="tipoTeste" type="checkbox" defaultChecked />
                  <label htmlFor="tipoTeste">ESCALA HEDÔNICA</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-[#8BA989] hover:opacity-90 text-white px-6 py-2 rounded-lg">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}