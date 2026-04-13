import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contato" className="bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Bloco Superior - Marca */}
        <div className="flex flex-col items-center mb-20 text-center">
          <img src="/images/logo.png" alt="Logo" className="h-20 w-auto mb-8" />
          <h4 className="font-serif text-2xl text-white tracking-wide mb-4">Susana Freitas Store</h4>
          <p className="font-sans text-white font-bold text-sm max-w-md mx-auto leading-relaxed">
            Boutique feminina de alto padrão. Curadoria de moda para mulheres exigentes e sofisticadas.
          </p>
        </div>

        {/* Links e Redes Sociais */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-12 pb-12 gap-8">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 font-sans text-xs tracking-[0.2em] uppercase text-white font-bold">
            <Link to="/catalogo" className="hover:text-brand-fendi transition-colors">Catálogo</Link>
            <a href="#" className="hover:text-brand-fendi transition-colors">Atendimento WhatsApp</a>
          </div>

          <div className="flex items-center space-x-6 text-white/95">
             <a href="https://www.instagram.com/susanafreitasstore/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
               <Instagram size={20} strokeWidth={1.5} />
             </a>
          </div>
        </div>
        
        {/* Rodapé Final - Copyright e Avisos */}
        <div className="flex flex-col md:flex-row justify-between items-center font-sans text-[10px] text-white font-bold tracking-[0.2em] uppercase gap-4 text-center md:text-left">
          <p>Enviamos para todo o Brasil.</p>
          <p>&copy; {new Date().getFullYear()} Susana Freitas Store. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
