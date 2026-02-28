import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Facebook, 
  Instagram, 
  Youtube,
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  MessageCircle,
  Hash
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext'; // Importante para ler o Admin

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { siteSettings } = useAdmin(); // Puxa as configurações do seu Admin

  const footerLinks = {
    quickLinks: [
      { label: 'Home', href: '/' },
      { label: 'Manuais', href: '/manuais' },
      { label: 'Categorias', href: '/categorias' },
      { label: 'Sobre Nós', href: '/sobre' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
    support: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacidade', href: '/privacidade' },
      { label: 'Termos de Uso', href: '/termos' },
      { label: 'Reembolsos', href: '/reembolsos' },
      { label: 'Fale Conosco', href: '/contato' },
    ],
  };

  // Mapeia as redes sociais dinamicamente
  const socialLinks = [
    { icon: Facebook, href: siteSettings.facebookUrl, label: 'Facebook' },
    { icon: Instagram, href: siteSettings.instagramUrl, label: 'Instagram' },
    { icon: Hash, href: siteSettings.pinterestUrl, label: 'Pinterest' },
  ].filter(link => link.href); // Só mostra se você preencher no Admin

  return (
    <footer className="bg-[#121212] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Coluna da Marca */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                {siteSettings.storeName}
              </span>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              A maior biblioteca de documentação técnica do Brasil. 
              Conteúdo especializado para mecânicos, técnicos e entusiastas 
              com foco em precisão e entrega imediata.
            </p>
            
            {/* Informações de Contato Dinâmicas */}
            <div className="space-y-3">
              <a href={`mailto:${siteSettings.storeEmail}`} className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>{siteSettings.storeEmail || 'suporte@topmanuais.com'}</span>
              </a>
              
              {siteSettings.whatsappNumber && (
                <a href={`https://wa.me/${siteSettings.whatsappNumber}`} target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors text-sm font-medium">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <span>WhatsApp Suporte</span>
                </a>
              )}
              
              <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Brasil - Atendimento Digital</span>
              </div>
            </div>

            {/* Redes Sociais Dinâmicas */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="lg:pl-8">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-blue-500 mb-6">Navegação</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-white text-sm font-bold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-blue-500 mb-6">Ajuda</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-white text-sm font-bold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagamento Seguro (SEO Trust) */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-blue-500 mb-6">Segurança</h3>
            <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black uppercase text-gray-400">Checkout Seguro</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-black">PIX</div>
                <div className="h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-black">CARD</div>
              </div>
              <p className="text-[9px] text-gray-500 font-medium leading-tight">
                Seus dados são criptografados e protegidos por certificados SSL.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Final */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
              © {currentYear} {siteSettings.storeName}. Tecnologia de ponta em manuais técnicos.
            </p>
            <div className="flex gap-6 text-[11px] font-bold text-gray-600">
               <span>TOPMANUAIS_V3_SEO_FULL</span>
               <span>CNPJ: DIGITAL_CONTENT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}