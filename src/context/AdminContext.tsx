import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { Manual } from '@/types';
import { manuals as initialManuals, categories as initialCategories } from '@/data/mockData';

interface AdminContextType {
  admin: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  products: Manual[];
  addProduct: (data: any) => void;
  updateProduct: (id: string, data: any) => void;
  deleteProduct: (id: string) => void;
  categories: any[];
  addCategory: (data: any) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (data: any) => void;
  deleteSubcategory: (catId: string, subId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<any>(null);
  const [products, setProducts] = useState<Manual[]>(() => {
    const saved = localStorage.getItem('admin_products');
    return saved ? JSON.parse(saved) : initialManuals;
  });
  const [categories, setCategories] = useState<any[]>(() => {
    const saved = localStorage.getItem('admin_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  useEffect(() => { localStorage.setItem('admin_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('admin_categories', JSON.stringify(categories)); }, [categories]);

  const login = useCallback(async (email: string, password: string) => {
    if (email === 'admin@topmanuais.com' && password === 'admin123') {
      setAdmin({ id: '1', name: 'Admin', role: 'admin' });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setAdmin(null), []);

  const addProduct = (data: any) => setProducts(prev => [{ ...data, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
  const updateProduct = (id: string, data: any) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const addCategory = (data: any) => setCategories(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), subcategories: [] }]);
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
  const addSubcategory = (data: any) => setCategories(prev => prev.map(c => c.id === data.categoryId ? { ...c, subcategories: [...(c.subcategories || []), { id: Math.random().toString(36).substr(2, 9), name: data.name, slug: data.slug }] } : c));
  const deleteSubcategory = (catId: string, subId: string) => setCategories(prev => prev.map(c => c.id === catId ? { ...c, subcategories: c.subcategories.filter((s: any) => s.id !== subId) } : c));

  const value = useMemo(() => ({
    admin, isAuthenticated: !!admin, login, logout, products, addProduct, updateProduct, deleteProduct, categories, addCategory, deleteCategory, addSubcategory, deleteSubcategory
  }), [admin, products, categories]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};