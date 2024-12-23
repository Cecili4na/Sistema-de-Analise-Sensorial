import {  useNavigate } from '@remix-run/react';

export default function AnalystTheory() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Teoria</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-[#8BA989] font-medium text-lg">Testes Afetivos - Escala Hedônica</h2>
            <p>
              Os testes afetivos são responsáveis pelas expressões subjetivas dos
              provadores, quando revelam se o alimento julgado agrada, se é aceito, ou
              se é preferido com relação a outro. Têm como objetivo apontar o nível de
              aceitação pelos consumidores de um ou de mais produtos.
            </p>
            <p>
              A Escala Hedônica, um deles, é o teste mais usado pelos desenvolvedores
              de novos alimentos, com relação a sua aceitabilidade. Durante sua
              aplicação, os provadores indicam a intensidade do quanto
              gostaram/desgostaram de cada amostra recebida. Na ficha de avaliação há
              uma escala com o máximo e mínimo de impressão de determinado atributo,
              com n posições, de acordo com determinado pela equipe elaboradora do
              teste.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}