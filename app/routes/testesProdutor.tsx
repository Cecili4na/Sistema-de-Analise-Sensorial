export default function TestsList() {
    return (
      <div className="bg-[#F0F0E5] min-h-screen">
        <header className="bg-[#8B4513] text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Testes Cadastrados</h1>
          <button onClick={() => window.history.back()} className="bg-[#A0522D] px-4 py-2 rounded hover:opacity-90">
            Voltar
          </button>
        </header>
  
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white shadow-lg rounded p-6">
            <h2 className="bg-[#8B4513] text-white px-2 py-1 text-lg mb-4">TESTES EM ANDAMENTO</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <p className="font-medium">Iogurte Sabor Morango</p>
                <div className="ml-4 mt-2 space-y-1">
                  <p>DATA: 12/02/2024</p>
                  <p>LOCAL: Laboratório 1</p>
                  <p>STATUS: Em análise</p>
                  <button className="text-[#8B4513] hover:underline mt-2">
                    Ver detalhes
                  </button>
                </div>
              </div>
  
              <div className="border-b pb-4">
                <p className="font-medium">Queijo Tipo Coalho</p>
                <div className="ml-4 mt-2 space-y-1">
                  <p>DATA: 15/02/2024</p>
                  <p>LOCAL: Laboratório 2</p>
                  <p>STATUS: Aguardando julgadores</p>
                  <button className="text-[#8B4513] hover:underline mt-2">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
  
            <h2 className="bg-[#8B4513] text-white px-2 py-1 text-lg mb-4 mt-8">TESTES CONCLUÍDOS</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4 opacity-75">
                <p className="font-medium">Bebida Láctea Fermentada</p>
                <div className="ml-4 mt-2 space-y-1">
                  <p>DATA: 20/02/2024</p>
                  <p>LOCAL: Laboratório 1</p>
                  <p>STATUS: Concluído</p>
                  <button className="text-[#8B4513] hover:underline mt-2">
                    Ver relatório
                  </button>
                </div>
              </div>
  
              <div className="border-b pb-4 opacity-75">
                <p className="font-medium">Requeijão Cremoso</p>
                <div className="ml-4 mt-2 space-y-1">
                  <p>DATA: 25/02/2024</p>
                  <p>LOCAL: Laboratório 3</p>
                  <p>STATUS: Concluído</p>
                  <button className="text-[#8B4513] hover:underline mt-2">
                    Ver relatório
                  </button>
                </div>
              </div>
            </div>
  
            <div className="mt-6 flex justify-end">
              <button className="bg-[#8B4513] text-white px-4 py-2 rounded hover:opacity-90">
                Cadastrar Novo Teste
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }