import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { Manual } from '@/types';
import { manuals as initialManuals, categories as initialCategories } from '@/data/mockData';

interface SiteSettings {
  googleAnalyticsId: string;
  googleVerification: string;
  baiduVerification: string;
  yandexVerification: string;
  facebookUrl: string;
  instagramUrl: string;
  pinterestUrl: string;
  whatsappNumber: string;
  storeName: string;
  storeEmail: string;
}

interface AdminContextType {
  admin: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  products: Manual[];
  setProducts: React.Dispatch<React.SetStateAction<Manual[]>>;
  addProduct: (data: any) => void;
  updateProduct: (id: string, data: any) => void;
  deleteProduct: (id: string) => void;
  categories: any[];
  addCategory: (data: any) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (data: any) => void;
  deleteSubcategory: (catId: string, subId: string) => void;
  addSubcategoryLevel2: (data: { categoryId: string, sub1Id: string, name: string, slug: string }) => void;
  deleteSubcategoryLevel2: (catId: string, sub1Id: string, sub2Id: string) => void;
  // Configurações Globais
  siteSettings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<any>(null);

  // 1. ESTADO DE PRODUTOS
  const [products, setProducts] = useState<Manual[]>(() => {
    const saved = localStorage.getItem('admin_products');
    return saved ? JSON.parse(saved) : initialManuals;
  });

  // 2. ESTADO DE CATEGORIAS
  const [categories, setCategories] = useState<any[]>(() => {
    const saved = localStorage.getItem('admin_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // 3. ESTADO DE CONFIGURAÇÕES (SEO, Redes Sociais, IDs)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('admin_site_settings');
    return saved ? JSON.parse(saved) : {
      googleAnalyticsId: 'G-XXXXXXXXXX',
      googleVerification: '',
      baiduVerification: '',
      yandexVerification: '',
      facebookUrl: '',
      instagramUrl: '',
      pinterestUrl: '',
      whatsappNumber: '',
      storeName: 'Top Manuais',
      storeEmail: 'contato@topmanuais.com'
    };
  });

  // PERSISTÊNCIA NO LOCALSTORAGE
  useEffect(() => { localStorage.setItem('admin_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('admin_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('admin_site_settings', JSON.stringify(siteSettings)); }, [siteSettings]);

  // AUTENTICAÇÃO
  const login = useCallback(async (email: string, password: string) => {
    if (email === 'admin@topmanuais.com' && password === 'admin123') {
      setAdmin({ id: '1', name: 'Admin', role: 'admin' });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setAdmin(null), []);

  // GERENCIAMENTO DE PRODUTOS
  const addProduct = (data: any) => setProducts(prev => [{ ...data, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
  const updateProduct = (id: string, data: any) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  // GERENCIAMENTO DE CATEGORIAS
  const addCategory = (data: any) => setCategories(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), subcategories: [] }]);
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
  
  const addSubcategory = (data: any) => setCategories(prev => prev.map(c => 
    c.id === data.categoryId 
      ? { ...c, subcategories: [...(c.subcategories || []), { id: Math.random().toString(36).substr(2, 9), name: data.name, slug: data.slug, subcategoriesL2: [] }] } 
      : c
  ));

  const deleteSubcategory = (catId: string, subId: string) => setCategories(prev => prev.map(c => 
    c.id === catId ? { ...c, subcategories: c.subcategories.filter((s: any) => s.id !== subId) } : c
  ));

  const addSubcategoryLevel2 = (data: { categoryId: string, sub1Id: string, name: string, slug: string }) => {
    setCategories(prev => prev.map(c => {
      if (c.id === data.categoryId) {
        return {
          ...c,
          subcategories: c.subcategories.map((s1: any) => {
            if (s1.id === data.sub1Id) {
              return {
                ...s1,
                subcategoriesL2: [...(s1.subcategoriesL2 || []), { id: Math.random().toString(36).substr(2, 9), name: data.name, slug: data.slug }]
              };
            }
            return s1;
          })
        };
      }
      return c;
    }));
  };

  const deleteSubcategoryLevel2 = (catId: string, sub1Id: string, sub2Id: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: c.subcategories.map((s1: any) => {
            if (s1.id === sub1Id) {
              return { ...s1, subcategoriesL2: s1.subcategoriesL2.filter((s2: any) => s2.id !== sub2Id) };
            }
            return s1;
          })
        };
      }
      return c;
    }));
  };

  // ATUALIZAR CONFIGURAÇÕES GLOBAIS
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = useMemo(() => ({
    admin, isAuthenticated: !!admin, login, logout,
    products, setProducts, addProduct, updateProduct, deleteProduct,
    categories, addCategory, deleteCategory, addSubcategory, deleteSubcategory,
    addSubcategoryLevel2, deleteSubcategoryLevel2,
    siteSettings, updateSettings
  }), [admin, products, categories, siteSettings]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};