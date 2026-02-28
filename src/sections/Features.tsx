import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { 
  Library, 
  Download, 
  Tag, 
  Headphones, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';

const features = [
  {
    icon: Library,
    title: 'Biblioteca Completa',
    description: 'Mais de 10.000 manuais organizados por categoria e marca, facilitando sua busca.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Download,
    title: 'Download Imediato',
    description: 'Acesso instantâneo após a compra, sem espera. Baixe quando e onde quiser.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Tag,
    title: 'Preços Acessíveis',
    description: 'Manuais a partir de R$ 5,00 com qualidade garantida. Economize com a gente.',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Headphones,
    title: 'Suporte Especializado',
    description: 'Equipe pronta para ajudar com qualquer dúvida sobre os manuais.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: RefreshCw,
    title: 'Atualizações Constantes',
    description: 'Novos manuais adicionados toda semana. Sempre atualizado para você.',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    icon: ShieldCheck,
    title: 'Garantia de Qualidade',
    description: 'Todos os manuais verificados e completos. Satisfação garantida ou dinheiro de volta.',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
  },
];

export function Features() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { containerRef, visibleItems } = useStaggerAnimation(features.length, 100);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Por Que Escolher Nossa Plataforma?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#007fff] to-[#00bfff] mx-auto rounded-full mb-4" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A melhor experiência para encontrar e baixar manuais técnicos com 
            qualidade e segurança garantidas.
          </p>
        </div>

        {/* Features Grid */}
        <div 
          ref={containerRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 ${
                  visibleItems[index] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'inherit' }} />
                  <div className={`absolute w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#007fff] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#007fff]/20 transition-colors pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
