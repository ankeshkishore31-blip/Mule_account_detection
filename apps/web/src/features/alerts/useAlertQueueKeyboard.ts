import { useEffect, RefObject } from 'react';
import { Alert } from '@mule-platform/shared-types';

interface KeyboardProps {
  alerts: Alert[];
  activeAlertId: string | null;
  setActiveAlertId: (id: string) => void;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onSelectAlertForDetail?: (alert: Alert) => void;
  searchInputRef: RefObject<HTMLInputElement>;
}

export function useAlertQueueKeyboard({
  alerts,
  activeAlertId,
  setActiveAlertId,
  setSelectedIds,
  onSelectAlertForDetail,
  searchInputRef,
}: KeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === searchInputRef.current && e.key !== 'Escape') {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setSelectedIds(new Set());
        return;
      }

      const currentIndex = alerts.findIndex(a => a.id === activeAlertId);

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        const nextIndex = Math.min(alerts.length - 1, currentIndex + 1);
        if (alerts[nextIndex]) setActiveAlertId(alerts[nextIndex].id);
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        if (alerts[prevIndex]) setActiveAlertId(alerts[prevIndex].id);
      } else if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        if (activeAlertId) {
          setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(activeAlertId)) next.delete(activeAlertId);
            else next.add(activeAlertId);
            return next;
          });
        }
      } else if (e.key === 'Enter') {
        const currentAlert = alerts.find(a => a.id === activeAlertId);
        if (currentAlert && onSelectAlertForDetail) {
          onSelectAlertForDetail(currentAlert);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [alerts, activeAlertId, setActiveAlertId, setSelectedIds, onSelectAlertForDetail, searchInputRef]);
}
