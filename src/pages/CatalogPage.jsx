import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { supabase } from '../lib/supabase';
import { products as staticProducts } from '../data/catalog';
import { MessageCircle } from 'lucide-react';
import { buildProductWhatsAppLink } from '../utils/whatsapp';

export default function CatalogPage() {
  const catalogRef = useRef(null);
  const itemsRef = useRef([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Blusas', 'Vestidos', 'Calças', 'Saias', 'Conjuntos & Coletes', 'Tricôs'];

  // Fetch products from Supabase, fallback to static data
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error || !data || data.length === 0) {
          setProducts(staticProducts);
        } else {
          setProducts(data.map(p => ({
            name: p.name,
            price: p.price,
            original_price: p.original_price || p.price_from || null,
            category: p.category || 'Outros',
            image: p.image_url,
          })));
        }
      } catch (err) {
        console.error('Error fetching from Supabase:', err);
        setProducts(staticProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter products by active category
  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());

  // Animate products after filter changes or initial load
  useEffect(() => {
    if (!loading && filteredProducts.length > 0) {
      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }
  }, [loading, selectedCategory, filteredProducts]);

  return (
    <div className="w-full min-h-screen bg-brand-pearl pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16" ref={catalogRef}>
          <h1 className="font-serif text-4xl md:text-6xl text-brand-espresso mb-6">
            Coleção Completa
          </h1>
          <p className="font-sans text-brand-espresso max-w-2xl mx-auto font-medium md:font-light mb-4">
            Curadoria detalhada para refletir a sua essência.
          </p>
          <div className="w-16 h-[1px] bg-brand-mocha mx-auto mt-6"></div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 mb-16">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-sans text-xs tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-espresso text-brand-pearl shadow-md font-semibold'
                    : 'bg-brand-linen/60 text-brand-espresso hover:bg-brand-linen hover:text-brand-espresso'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid Catalog */}
        {loading ? (
          <div className="text-center py-20 font-sans text-brand-espresso/50">
            Carregando catálogo...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 font-sans text-brand-espresso/50">
            Nenhum produto nesta categoria no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product, idx) => (
              <div 
                key={`${product.name}-${idx}`} 
                ref={(el) => (itemsRef.current[idx] = el)}
                className="group flex flex-col"
              >
                {/* Image Box */}
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-linen mb-6 rounded-2xl">
                  {product.original_price && (
                    <span className="absolute top-3 right-3 z-10 bg-brand-burgundy text-white font-sans text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm font-medium">
                      Oportunidade
                    </span>
                  )}
                  <img 
                    src={product.image || product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-brand-espresso/0 group-hover:bg-brand-espresso/10 transition-colors duration-500"></div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-grow text-center">
                  {product.category && (
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-mocha/70 mb-1">
                      {product.category}
                    </span>
                  )}
                  <h3 className="font-serif text-xl tracking-wide text-brand-espresso mb-2">
                    {product.name}
                  </h3>
                  
                  {/* Prices: De / Por */}
                  <div className="font-sans text-sm tracking-widest text-brand-mocha mb-6 font-medium md:font-normal flex items-center justify-center gap-2">
                    {product.original_price ? (
                      <>
                        <span className="line-through text-brand-espresso/40 text-xs">
                          {product.original_price}
                        </span>
                        <span className="text-brand-burgundy font-semibold">
                          {product.price}
                        </span>
                      </>
                    ) : (
                      <span>{product.price}</span>
                    )}
                  </div>
                  
                  {/* WhatsApp Button */}
                  <a 
                    href={buildProductWhatsAppLink(product.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center space-x-2 border border-brand-espresso/20 px-4 py-3 text-brand-espresso font-sans text-xs tracking-wider uppercase hover:bg-brand-espresso hover:text-brand-pearl transition-all mt-auto mx-auto w-full max-w-[200px] rounded-full"
                  >
                    <MessageCircle size={14} />
                    <span className="font-semibold">Quero Essa Peça</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

