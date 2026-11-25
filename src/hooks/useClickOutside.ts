import { RefObject, useEffect } from 'react';

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  active: boolean,
  onClose: () => void
) {
  useEffect(() => {
    if (!active) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [ref, active, onClose]);
}
