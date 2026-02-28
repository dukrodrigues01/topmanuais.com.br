// Tipos da plataforma TopManuais - VERSÃO OTIMIZADA

export interface Manual {
  id: string;
  title: string;
  slug?: string; // Adicionado para URLs amigáveis
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string; 
  brand: string;
  model: string;
  year?: number;
  image: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  pages?: number;
  languages?: string[]; // Alterado para array (suporte a múltiplos idiomas)
  fileSize?: string;
  fileFormat?: string; // Ex: PDF, Software
  status: 'draft' | 'published'; // Essencial para o Admin
  featured: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
  
  // --- CAMPOS PARA SEO ---
  seoTitle?: string;
  seoDescription?: string;
  focusKeywords?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image?: string;
  manualCount: number;
  // SEPARAÇÃO DE MARCAS E SUBCATEGORIAS
  subcategories: Subcategory[]; 
  brands: Brand[]; 
  featured: boolean;
  order: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  manualCount?: number;
}

// Interface para Marcas (Brands) independente de Subcategorias
export interface Brand {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

// --- RESTANTE DAS INTERFACES (Mantenha as que você já tem abaixo) ---

export interface CartItem {
  manual: Manual;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  downloadLinks: DownloadLink[];
  createdAt: string;
  paidAt?: string;
  expiresAt?: string;
}

export interface OrderItem {
  manual: Manual;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'paypal';
export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'refunded';

export interface DownloadLink {
  id: string;
  manualId: string;
  manualTitle: string;
  url: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  manualPurchased?: string;
  createdAt: string;
  verified: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  position: 'hero' | 'middle' | 'bottom';
  active: boolean;
  order: number;
}

export interface Stats {
  totalManuals: number;
  totalDownloads: number;
  totalCustomers: number;
  totalCategories: number;
  satisfactionRate: number;
}

export interface FilterOptions {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'bestselling' | 'rating';
  search?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
  purchases: Order[];
  favorites: string[];
  createdAt: string;
}