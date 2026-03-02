import { Manual, Category } from '@/types';

// 1. Estatísticas do Hero
export const stats = [
  { label: 'Manuais Disponíveis', value: 15000, suffix: '+' },
  { label: 'Downloads Realizados', value: 50000, suffix: '+' },
  { label: 'Marcas Atendidas', value: 120, suffix: '+' },
  { label: 'Suporte Online', value: 24, suffix: 'h' }
];

// 2. Depoimentos
export const testimonials = [
  {
    id: 1,
    content: "Excelente material. O manual de serviço da minha Honda era exatamente o que eu precisava.",
    author: "Marcos Silva",
    role: "Mecânico",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  }
];

// 3. Marcas
export const brands = [
  { name: 'Honda', logo: 'https://topmanuais.com/up/logos/honda.png' },
  { name: 'Yamaha', logo: 'https://topmanuais.com/up/logos/yamaha.png' }
];

// 4. Categorias Iniciais
export const categories: Category[] = [
  {
    id: 'cat-motos',
    name: 'Motocicletas',
    slug: 'motocicletas',
    icon: 'Bike',
    subcategories: []
  }
];

// 5. Manuais
export const manuals: Manual[] = [
  {
    id: 'init-1',
    name: 'Manual de Exemplo',
    brand: 'Geral',
    model: 'Modelo',
    price: 139.90,
    category: 'motocicletas',
    subcategory: 'manuais-de-servico',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800',
    description: 'Carregando banco de dados...',
    featured: true,
    downloadUrl: '#'
  }
];

// 6. DADOS DE ADMINISTRAÇÃO E USUÁRIOS
export const currentUser = {
  id: 'admin-1',
  name: 'Administrador',
  email: 'admin@topmanuais.com',
  role: 'admin'
};

export const users = [
  {
    id: 'admin-1',
    name: 'Administrador',
    email: 'admin@topmanuais.com',
    role: 'admin'
  }
];

export const orders = [
  {
    id: 'ord-1',
    customerName: 'Cliente Teste',
    customerEmail: 'cliente@teste.com',
    date: new Date().toISOString(),
    status: 'completed',
    total: 139.90,
    items: [{ id: 'init-1', name: 'Manual de Exemplo', price: 139.90 }]
  }
];

export const customers = [
  {
    id: 'cus-1',
    name: 'Cliente Teste',
    email: 'cliente@teste.com',
    orders: 1,
    totalSpent: 139.90
  }
];

// 7. FUNÇÕES DE BUSCA E FILTRO
export const getFeaturedManuals = () => {
  return (manuals || [])
    .filter(m => m.featured && m.status === 'published')
    .map(m => ({
      ...m,
      price: Number(m.price) || 0 // Garante que o preço nunca seja undefined
    }));
};
export const getManualById = (id: string) => manuals.find(m => m.id === id);
export const getRelatedManuals = (id: string, category: string) => 
  manuals.filter(m => m.category === category && m.id !== id).slice(0, 4);
export const getManualsByCategory = (categorySlug: string) => 
  manuals.filter(m => m.category === categorySlug);
export const searchManuals = (query: string) => {
  const q = query.toLowerCase();
  return manuals.filter(m => m.name.toLowerCase().includes(q));
};

// 8. Links do Rodapé
export const footerLinks = {
  company: [
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
    { label: 'FAQ', href: '/faq' }
  ],
  legal: [
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Privacidade', href: '/privacidade' },
    { label: 'Reembolsos', href: '/reembolsos' }
  ]
};