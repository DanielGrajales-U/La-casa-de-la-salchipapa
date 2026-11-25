import React, { useState, useRef, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { SauceOption } from '../../types/order';
import { useClickOutside } from '../../hooks/useClickOutside';

interface SauceDropdownProps {
  sauces: SauceOption[];
  selectedSauces: string[];
  saucesOnSide: boolean;
  onChange: (nextSauces: string[], onSide: boolean) => void;
}

export const SauceDropdown: React.FC<SauceDropdownProps> = ({
  sauces,
  selectedSauces,
  saucesOnSide,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => setOpen(false), []);
  useClickOutside(containerRef, open, handleClose);

  const toggleSauce = (name: string) => {
    const exists = selectedSauces.includes(name);
    const next = exists
      ? selectedSauces.filter((s) => s !== name)
      : [...selectedSauces, name];
    onChange(next, saucesOnSide);
  };

  const summary =
    selectedSauces.length === 0
      ? 'Sin salsas'
      : selectedSauces.length === sauces.length
        ? 'Todas las salsas'
        : selectedSauces.slice(0, 2).join(', ') +
          (selectedSauces.length > 2 ? ` +${selectedSauces.length - 2}` : '');

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-xs sm:text-sm transition-colors cursor-pointer ${
          open
            ? 'border-[#0E0E10] bg-neutral-50 text-[#0E0E10]'
            : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
        }`}
        aria-expanded={open}
      >
        <span className="truncate">
          <span className="text-neutral-500 font-normal">Salsas: </span>
          <span className="font-medium">
            {summary}
            {saucesOnSide && selectedSauces.length > 0 ? ' (aparte)' : ''}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 sm:w-72 mt-1.5 z-30 bg-white border border-neutral-200 rounded-xl shadow-xl p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
            <span className="text-xs font-semibold text-neutral-700">Elige tus salsas</span>
            <div className="flex items-center gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => onChange(sauces.map((s) => s.name), saucesOnSide)}
                className="text-[#D92525] font-medium hover:underline cursor-pointer"
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => onChange([], false)}
                className="text-neutral-500 hover:text-neutral-800 cursor-pointer"
              >
                Ninguna
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {sauces.map((sauce) => (
              <label
                key={sauce.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer text-xs text-neutral-800 select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedSauces.includes(sauce.name)}
                  onChange={() => toggleSauce(sauce.name)}
                  className="w-3.5 h-3.5 rounded accent-[#D92525]"
                />
                <span className="truncate">{sauce.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saucesOnSide}
                onChange={(e) => onChange(selectedSauces, e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-[#0E0E10]"
              />
              <span>Enviar salsas aparte</span>
            </label>
            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-semibold text-[#0E0E10] hover:underline cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
