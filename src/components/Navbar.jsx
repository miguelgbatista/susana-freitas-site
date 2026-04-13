import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../utils';
import { Link, useLocation } from 'react-router-dom';
import { HOME_WHATSAPP_LINK } from '../utils/whatsapp';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'py-3 bg-black/95 backdrop-blur-md shadow-sm' : 'py-4 bg-black border-b border-white/5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 font-serif text-2xl tracking-wide text-white">
          <img src="/images/logo.png" alt="Logo" className="h-[3.5rem] w-auto" />
          <span>Susana Freitas Store</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10 text-sm tracking-wide text-white uppercase">
          <Link to="/catalogo" className="hover:text-gray-300 transition-colors">Catálogo Completo</Link>
          <a href={HOME_WHATSAPP_LINK} target="_blank" rel="noreferrer" className="px-6 py-2 border border-white/20 hover:bg-white hover:text-black transition-all">
            Contato
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 overflow-hidden transition-all duration-300',
          menuOpen ? 'max-h-64 opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        )}
      >
        <div className="flex flex-col items-center space-y-6 text-sm tracking-wide text-white uppercase">
          <Link to="/catalogo" onClick={() => setMenuOpen(false)}>Catálogo Completo</Link>
          <a href={HOME_WHATSAPP_LINK} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Contato</a>
        </div>
      </div>
    </nav>
  );
}
