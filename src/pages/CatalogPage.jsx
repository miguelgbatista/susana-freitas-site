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
          // Fallback to static data if Supabase table is empty or has error
          setProducts(staticProducts);
        } else {
          // Map Supabase data to the format the component expects
          setProducts(data.map(p => ({
            name: p.name,
            price: p.price,
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

  // Animate products after they load
  useEffect(() => {
    if (!loading && products.length > 0) {
      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
        }
      );
    }
  }, [loading, products]);

  return (
    <div className="w-full min-h-screen bg-brand-pearl pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24" ref={catalogRef}>
          <h1 className="font-serif text-4xl md:text-6xl text-brand-espresso mb-6">
            Coleção Completa
          </h1>
          <p className="font-sans text-brand-espresso max-w-2xl mx-auto font-medium md:font-light mb-4">
            Curadoria detalhada para refletir a sua essência.
          </p>
          <div className="w-16 h-[1px] bg-brand-mocha mx-auto mt-8"></div>
        </div>

        {/* Grid Catalog */}
        {loading ? (
          <div className="text-center py-20 font-sans text-brand-espresso/50">
            Carregando catálogo...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 font-sans text-brand-espresso/50">
            Nenhum produto disponível no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product, idx) => (
              <div 
                key={idx} 
                ref={(el) => (itemsRef.current[idx] = el)}
                className="group flex flex-col"
                style={{ opacity: 0 }}
              >
                {/* Image Box */}
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-linen mb-6">
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
                  <h3 className="font-serif text-xl tracking-wide text-brand-espresso mb-2">
                    {product.name}
                  </h3>
                  <div className="font-sans text-sm tracking-widest text-brand-mocha mb-6 font-medium md:font-normal">
                    {product.price}
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
