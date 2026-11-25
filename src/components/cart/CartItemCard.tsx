import React, { useState } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { AdditionOption, CartItem, SauceOption } from '../../types/order';
import { formatCOP, getCartItemLineTotal, getCartItemUnitTotal } from '../../utils/formatters';
import { QuantityStepper } from '../ui/QuantityStepper';
import { SauceDropdown } from './SauceDropdown';
import { AdditionsDropdown } from './AdditionsDropdown';

interface CartItemCardProps {
  item: CartItem;
  sauces: SauceOption[];
  additions: AdditionOption[];
  onUpdate: (updater: (item: CartItem) => CartItem) => void;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  sauces,
  additions,
  onUpdate,
  onRemove,
}) => {
  const [noteOpen, setNoteOpen] = useState(item.note.length > 0);
  const unitTotal = getCartItemUnitTotal(item);
  const lineTotal = getCartItemLineTotal(item);
  const showNoteInput = noteOpen || item.note.length > 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 transition-colors hover:border-neutral-300">
      <div className="flex gap-4">
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-neutral-900 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-base text-[#0E0E10] truncate">{item.name}</h3>
              <p className="text-xs text-neutral-500 font-mono tabular-nums mt-0.5">
                Base {formatCOP(item.basePrice)}
                {unitTotal > item.basePrice && ` · Con adiciones ${formatCOP(unitTotal)} c/u`}
              </p>
            </div>

            <p className="font-mono text-base font-bold text-[#0E0E10] tabular-nums shrink-0">
              {formatCOP(lineTotal)}
            </p>
          </div>

          {item.supportsCustomization ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
              <SauceDropdown
                sauces={sauces}
                selectedSauces={item.selectedSauces}
                saucesOnSide={item.saucesOnSide}
                onChange={(nextSauces, onSide) =>
                  onUpdate((curr) => ({
                    ...curr,
                    selectedSauces: nextSauces,
                    saucesOnSide: onSide,
                  }))
                }
              />

              <AdditionsDropdown
                additions={additions}
                selectedAdditions={item.selectedAdditions}
                onChange={(nextAdditions) =>
                  onUpdate((curr) => ({
                    ...curr,
                    selectedAdditions: nextAdditions,
                  }))
                }
              />
            </div>
          ) : (
            <div className="mt-3">
              <input
                type="text"
                value={item.note}
                onChange={(e) => onUpdate((curr) => ({ ...curr, note: e.target.value }))}
                placeholder="Ej: Coca-Cola, Colombiana, Hit Mora..."
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-neutral-100">
            <QuantityStepper
              value={item.quantity}
              onDecrement={() =>
                item.quantity <= 1
                  ? onRemove()
                  : onUpdate((curr) => ({ ...curr, quantity: curr.quantity - 1 }))
              }
              onIncrement={() =>
                onUpdate((curr) => ({ ...curr, quantity: curr.quantity + 1 }))
              }
            />

            <div className="flex items-center gap-4">
              {item.supportsCustomization && !showNoteInput && (
                <button
                  type="button"
                  onClick={() => setNoteOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-[#0E0E10] transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Nota cocina</span>
                </button>
              )}

              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#D92525] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Quitar</span>
              </button>
            </div>
          </div>

          {item.supportsCustomization && showNoteInput && (
            <div className="mt-3">
              <input
                type="text"
                value={item.note}
                onChange={(e) => onUpdate((curr) => ({ ...curr, note: e.target.value }))}
                placeholder="Nota opcional (ej: sin tomate, papas bien crocantes...)"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10] focus:bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
