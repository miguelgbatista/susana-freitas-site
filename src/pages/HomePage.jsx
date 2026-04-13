import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HOME_WHATSAPP_LINK } from '../utils/whatsapp';
import { supabase } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <section className="relative h-[calc(100vh-76px)] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-[25%_center] md:bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/home-hero.png")' }}
      >
        {/* Removed overlay for lighter background images with dark text */}
      </div>

      {/* Content */}
      <div ref={heroRef} className="relative z-10 w-full text-right text-brand-espresso px-6 md:px-24 md:max-w-7xl ml-auto mt-4 md:mt-2">
        <div className="max-w-[200px] md:max-w-none ml-auto">
          <h1 className="font-serif text-3xl md:text-6xl font-light mb-4 md:mb-6 leading-tight md:whitespace-nowrap">
            Elegância <br className="md:hidden" />
            que <br className="md:hidden" />
            marca <br className="md:hidden" />
            presença.
          </h1>
          <p className="font-sans text-[13px] md:text-lg font-medium md:font-normal tracking-wide mb-8 md:mb-10 text-brand-espresso leading-relaxed md:whitespace-nowrap">
            Mais do que moda. Uma curadoria premium para mulheres maduras e seguras.
          </p>
        </div>
        
        <div className="w-full flex justify-center md:justify-end mt-28 md:mt-0 lg:block">
          <Link
            to="/catalogo"
            className="inline-flex items-center space-x-2 bg-brand-espresso text-white px-8 py-4 font-sans text-sm tracking-wider uppercase hover:bg-brand-mocha transition-colors rounded-full shadow-md"
          >
            <span className="font-bold brightness-125">Conheça a Seleção</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Institutional() {
  const sectionRef = useRef(null);
  const blocksRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      blocksRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    );
  }, []);

  const features = [
    { title: 'A Arte do Refinamento', text: 'Priorizamos a excelência nos tecidos e o caimento perfeito, trazendo peças que elevam sua estética de forma instintiva e duradoura.' },
    { title: 'Elegância Cotidiana', text: 'Roupas versáteis e atemporais, pensadas para transitar com facilidade do ambiente de trabalho aos compromissos sociais.' },
    { title: 'Seleção Exclusiva', text: 'Fugimos do excesso. Cada peça do nosso acervo é escolhida a dedo para compor um guarda-roupa coeso e sofisticado.' },
  ];

  return (
    <section id="curadoria" ref={sectionRef} className="py-24 md:py-32 bg-brand-pearl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {features.map((feat, i) => (
            <div key={i} ref={(el) => (blocksRef.current[i] = el)} className="text-center group">
              <div className="w-12 h-[1px] bg-brand-mocha mx-auto mb-8 transition-transform duration-500 group-hover:scale-150"></div>
              <h3 className="font-serif text-2xl text-brand-espresso mb-4">{feat.title}</h3>
              <p className="font-sans text-brand-espresso leading-relaxed font-normal md:font-light text-balance mx-auto max-w-xs">{feat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Collection({ images }) {
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      imagesRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      }
    );
  }, []);

  return (
    <section id="colecao" ref={sectionRef} className="pt-24 pb-12 md:pt-32 md:pb-16 bg-brand-linen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-espresso mb-6">Essência Contemporânea</h2>
          <p className="font-sans text-brand-espresso max-w-xl mx-auto font-normal md:font-light">
            Nossa seleção da temporada celebra a força e feminilidade através de cores terrosas, texturas nobres e recortes impecáveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

          {/* Foto grande - esquerda no desktop, 1ª no mobile */}
          <div className="h-[520px] overflow-hidden group rounded-[2rem]">
            <img 
              ref={(el) => (imagesRef.current[0] = el)} 
              src={images?.home_editorial_1 || "/images/catalog/1.png"} 
              alt="Editorial 1" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
          </div>

          {/* Texto - meio no desktop, 2º no mobile */}
          <div ref={(el) => (imagesRef.current[1] = el)} className="flex flex-col justify-center items-center text-center px-6 py-8">
            <div className="w-10 h-[1px] bg-brand-mocha mx-auto mb-6"></div>
            <h3 className="font-serif text-3xl text-brand-espresso mb-4">Luxo Silencioso</h3>
            <p className="font-sans text-brand-espresso font-medium md:font-light text-sm leading-relaxed mb-8 max-w-xs">
              Descubra peças que não precisam de exageros para se destacar. O segredo mora no corte e na escolha do fio.
            </p>
            <Link to="/catalogo" className="font-sans text-brand-mocha text-xs uppercase tracking-[0.2em] font-medium border-b border-brand-mocha pb-1 hover:text-brand-burgundy transition-colors">
              Ver Linha Clássica
            </Link>
          </div>

          {/* Foto pequena - direita no desktop, 3ª no mobile */}
          <div className="h-[520px] overflow-hidden group rounded-[2rem]">
            <img 
              ref={(el) => (imagesRef.current[2] = el)} 
              src={images?.home_editorial_2 || "/images/catalog/3.png"} 
              alt="Editorial 2" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
          </div>

        </div>
      </div>
    </section>
  );
}

function PersonalizedService() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, filter: 'blur(10px)' },
      {
        opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section id="atendimento" className="pt-12 pb-24 md:pt-16 md:pb-40 bg-brand-linen">
      <div className="max-w-4xl mx-auto px-6 text-center" ref={sectionRef}>
        {/* Elegant thin divider instead of icon */}
        <div className="w-12 h-[1px] bg-brand-mocha mx-auto mb-12"></div>
        
        <h2 className="font-serif text-4xl md:text-6xl text-brand-espresso mb-8 leading-tight">
          Uma Experiência<br />Dedicada a Você
        </h2>
        
        <p className="font-sans text-brand-espresso max-w-2xl mx-auto font-normal md:font-light leading-relaxed mb-14 text-lg md:text-xl">
          Não oferecemos apenas roupas. Nosso atendimento é próximo, humano e consultivo. Auxiliamos na escolha de peças que realçam sua melhor versão de forma autêntica e sofisticada.
        </p>
        
        <a 
          href={HOME_WHATSAPP_LINK} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center space-x-4 bg-brand-espresso text-brand-pearl px-12 py-5 font-sans text-[10px] tracking-[0.3em] uppercase hover:bg-brand-mocha transition-all rounded-full shadow-sm hover:shadow-lg translate-y-0 hover:-translate-y-1"
        >
          <span className="font-bold">Consultoria via WhatsApp</span>
        </a>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [homeImages, setHomeImages] = useState(null);

  useEffect(() => {
    async function fetchHomeConfig() {
      const { data } = await supabase.from('configuracoes').select('*');
      if (data) {
        const config = {};
        data.forEach(item => { config[item.chave] = item.valor; });
        setHomeImages(config);
      }
    }
    fetchHomeConfig();
  }, []);

  return (
    <div className="w-full">
      <Hero />
      <Institutional />
      <Collection images={homeImages} />
      <PersonalizedService />
    </div>
  );
}
