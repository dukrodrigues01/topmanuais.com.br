import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ChevronRight, 
  CreditCard, 
  QrCode, 
  Barcode,
  Lock,
  Check,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'pix', name: 'PIX', icon: QrCode, description: 'Pagamento instantâneo' },
  { id: 'credit_card', name: 'Cartão de Crédito', icon: CreditCard, description: 'Parcele em até 12x' },
  { id: 'boleto', name: 'Boleto Bancário', icon: Barcode, description: 'Vencimento em 3 dias' },
];

export function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { 
    checkoutData, 
    setCustomerData, 
    setPaymentMethod, 
    processCheckout, 
    isProcessing 
  } = useCheckout();
  
  const [step, setStep] = useState<'customer' | 'payment' | 'review'>('customer');

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-[70px]">
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-600 mb-6">
              Adicione alguns manuais ao carrinho para continuar com a compra.
            </p>
            <Link to="/manuais">
              <Button className="bg-gradient-to-r from-[#007fff] to-[#0040ff]">
                Explorar Manuais
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutData.customer.name || !checkoutData.customer.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (!checkoutData.paymentMethod) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }
    setStep('review');
  };

  const handleCompletePurchase = async () => {
    const checkoutItems = cart.items.map(item => ({
      manualId: item.manual.id,
      title: item.manual.title,
      price: item.manual.price,
      // @ts-ignore - downloadUrl from meta
      downloadUrl: item.manual.meta?.downloadUrl || `https://topmanuais.com/download/${item.manual.id}`,
    }));
    
    const success = await processCheckout(cart.total, checkoutItems);
    if (success) {
      clearCart();
      navigate('/download');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-[70px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-[#007fff]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/manuais" className="hover:text-[#007fff]">Manuais</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Checkout</span>
          </nav>

          {/* Progress */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'customer' ? 'text-[#007fff]' : 'text-green-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'customer' ? 'bg-[#007fff] text-white' : 'bg-green-100'
                }`}>
                  {step === 'customer' ? '1' : <Check className="w-5 h-5" />}
                </div>
                <span className="font-medium hidden sm:inline">Dados Pessoais</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200" />
              <div className={`flex items-center gap-2 ${
                step === 'payment' ? 'text-[#007fff]' : 
                step === 'review' ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'payment' ? 'bg-[#007fff] text-white' : 
                  step === 'review' ? 'bg-green-100 text-green-600' : 'bg-gray-200'
                }`}>
                  {step === 'review' ? <Check className="w-5 h-5" /> : '2'}
                </div>
                <span className="font-medium hidden sm:inline">Pagamento</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200" />
              <div className={`flex items-center gap-2 ${step === 'review' ? 'text-[#007fff]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'review' ? 'bg-[#007fff] text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="font-medium hidden sm:inline">Revisão</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Customer Data */}
              {step === 'customer' && (
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Dados Pessoais
                  </h2>
                  <form onSubmit={handleCustomerSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={checkoutData.customer.name || ''}
                          onChange={(e) => setCustomerData({ name: e.target.value })}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={checkoutData.customer.email || ''}
                          onChange={(e) => setCustomerData({ email: e.target.value })}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={checkoutData.customer.phone || ''}
                          onChange={(e) => setCustomerData({ phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          value={checkoutData.customer.cpf || ''}
                          onChange={(e) => setCustomerData({ cpf: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-[#007fff] to-[#0040ff]"
                      >
                        Continuar
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setStep('customer')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Forma de Pagamento
                    </h2>
                  </div>
                  
                  <RadioGroup
                    value={checkoutData.paymentMethod || ''}
                    onValueChange={(v) => setPaymentMethod(v as any)}
                    className="space-y-4"
                  >
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            checkoutData.paymentMethod === method.id
                              ? 'border-[#007fff] bg-[#007fff]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            checkoutData.paymentMethod === method.id
                              ? 'bg-[#007fff] text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </RadioGroup>

                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep('customer')}>
                      Voltar
                    </Button>
                    <Button 
                      onClick={handlePaymentSubmit}
                      className="bg-gradient-to-r from-[#007fff] to-[#0040ff]"
                    >
                      Continuar
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 'review' && (
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setStep('payment')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Revisar Pedido
                    </h2>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Dados do Cliente</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700"><strong>Nome:</strong> {checkoutData.customer.name}</p>
                      <p className="text-gray-700"><strong>E-mail:</strong> {checkoutData.customer.email}</p>
                      {checkoutData.customer.phone && (
                        <p className="text-gray-700"><strong>Telefone:</strong> {checkoutData.customer.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Forma de Pagamento</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700">
                        {paymentMethods.find(m => m.id === checkoutData.paymentMethod)?.name}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.manual.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                          <img
                            src={item.manual.image}
                            alt={item.manual.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.manual.title}</h4>
                            <p className="text-sm text-gray-500">{item.manual.category}</p>
                            <p className="text-[#007fff] font-semibold mt-1">
                              R$ {item.manual.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('payment')}>
                      Voltar
                    </Button>
                    <Button 
                      onClick={handleCompletePurchase}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-[#007fff] to-[#0040ff]"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Finalizar Compra
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Resumo do Pedido
                </h3>
                
                <div className="space-y-3 mb-4">
                  {cart.items.map((item) => (
                    <div key={item.manual.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 line-clamp-1">{item.manual.title}</span>
                      <span className="font-medium text-gray-900">
                        R$ {(item.manual.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">R$ {cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxa de processamento</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#007fff]">
                    R$ {cart.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>Pagamento 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
