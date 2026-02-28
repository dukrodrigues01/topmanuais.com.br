import { useState } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';

const faqs = [
  {
    category: 'Compras',
    questions: [
      {
        q: 'Como funciona o processo de compra?',
        a: 'O processo é simples: 1) Escolha o manual desejado, 2) Adicione ao carrinho, 3) Finalize o pagamento, 4) Receba o link de download imediatamente no seu e-mail.',
      },
      {
        q: 'Quais formas de pagamento são aceitas?',
        a: 'Aceitamos PIX, cartão de crédito (Visa, Mastercard, Elo, American Express), boleto bancário e PayPal.',
      },
      {
        q: 'É seguro comprar no site?',
        a: 'Sim! Utilizamos criptografia SSL de 256 bits e gateways de pagamento certificados. Seus dados estão 100% protegidos.',
      },
      {
        q: 'Recebo nota fiscal?',
        a: 'Sim, emitimos nota fiscal eletrônica (NF-e) para todas as compras. Ela é enviada para o e-mail cadastrado em até 24 horas.',
      },
    ],
  },
  {
    category: 'Downloads',
    questions: [
      {
        q: 'Como recebo o manual após a compra?',
        a: 'Após a confirmação do pagamento, você recebe um e-mail com o link de download exclusivo. O acesso também está disponível na sua área do cliente.',
      },
      {
        q: 'Quanto tempo tenho para baixar o arquivo?',
        a: 'Você tem 30 dias para realizar o download a partir da data da compra. Recomendamos baixar o arquivo imediatamente.',
      },
      {
        q: 'Posso baixar o arquivo mais de uma vez?',
        a: 'Sim, cada arquivo pode ser baixado até 5 vezes durante o período de 30 dias.',
      },
      {
        q: 'Em qual formato os manuais são entregues?',
        a: 'A maioria dos manuais está em formato PDF, garantindo compatibilidade com todos os dispositivos.',
      },
      {
        q: 'O download é realmente instantâneo?',
        a: 'Sim! Para pagamentos via PIX e cartão de crédito, o download é liberado em segundos. Boleto pode levar até 3 dias úteis.',
      },
    ],
  },
  {
    category: 'Produtos',
    questions: [
      {
        q: 'Os manuais são completos?',
        a: 'Sim, todos os manuais são a versão completa e oficial fornecida pelos fabricantes, incluindo todas as informações técnicas.',
      },
      {
        q: 'Os manuais estão em português?',
        a: 'Sim, todos os nossos manuais estão em português do Brasil. Alguns manuais muito específicos podem estar em inglês ou espanhol.',
      },
      {
        q: 'Posso imprimir o manual?',
        a: 'Sim, você pode imprimir o manual quantas vezes desejar para uso pessoal.',
      },
      {
        q: 'O que fazer se não encontrar o manual que preciso?',
        a: 'Entre em contato conosco! Temos um acervo maior do que o disponível no site e podemos conseguir o manual para você.',
      },
    ],
  },
  {
    category: 'Reembolso',
    questions: [
      {
        q: 'Qual é a política de reembolso?',
        a: 'Oferecemos garantia de 7 dias. Se você não ficar satisfeito com o manual, devolvemos 100% do valor pago.',
      },
      {
        q: 'Como solicito reembolso?',
        a: 'Envie um e-mail para suporte@topmanuais.com com o número do pedido e motivo do reembolso. Analisamos em até 48 horas.',
      },
      {
        q: 'Em quanto tempo recebo o reembolso?',
        a: 'O reembolso é processado em até 5 dias úteis. O prazo para aparecer na sua fatura depende da operadora do cartão ou banco.',
      },
    ],
  },
  {
    category: 'Conta',
    questions: [
      {
        q: 'Preciso criar uma conta para comprar?',
        a: 'Não é obrigatório, mas recomendamos criar uma conta para ter acesso ao histórico de compras e downloads.',
      },
      {
        q: 'Como recupero minha senha?',
        a: 'Na página de login, clique em "Esqueceu a senha?" e siga as instruções enviadas para seu e-mail.',
      },
      {
        q: 'Posso alterar meu e-mail cadastrado?',
        a: 'Sim, acesse sua área do cliente, vá em "Configurações" e atualize seu e-mail. Será necessário confirmar o novo endereço.',
      },
    ],
  },
];

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredFaqs = searchQuery
    ? faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          q => 
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.questions.length > 0)
    : faqs;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-[70px]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0040ff] via-[#007fff] to-[#00bfff] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-xl text-white/90 mb-8">
              Encontre respostas para as dúvidas mais comuns
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar perguntas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-xl text-lg bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhuma pergunta encontrada para "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFaqs.map((category) => (
                <div key={category.category}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {category.category}
                  </h2>
                  <div className="space-y-3">
                    {category.questions.map((item, index) => {
                      const key = `${category.category}-${index}`;
                      const isOpen = openItems[key];
                      
                      return (
                        <div
                          key={key}
                          className="bg-white rounded-xl overflow-hidden shadow-sm"
                        >
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900 pr-4">
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5">
                              <p className="text-gray-600 leading-relaxed">
                                {item.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Não encontrou o que procurava?
            </p>
            <a
              href="/contato"
              className="inline-flex items-center gap-2 text-[#007fff] font-medium hover:underline"
            >
              Entre em contato conosco
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
