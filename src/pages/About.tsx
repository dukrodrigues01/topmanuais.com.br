import { BookOpen, Users, Download, Award, CheckCircle } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { stats } from '@/data/mockData';

export function About() {
  const values = [
    {
      title: 'Qualidade',
      description: 'Todos os manuais são verificados e revisados para garantir informações precisas e completas.',
    },
    {
      title: 'Acessibilidade',
      description: 'Preços justos e acessíveis para que todos possam ter acesso à documentação técnica necessária.',
    },
    {
      title: 'Agilidade',
      description: 'Download imediato após a compra, sem espera e burocracia.',
    },
    {
      title: 'Suporte',
      description: 'Equipe dedicada pronta para ajudar com qualquer dúvida ou problema.',
    },
  ];

  const differentials = [
    'Mais de 10.000 manuais disponíveis',
    'Download instantâneo 24/7',
    'Preços a partir de R$ 5,00',
    'Garantia de 30 dias',
    'Suporte técnico especializado',
    'Atualizações constantes',
    'Interface intuitiva e fácil de usar',
    'Pagamento 100% seguro',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-[70px]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0040ff] via-[#007fff] to-[#00bfff] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Sobre a TopManuais
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Somos a maior plataforma de manuais técnicos do Brasil. 
                Nossa missão é democratizar o acesso à informação técnica, 
                ajudando pessoas a resolverem problemas e economizarem dinheiro.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-[#007fff]" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalManuals.toLocaleString()}+</p>
                <p className="text-gray-600">Manuais</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDownloads.toLocaleString()}+</p>
                <p className="text-gray-600">Downloads</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}+</p>
                <p className="text-gray-600">Clientes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.satisfactionRate}%</p>
                <p className="text-gray-600">Satisfação</p>
              </div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A TopManuais nasceu da necessidade de facilitar o acesso a manuais técnicos 
                  no Brasil. Percebemos que muitas pessoas tinham dificuldade em encontrar 
                  documentação para seus equipamentos, seja por perda do manual físico ou 
                  dificuldade de localização online.
                </p>
                <p>
                  Começamos em 2020 com uma pequena coleção de manuais automotivos e, 
                  graças à confiança dos nossos clientes, crescemos até nos tornarmos a 
                  maior biblioteca de manuais do país.
                </p>
                <p>
                  Hoje contamos com mais de 10.000 manuais em diversas categorias, 
                  desde automotivo até eletrônicos, sempre com o compromisso de oferecer 
                  documentação completa, atualizada e acessível.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=500&fit=crop"
                alt="Nossa equipe"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-[#007fff]/20 to-[#00bfff]/20 rounded-2xl -z-10" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nossos Valores
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Princípios que guiam nossas decisões e definem quem somos
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Differentials */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=500&fit=crop"
                alt="Nossos diferenciais"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Por Que Escolher a TopManuais?
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {differentials.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
