import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Order, Customer, PaymentMethod, DownloadLink } from '@/types';
import { toast } from 'sonner';

interface CheckoutData {
  customer: Partial<Customer>;
  paymentMethod: PaymentMethod | null;
}

interface CheckoutContextType {
  checkoutData: CheckoutData;
  currentOrder: Order | null;
  downloadLinks: DownloadLink[];
  setCustomerData: (data: Partial<Customer>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  processCheckout: (total: number, items: CheckoutItem[]) => Promise<boolean>;
  generateDownloadLinks: (orderId: string, items: CheckoutItem[]) => DownloadLink[];
  resetCheckout: () => void;
  isProcessing: boolean;
}

export interface CheckoutItem {
  manualId: string;
  title: string;
  price: number;
  downloadUrl: string;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// Email template for order confirmation
const createOrderEmailTemplate = (orderData: {
  customerName: string;
  orderNumber: string;
  products: { title: string; downloadUrl: string }[];
  total: number;
}) => {
  const productsList = orderData.products.map(p => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${p.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        <a href="${p.downloadUrl}" style="background: #007fff; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; display: inline-block;">Download</a>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pedido Confirmado - TopManuais</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <tr>
      <td style="background: linear-gradient(135deg, #0040ff, #007fff); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">TopManuais</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Sua compra foi confirmada!</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #333; margin: 0 0 20px 0;">Olá, ${orderData.customerName}!</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
          Agradecemos pela sua compra! Seu pedido <strong>#${orderData.orderNumber}</strong> foi processado com sucesso.
        </p>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Seus Produtos:</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
            <thead>
              <tr style="background: #e9ecef;">
                <th style="padding: 12px; text-align: left; border-radius: 6px 0 0 0;">Produto</th>
                <th style="padding: 12px; text-align: center; border-radius: 0 6px 0 0;">Download</th>
              </tr>
            </thead>
            <tbody>
              ${productsList}
            </tbody>
          </table>
        </div>

        <div style="background: #e8f4fd; border-left: 4px solid #007fff; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #004085; margin: 0; font-size: 14px;">
            <strong>Importante:</strong> Os links de download expiram em 30 dias e podem ser usados até 5 vezes.
          </p>
        </div>

        <p style="color: #666; line-height: 1.6; margin: 20px 0;">
          Se tiver alguma dúvida ou problema com o download, nossa equipe de suporte está pronta para ajudar.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://topmanuais.com/contato" style="background: #007fff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">Falar com Suporte</a>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          © 2024 TopManuais. Todos os direitos reservados.<br>
          São Paulo, SP - Brasil
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer: {},
    paymentMethod: null,
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const setCustomerData = useCallback((data: Partial<Customer>) => {
    setCheckoutData(prev => ({
      ...prev,
      customer: { ...prev.customer, ...data },
    }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setCheckoutData(prev => ({
      ...prev,
      paymentMethod: method,
    }));
  }, []);

  const sendOrderConfirmationEmail = useCallback(async (orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    products: { title: string; downloadUrl: string }[];
    total: number;
  }): Promise<boolean> => {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real application, this would call an API endpoint
    console.log('=== EMAIL ENVIADO ===');
    console.log('Para:', orderData.customerEmail);
    console.log('Assunto: Pedido Confirmado - TopManuais');
    console.log('Conteúdo HTML:', createOrderEmailTemplate(orderData));
    console.log('=====================');
    
    return true;
  }, []);

  const processCheckout = useCallback(async (total: number, items: CheckoutItem[]): Promise<boolean> => {
    if (!checkoutData.customer.email || !checkoutData.customer.name) {
      toast.error('Preencha seus dados pessoais');
      return false;
    }

    if (!checkoutData.paymentMethod) {
      toast.error('Selecione uma forma de pagamento');
      return false;
    }

    setIsProcessing(true);

    // Simulação de processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Criar pedido simulado
    const orderNumber = `TM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    // Generate download links
    const links: DownloadLink[] = items.map(item => ({
      id: Math.random().toString(36).substring(2, 9),
      manualId: item.manualId,
      manualTitle: item.title,
      url: item.downloadUrl,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      downloadCount: 0,
      maxDownloads: 5,
    }));

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      orderNumber,
      customer: {
        id: Math.random().toString(36).substring(2, 9),
        name: checkoutData.customer.name || '',
        email: checkoutData.customer.email || '',
        phone: checkoutData.customer.phone,
        cpf: checkoutData.customer.cpf,
        createdAt: new Date().toISOString(),
      },
      items: items.map(item => ({
        manual: {
          id: item.manualId,
          title: item.title,
          description: '',
          price: item.price,
          category: '',
          brand: '',
          model: '',
          image: '',
          rating: 0,
          reviewCount: 0,
          salesCount: 0,
          language: '',
          fileSize: '',
          fileFormat: '',
          inStock: true,
          featured: false,
          tags: [],
          createdAt: '',
          updatedAt: '',
        },
        quantity: 1,
        price: item.price,
      })),
      total,
      status: 'completed',
      paymentMethod: checkoutData.paymentMethod,
      paymentStatus: 'approved',
      downloadLinks: links,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setCurrentOrder(newOrder);
    setDownloadLinks(links);
    
    // Send confirmation email
    await sendOrderConfirmationEmail({
      customerName: checkoutData.customer.name,
      customerEmail: checkoutData.customer.email,
      orderNumber,
      products: items.map(item => ({
        title: item.title,
        downloadUrl: item.downloadUrl,
      })),
      total,
    });
    
    setIsProcessing(false);
    
    toast.success('Pagamento aprovado! E-mail de confirmação enviado.');
    return true;
  }, [checkoutData, sendOrderConfirmationEmail]);

  const generateDownloadLinks = useCallback((__orderId: string, items: CheckoutItem[]): DownloadLink[] => {
    const links: DownloadLink[] = items.map(item => ({
      id: Math.random().toString(36).substring(2, 9),
      manualId: item.manualId,
      manualTitle: item.title,
      url: item.downloadUrl,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      downloadCount: 0,
      maxDownloads: 5,
    }));
    
    setDownloadLinks(links);
    return links;
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckoutData({
      customer: {},
      paymentMethod: null,
    });
    setCurrentOrder(null);
    setDownloadLinks([]);
  }, []);

  const value = useMemo(() => ({
    checkoutData,
    currentOrder,
    downloadLinks,
    setCustomerData,
    setPaymentMethod,
    processCheckout,
    generateDownloadLinks,
    resetCheckout,
    isProcessing,
  }), [checkoutData, currentOrder, downloadLinks, isProcessing, setCustomerData, setPaymentMethod, processCheckout, generateDownloadLinks, resetCheckout]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
