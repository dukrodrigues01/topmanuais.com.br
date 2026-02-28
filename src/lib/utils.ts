import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Função cn: Essencial para os componentes do Shadcn/UI (botões, cards, etc)
 * Resolve o erro de build no button.tsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Função formatPrice: Formata valores numéricos para R$
 * Blindada para evitar erros de 'toLocaleString' com valores nulos
 */
export const formatPrice = (price: number | string | undefined | null) => {
  // Converte para número e garante que seja pelo menos 0
  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(',', '.')) 
    : price;
    
  const safePrice = (numericPrice && !isNaN(numericPrice as number)) 
    ? (numericPrice as number) 
    : 0;

  return safePrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};