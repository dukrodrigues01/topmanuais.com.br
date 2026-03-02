import { Search, CreditCard, Download } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Escolha',
    description: 'Navegue por nossas categorias ou use a busca para encontrar o manual que você precisa. Temos mais de 10.000 opções disponíveis.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Pague',
    description: 'Finalize a compra com segurança usando PIX, cartão de crédito ou outras formas de pagamento. Processo rápido e protegido.',
    color: 'from-green-500 to-green-600',
  },
  {
    number: '03',
    icon: Download,
    title: 'Baixe',
    description: 'Receba o link de download imediato no seu e-mail. Acesse quando quiser e baixe quantas vezes precisar dentro do prazo.',
    color: 'from-purple-500 to-purple-600',
  },
];

export function HowItWorks() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#007fff] to-[#00bfff] mx-auto rounded-full mb-4" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Em apenas 3 passos simples você tem acesso ao seu manual
          </p>
        </div>

        {/* Steps */}
        <div 
          ref={stepsRef}
          className="relative"
        >
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gray-200">
            <div 
              className={`h-full bg-gradient-to-r from-[#007fff] via-[#00bfff] to-[#0040ff] transition-all duration-1000 ${
                stepsVisible ? 'w-full' : 'w-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`relative text-center transition-all duration-700 ${
                    stepsVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 200 + 300}ms` }}
                >
                  {/* Icon Container */}
                  <div className="relative inline-flex mb-6">
                    {/* Pulse Effect */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-20 animate-ping`} style={{ animationDuration: '2s' }} />
                    
                    {/* Icon Circle */}
                    <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-blue-500/30`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                      <span className="text-sm font-bold text-[#007fff]">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Badges */}
        <div 
          className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 delay-700 ${
            stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            { value: '100%', label: 'Seguro' },
            { value: '24h', label: 'Entrega' },
            { value: '30 dias', label: 'Garantia' },
            { value: '5x', label: 'Downloads' },
          ].map((badge) => (
            <div 
              key={badge.label}
              className="text-center p-6 rounded-xl bg-white shadow-sm"
            >
              <p className="text-2xl font-bold text-[#007fff] mb-1">{badge.value}</p>
              <p className="text-sm text-gray-500">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
