import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { toast } from 'sonner';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSent(true);
    toast.success('Mensagem enviada com sucesso!');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-mail',
      content: 'suporte@topmanuais.com',
      description: 'Respondemos em até 24h',
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: '(11) 4000-1234',
      description: 'Seg-Sex, 9h às 18h',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'São Paulo, SP',
      description: 'Brasil',
    },
    {
      icon: Clock,
      title: 'Horário',
      content: '24/7 Online',
      description: 'Suporte por e-mail',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-[70px]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0040ff] via-[#007fff] to-[#00bfff] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
              <p className="text-xl text-white/90">
                Estamos aqui para ajudar. Entre em contato conosco para qualquer 
                dúvida, sugestão ou suporte.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-[#007fff]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#007fff]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-900 font-medium">{item.content}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {isSent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-gray-600">
                    Agradecemos seu contato. Responderemos em breve.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Envie uma Mensagem
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        placeholder="Qual o assunto?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        placeholder="Digite sua mensagem..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#007fff] to-[#0040ff]"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* FAQ Preview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'Como funciona o download?',
                    a: 'Após a confirmação do pagamento, você recebe um link de download exclusivo no seu e-mail.',
                  },
                  {
                    q: 'Quanto tempo tenho para baixar?',
                    a: 'Você tem 30 dias para realizar o download, com até 5 tentativas por arquivo.',
                  },
                  {
                    q: 'Posso pedir reembolso?',
                    a: 'Sim, oferecemos garantia de 7 dias. Se não ficar satisfeito, devolvemos seu dinheiro.',
                  },
                  {
                    q: 'Os manuais são completos?',
                    a: 'Sim, todos os manuais são a versão completa e oficial do fabricante.',
                  },
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
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
