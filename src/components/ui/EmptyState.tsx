import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
      {icon && <div className="flex justify-center mb-3 text-neutral-300">{icon}</div>}
      <h2 className="font-display font-bold text-xl text-[#0E0E10] mb-1">{title}</h2>
      <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
