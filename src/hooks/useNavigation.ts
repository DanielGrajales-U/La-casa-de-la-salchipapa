import { useState, useCallback } from 'react';
import { AppView } from '../types/order';

export function useNavigation(initialView: AppView = 'home') {
  const [currentView, setCurrentView] = useState<AppView>(initialView);

  const navigate = useCallback((view: AppView, scrollToMenu = false) => {
    setCurrentView(view);
    if (view === 'home' && scrollToMenu) {
      window.setTimeout(() => {
        const el = document.getElementById('menu-de-hoy');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return { currentView, navigate };
}
