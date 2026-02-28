import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Clock, 
  Mail, 
  FileText,
  Copy,
  ExternalLink,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { useCheckout } from '@/context/CheckoutContext';
import { toast } from 'sonner';

// Simulação de links de download
const mockDownloadLinks = [
  {
    id: '1',
    manualTitle: 'Manual Ford Fiesta 2018 - Completo',
    fileName: 'manual_ford_fiesta_2018.pdf',
    fileSize: '45 MB',
    url: '#',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    downloadCount: 0,
    maxDownloads: 5,
  },
];

export function DownloadPage() {
  const { currentOrder, checkoutData } = useCheckout();
  const [countdown, setCountdown] = useState(5);
  const [canDownload, setCanDownload] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);

  // Countdown antes de permitir download
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanDownload(true);
    }
  }, [countdown]);

  const handleDownload = (linkId: string) => {
    if (!canDownload) return;
    
    // Simulação de download
    toast.success('Download iniciado!');
    setDownloadedFiles(prev => [...prev, linkId]);
    
    // Em uma aplicação real, aqui seria o redirecionamento para o arquivo
    // window.open(link.url, '_blank');
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success('Link copiado para a área de transferência!');
  };

  const formatExpiryDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-[70px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Message */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Pagamento Confirmado!
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              Seu pedido foi processado com sucesso. Os links de download foram 
              enviados para <strong>{checkoutData.customer.email || 'seu e-mail'}</strong>
            </p>
          </div>

          {/* Order Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#007fff]" />
                Informações do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Número do Pedido</p>
                  <p className="font-medium text-gray-900">{currentOrder?.orderNumber || 'TM-2024-001'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data da Compra</p>
                  <p className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Forma de Pagamento</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {currentOrder?.paymentMethod === 'pix' ? 'PIX' :
                     currentOrder?.paymentMethod === 'credit_card' ? 'Cartão de Crédito' :
                     currentOrder?.paymentMethod === 'boleto' ? 'Boleto' : 'PIX'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium text-[#007fff]">
                    R$ {currentOrder?.total.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Links */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="w-5 h-5 text-[#007fff]" />
                Seus Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Clock className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Os links expiram em <strong>30 dias</strong> e você pode fazer até{' '}
                  <strong>5 downloads</strong> por arquivo.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {mockDownloadLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {link.manualTitle}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {link.fileName} • {link.fileSize}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Expira em: {formatExpiryDate(link.expiresAt)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!canDownload ? (
                        <Button disabled className="bg-gray-200 text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          Aguarde {countdown}s
                        </Button>
                      ) : downloadedFiles.includes(link.id) ? (
                        <Button 
                          variant="outline"
                          onClick={() => handleDownload(link.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Novamente
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleDownload(link.id)}
                          className="bg-gradient-to-r from-[#007fff] to-[#0040ff]"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Agora
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyLink(link.url)}
                        title="Copiar link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email Notice */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Links enviados por e-mail
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Enviamos uma cópia dos links de download para{' '}
                    <strong>{checkoutData.customer.email || 'seu e-mail'}</strong>. 
                    Verifique sua caixa de entrada e spam.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Problemas com o download?
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Nosso suporte está disponível para ajudar você com qualquer problema.
                  </p>
                  <div className="flex gap-3">
                    <Link to="/contato">
                      <Button variant="outline" size="sm">
                        Falar com Suporte
                      </Button>
                    </Link>
                    <Link to="/faq">
                      <Button variant="ghost" size="sm" className="gap-1">
                        Ver FAQ
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-10">
            <Link to="/">
              <Button variant="outline" size="lg">
                Voltar para a Loja
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
