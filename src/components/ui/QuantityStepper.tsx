import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onDecrement,
  onIncrement,
}) => {
  return (
    <div className="inline-flex items-center gap-1 border border-neutral-200 rounded-lg p-0.5 bg-white">
      <button
        type="button"
        onClick={onDecrement}
        className="p-1.5 text-neutral-600 hover:text-[#0E0E10] hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
        aria-label="Disminuir cantidad"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center font-mono text-sm font-semibold tabular-nums text-[#0E0E10]">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className="p-1.5 text-neutral-600 hover:text-[#0E0E10] hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
