import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, QueueFilter, RiskTier } from '@mule-platform/shared-types';
import { api } from '@/lib/api';
import { UndoToast } from '@mule-platform/ui-kit';
import { AlertFiltersRail } from './AlertFiltersRail';
import { AlertTableHeader } from './AlertTableHeader';
import { AlertVirtualTable } from './AlertVirtualTable';
import { AlertBulkActionBar } from './AlertBulkActionBar';
import { AlertTableSkeleton, AlertEmptyState, AlertErrorState, OfflineBanner } from './AlertStateViews';
import { AlertPiiModal } from './AlertPiiModal';
import { AlertQueueToolbar } from './AlertQueueToolbar';
import { useAlertQueueKeyboard } from './useAlertQueueKeyboard';

interface AlertQueueScreenProps {
  onSelectAlertForDetail?: (alert: Alert) => void;
  onLastSyncedUpdate?: (isoString: string) => void;
}

export const AlertQueueScreen: React.FC<AlertQueueScreenProps> = ({
  onSelectAlertForDetail,
  onLastSyncedUpdate,
}) => {
  const queryClient = useQueryClient();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [activeCategory, setActiveCategory] = useState<QueueFilter>('ALL');
  const [search, setSearch] = useState('');
  const [riskTier, setRiskTier] = useState<RiskTier | 'ALL'>('ALL');
  const [simulateError, setSimulateError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [piiModalAlert, setPiiModalAlert] = useState<Alert | null>(null);
  const [undoToast, setUndoToast] = useState<{ id: string; message: string; alertIds: string[] } | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['alerts', activeCategory, search, riskTier, simulateError],
    queryFn: async () => {
      const res = await api.getAlerts({ category: activeCategory, search, riskTier, simulateError });
      if (onLastSyncedUpdate) onLastSyncedUpdate(res.lastSynced);
      return res;
    },
    refetchInterval: isOffline ? false : 30000,
  });

  const alerts = useMemo(() => data?.items || [], [data?.items]);

  useEffect(() => {
    if (alerts.length > 0 && !activeAlertId) {
      setActiveAlertId(alerts[0].id);
    }
  }, [alerts, activeAlertId]);

  useAlertQueueKeyboard({
    alerts,
    activeAlertId,
    setActiveAlertId,
    setSelectedIds,
    onSelectAlertForDetail,
    searchInputRef,
  });

  const triageMutation = useMutation({
    mutationFn: api.triageAlerts,
    onSuccess: (_, vars) => {
      setSelectedIds(new Set());
      setUndoToast({
        id: `toast-${Date.now()}`,
        message: `${vars.alertIds.length} alert(s) ${vars.action === 'FREEZE' ? 'frozen' : 'triaged'}`,
        alertIds: vars.alertIds,
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const handleUndo = async () => {
    if (undoToast) {
      await api.undoTriage(undoToast.alertIds);
      setUndoToast(null);
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  };

  const handleToggleSelectAll = () => {
    setSelectedIds(selectedIds.size === alerts.length ? new Set() : new Set(alerts.map(a => a.id)));
  };

  const counts = data?.counts || { all: 0, myQueue: 0, highRisk: 0, rings: 0, newToday: 0 };

  return (
    <div className="flex-1 flex overflow-hidden bg-[var(--bg)]">
      <AlertFiltersRail
        activeCategory={activeCategory}
        onSelectCategory={c => {
          setActiveCategory(c);
          setSelectedIds(new Set());
        }}
        counts={counts}
        isSimulatedError={simulateError}
        onToggleSimulateError={() => setSimulateError(!simulateError)}
        isOfflineMode={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-[var(--surface)]">
        {isOffline && <OfflineBanner onReconnect={() => setIsOffline(false)} />}

        <AlertQueueToolbar
          ref={searchInputRef}
          search={search}
          onSearchChange={setSearch}
          riskTier={riskTier}
          onRiskTierChange={setRiskTier}
        />

        <AlertTableHeader
          allSelected={selectedIds.size === alerts.length && alerts.length > 0}
          onToggleSelectAll={handleToggleSelectAll}
          totalVisible={alerts.length}
        />

        {isLoading ? (
          <AlertTableSkeleton rows={15} />
        ) : isError ? (
          <AlertErrorState error={error as Error} onRetry={() => refetch()} />
        ) : alerts.length === 0 ? (
          <AlertEmptyState
            onResetFilters={() => {
              setActiveCategory('ALL');
              setSearch('');
              setRiskTier('ALL');
            }}
          />
        ) : (
          <AlertVirtualTable
            alerts={alerts}
            selectedIds={selectedIds}
            activeAlertId={activeAlertId}
            onToggleSelect={id =>
              setSelectedIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
            onSelectAlert={alert => {
              setActiveAlertId(alert.id);
              if (onSelectAlertForDetail) onSelectAlertForDetail(alert);
            }}
            onRevealPii={alert => setPiiModalAlert(alert)}
          />
        )}
      </main>

      <AlertBulkActionBar
        selectedCount={selectedIds.size}
        onFreeze={() => triageMutation.mutate({ action: 'FREEZE', alertIds: Array.from(selectedIds), analystId: 'ANALYST-104' })}
        onEscalate={() => triageMutation.mutate({ action: 'ESCALATE', alertIds: Array.from(selectedIds), analystId: 'ANALYST-104' })}
        onAssignToMe={() => triageMutation.mutate({ action: 'ASSIGN', alertIds: Array.from(selectedIds), analystId: 'ANALYST-104' })}
        onDismiss={() => triageMutation.mutate({ action: 'DISMISS', alertIds: Array.from(selectedIds), analystId: 'ANALYST-104' })}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      {undoToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <UndoToast id={undoToast.id} message={undoToast.message} onUndo={handleUndo} onDismiss={() => setUndoToast(null)} />
        </div>
      )}

      {piiModalAlert && <AlertPiiModal alert={piiModalAlert} onClose={() => setPiiModalAlert(null)} />}
    </div>
  );
};
