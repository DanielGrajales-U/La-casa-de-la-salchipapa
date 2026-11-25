import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { AppView, RestaurantInfo } from '../../types/order';
import { formatCOP } from '../../utils/formatters';

interface FooterProps {
  restaurant: RestaurantInfo;
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ restaurant, onNavigate }) => {
  return (
    <footer className="bg-[#09090B] border-t border-white/10 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#F5B800]" />
            Dónde Estamos
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {restaurant.address}
            <br />
            Domicilios en toda Tuluá ({formatCOP(restaurant.deliveryFee)} · Gratis desde{' '}
            {formatCOP(restaurant.freeDeliveryThreshold)})
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F5B800]" />
            Horarios de Atención
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {restaurant.hours.weekdays}
            <br />
            {restaurant.hours.weekends}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#F5B800]" />
            Contacto Directo
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            WhatsApp: <span className="font-mono text-neutral-200">{restaurant.whatsapp}</span>
            <br />
            Instagram: <span className="text-neutral-200">{restaurant.instagram}</span>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} {restaurant.name} · {restaurant.city}.</p>
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
  );
};
