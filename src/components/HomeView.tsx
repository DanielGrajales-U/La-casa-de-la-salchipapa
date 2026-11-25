import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  ArrowDown,
  MapPin,
  Clock,
  Phone,
  UtensilsCrossed,
  SlidersHorizontal,
} from 'lucide-react';
import { AppView, CategoryId, MenuItem } from '../types/order';
import { formatCOP } from '../utils/formatters';

interface HomeViewProps {
  menuItems: MenuItem[];
  restaurantInfo: {
    name: string;
    city: string;
    address: string;
    whatsapp: string;
    instagram: string;
    deliveryFee: number;
    freeDeliveryThreshold: number;
    hours: {
      weekdays: string;
      weekends: string;
    };
  };
  onAddToCart: (item: MenuItem, goToCart?: boolean) => void;
  onNavigate: (view: AppView) => void;
}

const CATEGORIES: { id: 'todas' | CategoryId; label: string }[] = [
  { id: 'todas', label: 'Todo el Menú' },
  { id: 'salchipapas', label: 'Salchipapas' },
  { id: 'hamburguesas', label: 'Hamburguesas' },
  { id: 'perros', label: 'Perros' },
  { id: 'gaseosas', label: 'Gaseosas' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  menuItems,
  restaurantInfo,
  onAddToCart,
  onNavigate,
}) => {
  const featuredItems = menuItems.filter((item) => item.featured);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'todas' | CategoryId>('todas');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const activeFeatured = featuredItems[carouselIndex] || menuItems[0];

  const filteredItems =
    selectedCategory === 'todas'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const handleQuickAdd = (item: MenuItem) => {
    onAddToCart(item, false);
    setRecentlyAddedId(item.id);
    window.setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === item.id ? null : prev));
    }, 1200);
  };

  const handlePrevFeatured = () => {
    setCarouselIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  };

  const handleNextFeatured = () => {
    setCarouselIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu-de-hoy');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-neutral-100">
      {/* SECTION 1: FULL-BLEED EDITORIAL HERO */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <img
          src="/src/assets/images/hero_salchipapa_feast_1795635656116.jpg"
          alt="Salchipapa, hamburguesa especial y perro caliente de La Casa de la Salchipapa"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0E0E10]"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display italic text-2xl sm:text-3xl text-[#F5B800] tracking-normal mb-3">
            Auténtico sabor de Tuluá, Valle
          </p>
          <h1 className="font-display font-bold text-white text-4xl sm:text-6xl lg:text-7xl leading-[1.06] tracking-tight mb-6">
            La Casa de la <span className="text-[#F5B800]">Salchipapa</span>
          </h1>
          <p className="text-neutral-200 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Salchipapas generosas, perros especiales y hamburguesas al mejor precio del sector.
            Arma tu pedido con salsas y adiciones exactas sin esperar respuesta por WhatsApp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={scrollToMenu}
              className="px-7 py-3.5 rounded-xl bg-[#F5B800] text-[#0E0E10] font-semibold text-sm sm:text-base hover:bg-[#e5ad00] transition-all duration-150 cursor-pointer whitespace-nowrap shadow-xl shadow-black/30"
            >
              Ver el menú y pedir
            </button>
            <button
              type="button"
              onClick={() => onNavigate('carrito')}
              className="px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold text-sm sm:text-base hover:bg-white/20 transition-all duration-150 cursor-pointer whitespace-nowrap"
            >
              Armar mi pedido
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToMenu}
          className="relative z-10 mt-16 flex flex-col items-center gap-2 text-xs tracking-widest text-neutral-300 hover:text-[#F5B800] transition-colors cursor-pointer"
          aria-label="Desplazar hacia el contenido"
        >
          <ArrowDown className="w-4 h-4" />
          <span>DESCUBRE EL MENÚ</span>
        </button>

        {/* Subtle Organic Torn-Edge Transition to White Story Section */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none"
        >
          <svg
            viewBox="0 0 1440 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-7 sm:h-10 text-white"
            preserveAspectRatio="none"
          >
            <path
              d="M0 44V18L42 26L88 12L145 24L210 10L275 23L342 14L410 27L488 12L560 22L632 9L710 25L785 11L862 24L940 13L1018 27L1095 10L1172 22L1248 13L1325 26L1390 15L1440 22V44H0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* SECTION 2: CRISP WHITE EDITORIAL STORY SECTION */}
      <section className="relative bg-white text-[#141417] py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-stretch">
            {/* Left Editorial Narrative */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="font-display italic text-3xl sm:text-4xl text-[#D92525] leading-none mb-2">
                Comienza con
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#0E0E10] mb-6">
                Nuestra Historia
              </h2>
              <p className="text-neutral-600 text-base leading-relaxed mb-5">
                En el corazón de Tuluá nos ganamos el cariño del barrio con una fórmula sencilla:
                porciones abundantes, ingredientes frescos, salsas de la casa y precios que se
                pueden disfrutar cualquier noche de la semana.
              </p>
              <p className="text-neutral-600 text-base leading-relaxed mb-8">
                Ahora pedir es todavía más rápido: eliges exactamente tus salsas, tus adiciones y si
                lo quieres a domicilio o para recoger, y tu comanda entra directo a nuestra cocina sin
                confusiones.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={scrollToMenu}
                  className="px-6 py-3 rounded-lg bg-[#F5B800] text-[#0E0E10] font-semibold text-sm hover:bg-[#e5ad00] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Explorar carta
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('central')}
                  className="text-sm font-semibold text-[#D92525] hover:text-[#a81b1b] underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Ver Central de Cocina
                </button>
              </div>
            </div>

            {/* Right 3 Clean Pillars + Editorial Overhead Photography */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-neutral-200">
                <div>
                  <p className="font-display font-bold text-base text-[#0E0E10] mb-1.5">
                    01. Sabor generoso
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Desde la Tradicional de $5.500 hasta la Yumbo familiar para 3 personas.
                  </p>
                </div>
                <div>
                  <p className="font-display font-bold text-base text-[#0E0E10] mb-1.5">
                    02. Pedido sin errores
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Define tus salsas y adiciones en un clic, sin largos mensajes por chat.
                  </p>
                </div>
                <div>
                  <p className="font-display font-bold text-base text-[#0E0E10] mb-1.5">
                    03. Directo a cocina
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Tu orden llega organizada a nuestra pantalla para despachar más rápido.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-[16/10]">
                <img
                  src="/src/assets/images/story_fastfood_board_1795635657704.jpg"
                  alt="Ingredientes frescos, papas crocantes, salchichas a la plancha, queso fundido y salsas"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Torn-Edge Transition into Dark Today's Menu */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none"
        >
          <svg
            viewBox="0 0 1440 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-7 sm:h-10 text-[#0E0E10]"
            preserveAspectRatio="none"
          >
            <path
              d="M0 44V20L54 11L115 26L180 14L250 25L320 12L395 27L468 13L542 24L618 11L695 26L770 15L845 25L920 12L998 26L1072 13L1148 24L1225 11L1302 25L1375 14L1440 22V44H0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* SECTION 3: DARK "MENÚ DE HOY" SPOTLIGHT + FULL INTERACTIVE CATALOG */}
      <section id="menu-de-hoy" className="bg-[#0E0E10] text-neutral-100 py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Editorial Heading matching Pinterest "Today's Menu" */}
          <div className="text-center mb-14">
            <p className="font-display italic text-2xl sm:text-3xl text-[#F5B800] mb-1">
              Especialidades de la casa
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
              Menú de Hoy
            </h2>
          </div>

          {/* Featured Circular Dish Spotlight Carousel */}
          <div className="max-w-3xl mx-auto mb-20">
            <div className="flex items-center justify-between gap-4 sm:gap-10">
              <button
                type="button"
                onClick={handlePrevFeatured}
                className="p-3 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:border-[#F5B800] transition-colors cursor-pointer shrink-0"
                aria-label="Plato destacado anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-black/70 bg-black">
                    <img
                      src={activeFeatured.image}
                      alt={activeFeatured.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                  <span>Favorito en Tuluá</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeFeatured.servings}</span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                  {activeFeatured.name}
                </h3>
                <p className="text-sm sm:text-base text-neutral-400 max-w-md mb-5 leading-relaxed">
                  {activeFeatured.description}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <span className="font-mono text-2xl font-semibold text-[#F5B800] tabular-nums">
                    {formatCOP(activeFeatured.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(activeFeatured, true)}
                    className="px-5 py-2.5 rounded-lg bg-[#D92525] text-white text-sm font-semibold hover:bg-[#b91c1c] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Pedir y personalizar
                  </button>
                </div>

                {/* Carousel Indicators */}
                <div className="flex items-center gap-2 mt-6">
                  {featuredItems.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCarouselIndex(idx)}
                      aria-label={`Ver ${item.name}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === carouselIndex ? 'w-7 bg-[#F5B800]' : 'w-2 bg-white/25 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextFeatured}
                className="p-3 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:border-[#F5B800] transition-colors cursor-pointer shrink-0"
                aria-label="Siguiente plato destacado"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Full Menu Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
            <div>
              <h3 className="font-display font-bold text-2xl text-white">Carta Completa</h3>
              <p className="text-sm text-neutral-400 mt-0.5">
                Precios reales del local · Personaliza salsas y adiciones en tu carrito
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Categorías del menú"
              className="flex flex-wrap items-center gap-1.5 bg-[#17171B] p-1 rounded-xl border border-white/10"
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#F5B800] text-[#0E0E10] font-semibold'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Uniform Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isAdded = recentlyAddedId === item.id;
              return (
                <article
                  key={item.id}
                  className="group flex flex-col bg-[#16161A] border border-white/10 rounded-xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div className="aspect-[4/3] w-full bg-black overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-1.5">
                      <span className="capitalize">{item.category}</span>
                      {item.servings && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="ml-auto">{item.servings}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-base text-white leading-snug">
                        {item.name}
                      </h4>
                      <span className="font-mono text-base font-semibold text-[#F5B800] tabular-nums shrink-0">
                        {formatCOP(item.price)}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-400 leading-relaxed mb-5 flex-1">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(item)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#F5B800] text-[#0E0E10] hover:bg-[#e5ad00]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 shrink-0" />
                            <span>Agregado</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 shrink-0" />
                            <span>Agregar</span>
                          </>
                        )}
                      </button>

                      {item.supportsCustomization && (
                        <button
                          type="button"
                          onClick={() => onAddToCart(item, true)}
                          className="p-2.5 rounded-lg border border-white/15 text-neutral-200 hover:text-white hover:border-[#F5B800] transition-colors cursor-pointer shrink-0"
                          title="Agregar y elegir salsas o adiciones"
                          aria-label={`Personalizar ${item.name}`}
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: EDITORIAL VISUAL BANNER + FOOTER */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/10">
        <img
          src="/src/assets/images/hero_salchipapa_feast_1795635656116.jpg"
          alt="Comida rápida preparada al instante en La Casa de la Salchipapa"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-[#0E0E10]/70 to-[#0E0E10]/85"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-display italic text-2xl sm:text-3xl text-white mb-1">
            Más rápido que escribir por WhatsApp
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#F5B800] tracking-tight mb-5">
            Tu antojo en un solo paso
          </h2>
          <p className="text-neutral-200 text-base max-w-xl mx-auto leading-relaxed mb-8">
            Organiza tus salsas, elige tus adiciones y confirma tu dirección o recogida en tienda.
            Nuestro equipo recibe la comanda lista para preparar al instante.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('carrito')}
              className="px-7 py-3.5 rounded-xl bg-[#F5B800] text-[#0E0E10] font-semibold text-sm hover:bg-[#e5ad00] transition-colors cursor-pointer whitespace-nowrap"
            >
              Ir a organizar mi pedido
            </button>
            <button
              type="button"
              onClick={() => onNavigate('central')}
              className="px-7 py-3.5 rounded-xl border border-white/25 bg-black/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Abrir Central de Pedidos</span>
            </button>
          </div>
        </div>
      </section>

      {/* CLEAN 3-COLUMN DARK FOOTER */}
      <footer className="bg-[#09090B] border-t border-white/10 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F5B800]" />
              Dónde Estamos
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {restaurantInfo.address}
              <br />
              Domicilios en toda Tuluá ({formatCOP(restaurantInfo.deliveryFee)} · Gratis desde{' '}
              {formatCOP(restaurantInfo.freeDeliveryThreshold)})
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F5B800]" />
              Horarios de Atención
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {restaurantInfo.hours.weekdays}
              <br />
              {restaurantInfo.hours.weekends}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#F5B800]" />
              Contacto Directo
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              WhatsApp: <span className="font-mono text-neutral-200">{restaurantInfo.whatsapp}</span>
              <br />
              Instagram: <span className="text-neutral-200">{restaurantInfo.instagram}</span>
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} La Casa de la Salchipapa · Tuluá, Valle del Cauca.</p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigate('carrito')}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Mi Pedido
            </button>
            <button
              type="button"
              onClick={() => onNavigate('central')}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Acceso Cocina y Dueño
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
