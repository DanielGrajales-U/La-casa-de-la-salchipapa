import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItem } from '../../types/order';
import { formatCOP } from '../../utils/formatters';
import { Button } from '../ui/Button';

interface FeaturedDishCarouselProps {
  items: MenuItem[];
  onOrderDish: (item: MenuItem) => void;
}

export const FeaturedDishCarousel: React.FC<FeaturedDishCarouselProps> = ({
  items,
  onOrderDish,
}) => {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;

  const active = items[index] || items[0];

  const handlePrev = () => setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const handleNext = () => setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <div className="max-w-3xl mx-auto mb-20">
      <div className="flex items-center justify-between gap-4 sm:gap-10">
        <button
          type="button"
          onClick={handlePrev}
          className="p-3 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:border-[#F5B800] transition-colors cursor-pointer shrink-0"
          aria-label="Plato destacado anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-black/70 bg-black mb-6">
            <img
              src={active.image}
              alt={active.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <span>Favorito en Tuluá</span>
            {active.servings && (
              <>
                <span aria-hidden="true">·</span>
                <span>{active.servings}</span>
              </>
            )}
          </div>

          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
            {active.name}
          </h3>
          <p className="text-sm sm:text-base text-neutral-400 max-w-md mb-5 leading-relaxed">
            {active.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="font-mono text-2xl font-semibold text-[#F5B800] tabular-nums">
              {formatCOP(active.price)}
            </span>
            <Button variant="danger" onClick={() => onOrderDish(active)} className="rounded-lg">
              Pedir y personalizar
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-6">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(idx)}
                aria-label={`Ver ${item.name}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === index ? 'w-7 bg-[#F5B800]' : 'w-2 bg-white/25 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="p-3 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:border-[#F5B800] transition-colors cursor-pointer shrink-0"
          aria-label="Siguiente plato destacado"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
