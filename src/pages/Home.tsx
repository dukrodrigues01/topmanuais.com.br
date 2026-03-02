import { Suspense, lazy } from 'react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { Hero } from '@/sections/Hero';
import { FeaturedManuals } from '@/sections/FeaturedManuals';

// Carregamento Tardio (Lazy Loading) para melhorar a performance (LCP)
const Features = lazy(() => import('@/sections/Features').then(m => ({ default: m.Features })));
const Categories = lazy(() => import('@/sections/Categories').then(m => ({ default: m.Categories })));
const HowItWorks = lazy(() => import('@/sections/HowItWorks').then(m => ({ default: m.HowItWorks })));
const Testimonials = lazy(() => import('@/sections/Testimonials').then(m => ({ default: m.Testimonials })));
const CTASection = lazy(() => import('@/sections/CTASection').then(m => ({ default: m.CTASection })));

// Componente de carregamento simples para as seções lazy
const SectionLoader = () => (
  <div className="h-40 w-full flex items-center justify-center bg-gray-50 animate-pulse rounded-xl">
    <div className="text-gray-300 font-medium">Carregando seção...</div>
  </div>
);

export function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Header Fixo ou Absoluto conforme seu design */}
      <Header />
      
      <main className="relative">
        {/* O Hero e os Manuais em Destaque carregam primeiro (importante para o usuário) */}
        <section id="hero">
          <Hero />
        </section>

        <section id="destaques" className="py-4">
          <FeaturedManuals />
        </section>

        {/* As seções abaixo usam Suspense para não travar o carregamento inicial */}
        <Suspense fallback={<SectionLoader />}>
          <div className="space-y-0">
            <section id="categorias">
              <Categories />
            </section>

            <section id="features">
              <Features />
            </section>

            <section id="como-funciona" className="bg-gray-50/50">
              <HowItWorks />
            </section>

            <section id="depoimentos">
              <Testimonials />
            </section>

            <section id="cta">
              <CTASection />
            </section>
          </div>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}