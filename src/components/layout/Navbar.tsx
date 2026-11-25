import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { AppView } from '../../types/order';
import { formatCOP } from '../../utils/formatters';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView, scrollToMenu?: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  pendingOrdersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  cartSubtotal,
  pendingOrdersCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (view: AppView, scrollToMenu = false) => {
    setMobileMenuOpen(false);
    onNavigate(view, scrollToMenu);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark & Logo */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="pointer-events-auto flex items-center gap-2.5 bg-[#0E0E10]/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-left transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-[#F5B800] shrink-0 cursor-pointer"
          aria-label="Ir al inicio de La Casa de la Salchipapa"
        >
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-11-25_at_2.39.05_PM_325ef8e8.jpeg"
            alt="Logo La Casa de la Salchipapa"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-lg object-cover bg-black shrink-0"
          />
          <span className="font-display text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            La Casa de la <span className="text-[#F5B800]">Salchipapa</span>
          </span>
        </button>

        {/* Zone 2: Compact Centered Floating Nav */}
        <nav
          aria-label="Navegación principal"
          className="pointer-events-auto hidden md:flex items-center gap-7 bg-[#0E0E10]/90 backdrop-blur-md border border-white/10 rounded-xl px-6 py-2.5 shadow-lg shadow-black/25"
        >
          <NavLink active={currentView === 'home'} onClick={() => handleLinkClick('home')}>
            Inicio
          </NavLink>
          <NavLink active={false} onClick={() => handleLinkClick('home', true)}>
            Menú
          </NavLink>
          <NavLink active={currentView === 'carrito'} onClick={() => handleLinkClick('carrito')}>
            Mi Pedido
          </NavLink>
          <NavLink active={currentView === 'central'} onClick={() => handleLinkClick('central')}>
            <span>Central de Pedidos</span>
            {pendingOrdersCount > 0 && (
              <span className="font-mono text-[11px] font-semibold text-[#F5B800] tabular-nums ml-1.5">
                ({pendingOrdersCount})
              </span>
            )}
          </NavLink>
        </nav>

        {/* Zone 3: Corner Cart Button + Mobile Toggle */}
        <div className="pointer-events-auto flex items-center gap-2 shrink-0">
          <Button
            variant={currentView === 'carrito' ? 'danger' : 'primary'}
            onClick={() => handleLinkClick('carrito')}
            className="shadow-lg shadow-black/25 px-4"
            aria-label={`Ver carrito con ${cartCount} productos`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="font-mono text-xs font-bold tabular-nums opacity-90">
              {cartCount > 0 ? `${cartCount} · ${formatCOP(cartSubtotal)}` : '0'}
            </span>
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2.5 rounded-xl bg-[#0E0E10]/90 border border-white/10 text-white hover:border-white/25 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 max-w-sm ml-auto bg-[#141417]/95 backdrop-blur-md border border-white/15 rounded-xl p-2 shadow-2xl space-y-0.5">
          <MobileNavLink active={currentView === 'home'} onClick={() => handleLinkClick('home')}>
            Inicio
          </MobileNavLink>
          <MobileNavLink active={false} onClick={() => handleLinkClick('home', true)}>
            Menú de Hoy
          </MobileNavLink>
          <MobileNavLink
            active={currentView === 'carrito'}
            onClick={() => handleLinkClick('carrito')}
          >
            Mi Pedido ({cartCount})
          </MobileNavLink>
          <MobileNavLink
            active={currentView === 'central'}
            onClick={() => handleLinkClick('central')}
          >
            <span className="flex items-center justify-between w-full">
              <span>Central de Pedidos</span>
              {pendingOrdersCount > 0 && (
                <span className="font-mono text-xs text-[#F5B800] tabular-nums">
                  {pendingOrdersCount} activos
                </span>
              )}
            </span>
          </MobileNavLink>
        </div>
      )}
    </header>
  );
};

const NavLink: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-0.5 flex items-center cursor-pointer ${
      active ? 'text-white' : 'text-neutral-300 hover:text-white'
    }`}
  >
    {children}
    {active && <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#F5B800]" />}
  </button>
);

const MobileNavLink: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
      active ? 'bg-white/10 text-[#F5B800]' : 'text-neutral-200 hover:bg-white/5'
    }`}
  >
    {children}
  </button>
);
